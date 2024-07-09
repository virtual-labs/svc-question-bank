const { google } = require('googleapis');
const { parse } = require('csv-parse/sync');
const { execPath } = require('process');

const get_github = async (req, res) => {
    const { url } = req.query;
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).send('Authorization header is missing');
    }

    try {
        // Step 1: Convert repo link to raw GitHub user link for the markdown file
        const fetch = (await import('node-fetch')).default;
        const repoPath = url.replace('https://github.com/', '');
        const markdownUrl = `https://raw.githubusercontent.com/${repoPath}/main/experiment/experiment-name.md`;

        // Fetch the markdown file
        const response = await fetch(markdownUrl);
        if (!response.ok) {
            console.error(`Network response was not ok: ${response.statusText}`);
            return res.status(response.status).send('Error fetching the markdown file');
        }

        const markdownData = await response.text();
        const lins = markdownData.split('\n').filter(line => /^#+/.test(line));

        // Extract the first line since it's guaranteed to be the longest due to the filter
        let Exp_Name = lins.length > 0 ? lins[0].replace(/^#+/, '').trim() : null;
        console.log("Experiment Name: ", Exp_Name);
        // Step 2: Retrieve tags from public Google Sheets
        const sheetId = '1x12nhpp0QvnsA6x-O1sV4IA9SAbfVsq_wiexWkutOmU';
        const gid = '1722069818';
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&tq&gid=${gid}`;

        const sheetResponse = await fetch(sheetUrl);
        if (!sheetResponse.ok) {
            console.error(`Network response was not ok: ${sheetResponse.statusText}`);
            return res.status(sheetResponse.status).send('Error fetching the sheet');
        }

        const sheetData = await sheetResponse.text();

        const lines = sheetData.trim().split('\n');

        // Extract the second row to use as headers
        const headerRow = lines[1].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));

        // Extract the remaining data lines
        const dataLines = lines.slice(2).join('\n');

        // Define the custom header function
        const records = parse(dataLines, {
            columns: headerRow,       // Use the extracted second row as headers
            skip_empty_lines: true,   // Skip empty lines
            relax_column_count: true, // Allow rows with different column counts
            delimiter: ',',           // Use comma as the delimiter
        });

        // Ensure the headers cover columns A to O
        const maxColumns = 16; // A to O
        const headers = headerRow.slice(0, maxColumns);
        while (headers.length < maxColumns) {
            headers.push('');
        }

        // Adjust records to only include the first 15 columns and fill missing columns with empty strings
        const adjustedRecords = records.map(record => {
            const adjustedRecord = {};
            headers.forEach((header, index) => {
                adjustedRecord[header] = record[header] ? record[header].trim() : '';
            });
            return adjustedRecord;
        });

        const rows = records.map(record => {
            const filteredRecord = {};
            Object.keys(record).slice(0, 16).forEach((key, index) => {
                filteredRecord[key] = record[key] ? record[key].trim().replace(/^"|"$/g, '') : '';
            });
            return filteredRecord;
        });


        const experimentIndex = headers.indexOf('Source Repo ');
        const tagsIndex = headers.indexOf('Tags');
        console.log(tagsIndex, " ", experimentIndex);
        let Exp_Tags;
        for (const row of rows) {
            if (row[headers[experimentIndex]] !== undefined) {
                row[headers[experimentIndex]] = row[headers[experimentIndex]].trim().replace(/"/g, '');
            }
            if (row[headers[experimentIndex]] === url) {
                try {
                    const Tag_list = row[headers[tagsIndex]];
                    console.log(Tag_list);

                    // Split the Tag_list string by commas, trim any extra spaces, and convert to lowercase
                    Exp_Tags = Tag_list.split(',').map(tag => tag.trim().toLowerCase());

                } catch (e) {
                    console.error('Error parsing tags:', e);
                }
                break;
            }
        }
        console.log('Experiment Tags:', Exp_Tags);

        // Step 3: Check for 'experiment-descriptor.json' in the root directory
        const descriptorUrl = `https://raw.githubusercontent.com/${repoPath}/main/experiment-descriptor.json`;
        const descriptorResponse = await fetch(descriptorUrl);
        if (!descriptorResponse.ok) {
            console.error(`Network response was not ok: ${descriptorResponse.statusText}`);
            return res.status(descriptorResponse.status).send('Error fetching the descriptor file');
        }

        const descriptorData = await descriptorResponse.json();
        let Exp_Source_files = [];

        const traverseLearningUnits = (units, baseDir) => {
            units.forEach(unit => {
                if (unit['unit-type'] === 'lu') {
                    const newBaseDir = `${baseDir}/${unit['basedir']}`;
                    traverseLearningUnits(unit.units, newBaseDir);
                } else if (unit['content-type'] === 'assesment') {
                    const sourcePath = `${baseDir}/${unit.source}`;
                    Exp_Source_files.push(sourcePath);
                }
            });
        };

        traverseLearningUnits(descriptorData.units, '');

        console.log('Assessment Source Files:', Exp_Source_files);

        if (Exp_Source_files.length == 0) {
            // return res.status(200).send('No JSON file present in REPO');

            const jsonResponse = { message: 'No JSON file present in REPO' };

            // Send the JSON object as the response
            return res.status(200).json(jsonResponse);


        }
        // Fetch all JSON files
        const selectedTags = JSON.stringify(Exp_Tags);
        const fetchedJsonFiles = await Promise.all(
            Exp_Source_files.map(async sourceFile => {
                const fileUrl = `https://raw.githubusercontent.com/${repoPath}/main/experiment${sourceFile}`;
                const fileResponse = await fetch(fileUrl);
                if (!fileResponse.ok) {
                    console.error(`Network response was not ok for ${fileUrl}: ${fileResponse.statusText}`);
                    return null;
                }
                const jsonData = await fileResponse.json();

                // Add selectedTags to each question
                if (jsonData.questions && Array.isArray(jsonData.questions)) {
                    jsonData.questions.forEach(question => {
                        question.selectedTags = Exp_Tags;
                    });
                }

                console.log(jsonData);

                const postResponse = await fetch('https://vlabs-question-bank.el.r.appspot.com/api/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authorizationHeader,
                    },
                    body: JSON.stringify(jsonData),
                });

                if (!postResponse.ok) {

                    console.error(`Failed to post data: ${postResponse.statusText}`);
                    console.log(sourceFile);
                    return null;
                }

                const postResult = await postResponse.json();
                return postResult;
            })
        );

        // Filter out null responses
        const successfulResponses = fetchedJsonFiles.filter(response => response !== null);

        if (successfulResponses.length === 0) {
            const jsonResponse = { message: 'No Version Supported' };

            // Send the JSON object as the response
            return res.status(200).json(jsonResponse);

        }

        res.json(successfulResponses);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { get_github };
