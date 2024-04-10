const {db}=require('../firebase.js')

const get_id=async (req, res) => {
    try {
      const questionId = req.params.id;
  
      // Check if question ID is provided
      if (!questionId) {
        return res.status(400).json({
          status: 'error',
          message: 'Question ID is required'
        });
      }
  
      // Retrieve question from Firestore based on ID
      const questionDoc = await db.collection('questions').doc(questionId).get();
  
      if (!questionDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }
  
      const questionData = questionDoc.data();
  
      res.status(200).json({
        status: 'success',
        data: {
          question: questionData
        }
      });
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching question'
      });
    }
  }

  
module.exports={get_id};