const { db } = require("../firebase.js");

const get_search_and_difficulty = async (req, res) => {

  // console.log(req.headers);

  try {
    const isEmpty = Object.keys(req.query).length === 0;
    // console.log(isEmpty);
    let fl = 0
    if (!isEmpty) {
      const { tags, difficulty, user } = req.query; // Extract tags, difficulty, and creator from query parameters
      if (!user && !difficulty && !tags) {
        fl = 1
      }
      // Split tags string into an array
      const tagsArray = tags ? tags.split(",") : [];

      // Fetch all questions if tagsArray is empty, otherwise fetch questions based on tags
      let matchingQuestions = [];
      if (tagsArray.length > 0) {
        const firstTagQuery = db.collection('questions').where('selectedTags', 'array-contains', tagsArray[0]);
        const firstTagSnapshot = await firstTagQuery.get();

        firstTagSnapshot.forEach(doc => {
          matchingQuestions.push(doc.data());
        });

        // Check for subsequent tags and filter matchingQuestions accordingly
        for (let i = 1; i < tagsArray.length; i++) {
          const tag = tagsArray[i];

          // Filter matchingQuestions to include only questions that match the current tag
          matchingQuestions = matchingQuestions.filter(question => {
            return question.selectedTags.includes(tag);
          });
        }
      } else {
        const allQuestionsSnapshot = await db.collection('questions').get();
        allQuestionsSnapshot.forEach(doc => {
          matchingQuestions.push(doc.data());
        });
      }

      // Filter matching questions by difficulty and user if provided
      const filteredQuestions = matchingQuestions.filter(question => {
        if (difficulty && question.difficulty !== difficulty) {
          return false;
        }
        if (user && question.user !== user) {
          return false;
        }
        return true;
      });

      if (fl) {
        res.status(500).json({
          status: 'error',
          message: 'Error fetching questions'
        })
      }

      res.status(200).json({
        status: 'success',
        data: {
          questions: filteredQuestions
        }
      });
    }
    else {
      // console.log("eifbne");
      let matchingQuestions=[]
      const allQuestionsSnapshot = await db.collection('questions').get();
      allQuestionsSnapshot.forEach(doc => {
        matchingQuestions.push(doc.data());
      });
      res.status(200).json({
        status: 'success',
        data: {
          questions: matchingQuestions
        }
      });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching questions'
    });
  }
};

module.exports = { get_search_and_difficulty };
