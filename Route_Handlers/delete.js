const {db}=require('../firebase');

const delete_ques= async (req, res) => {
    try {
      const questionId = req.params.id;
      
      // Check if question ID is provided
      if (!questionId) {
        return res.status(400).json({
          status: 'error',
          message: 'Question ID is required'
        });
      }
      
      // Delete question from Firestore based on ID
      await db.collection('questions').doc(questionId).delete();
      
      res.status(200).json({
        status: 'success',
        message: 'Question deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting question'
      });
    }
  }

module.exports={delete_ques};