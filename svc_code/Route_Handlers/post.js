const { log } = require('console');
const { db, admin } = require('../firebase');
const validationMap = require('../validationMap');

const post_questions = async (req, res) => {
  try {
    const { version, questions } = req.body;

    // Validate that the request body contains a version and questions
    if (!version || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request body, expected a version and an array of questions'
      });
    }

    // console.log(`Questions: ${questions.length} questions received`);

    const createdQuestions = [];

    // Check if the version is supported and validate accordingly
    const validate = validationMap[version];
    if (!validate) {
      return res.status(400).json({
        status: 'error',
        message: `Unsupported version ${version}`
      });
    }

    // Fetch current tags from the Tags/Tags document
    const tagsDoc = await db.collection('Tags').doc('Tags').get();
    // console.log(tagsDoc.exists);
    let currentTags = tagsDoc.exists ? tagsDoc.data().tags : [];
    // console.log(currentTags);
    const newTags = new Set();

    // Process each question and create in Firestore
    for (const question of questions) {
      question.version = version;

      // Validate question based on its version schema
      if (!validate(question)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid question format or missing required fields for version ${version}`
        });
      }

      // Check for new tags in the question
      if (question.selectedTags && Array.isArray(question.selectedTags)) {
        question.selectedTags.forEach(tag => {
          // console.log(tag);
          // console.log(currentTags);
          if ((!currentTags.includes(tag))) {
            newTags.add(tag);
          }
        });
      }

      // Create new question document in Firestore
      const newQuestionRef = await db.collection('questions').add(question);
      createdQuestions.push({ id: newQuestionRef.id });
      
    }

    // If there are new tags, update the Tags/Tags document
    if (newTags.size > 0) {
      currentTags = [...currentTags, ...Array.from(newTags)];
      await db.collection('Tags').doc('Tags').set({ tags: currentTags }, { merge: true });
    }

    res.status(200).json({
      status: 'success',
      message: 'Questions created successfully',
      data: createdQuestions
    });
  } catch (error) {
    console.error('Error creating questions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating questions'
    });
  }
};

module.exports = { post_questions };
