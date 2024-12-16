const {db}=require('../firebase');

const post_questions= async (req, res) => {
    try {
      const questions = req.body;
  
      // Validate request body
      console.log(questions);
      console.log(typeof questions);
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid request body, expected an array of questions'
        });
      }
  
      const createdQuestions = [];
  
      // Process each question and create in Firestore
      for (const question of questions) {
        const {
          difficulty,
          question: questionText,
          answers,
          selectedTags,
          explanations,
          correctAnswer
        } = question;
  
        // Validate individual question fields
        // Validate individual question fields
        if (
          typeof difficulty !== 'string' ||
          !['easy', 'medium', 'hard'].includes(difficulty) ||
          !questionText ||
          !answers ||
          typeof answers !== 'object' ||
          Object.keys(answers).length !== 4 || // Ensure answers object has exactly 4 keys
          !Object.values(answers).every(answer => typeof answer === 'string' && answer.trim().length > 0) || // Check answers are non-empty strings
          !Array.isArray(selectedTags) ||
          selectedTags.some(tag => typeof tag !== 'string' || !tag) ||
          !explanations ||
          typeof explanations !== 'object' ||
          Object.keys(explanations).length !== 4 || // Ensure explanations object has exactly 4 keys
          !Object.values(explanations).every(explanation => typeof explanation === 'string' && explanation.trim().length > 0) || // Check explanations are non-empty strings
          !correctAnswer ||
          !['a', 'b', 'c', 'd'].includes(correctAnswer)
        ) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid question format or missing required fields'
          });
        }
  
  
        // Create new question document in Firestore
        const newQuestionRef = await db.collection('questions').add({
          difficulty,
          question: questionText,
          answers,
          selectedTags,
          explanations,
          correctAnswer
        });
  
        createdQuestions.push({ id: newQuestionRef.id });
      }
  
      res.status(201).json({
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
  }

  
module.exports={post_questions}