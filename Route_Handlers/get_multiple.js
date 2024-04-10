const { db } = require("../firebase.js");

const get_search_and_difficulty = async (req, res) => {
  try {
    const { tag, difficulty, creator } = req.query; // Extract tag, difficulty, and creator from query parameters

    // Query Firestore based on tag, difficulty, and/or creator
    let query = db.collection('questions');
    if (tag) {
      query = query.where('selectedTags', 'array-contains', tag);
    }
    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }
    if (creator) {
      query = query.where('creator', '==', creator);
    }

    const snapshot = await query.get();
    const questions = [];
    snapshot.forEach((doc) => {
      questions.push(doc.data());
    });

    res.status(200).json({
      status: 'success',
      data: {
        questions: questions
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching questions'
    });
  }
};

module.exports = { get_search_and_difficulty };
