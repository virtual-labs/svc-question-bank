const {db}=require('../firebase');

const update_ques = async (req, res) => {
    try {
      const questionId = req.params.id;
      const updatedData = req.body;
  
      // Check if question ID is provided
      if (!questionId) {
        return res.status(400).json({
          status: 'error',
          message: 'Question ID is required'
        });
      }
  
      // Check if updated data is provided
      if (!updatedData) {
        return res.status(400).json({
          status: 'error',
          message: 'Updated data is required'
        });
      }
  
      // Update question in Firestore based on ID
      const questionRef = db.collection('questions').doc(questionId);
      await questionRef.update(updatedData);
  
      res.status(200).json({
        status: 'success',
        message: 'Question updated successfully'
      });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating question'
      });
    }
  };
  
  
  
module.exports={update_ques};