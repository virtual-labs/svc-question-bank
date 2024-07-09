const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/fetch-github-file', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      console.error(`Network response was not ok: ${response.statusText}`);
      return res.status(response.status).send('Error fetching the file');
    }

    const data = await response.json();
    console.log('Data:', data);

    res.json(data);
    console.log('Response sent:', res);

  } catch (error) {
    console.error('Error fetching the GitHub file:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`CORS proxy server running on port ${port}`);
});
