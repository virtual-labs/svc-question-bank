// validators.js

function validateV1(question) {
    const {
      difficulty,
      question: questionText,
      answers,
      selectedTags,
      explanations,
      correctAnswer,
      image,
      user
    } = question;
    
    
    return (
      typeof difficulty === 'string' &&
      ['easy', 'medium', 'hard'].includes(difficulty) &&
      questionText &&
      answers &&
      typeof answers === 'object' && 
      Object.keys(answers).length === 4 && // Ensure answers object has exactly 4 keys
      Object.values(answers).every(answer => typeof answer === 'string' && answer.trim().length > 0) && // Check answers are non-empty strings
      Array.isArray(selectedTags) &&
      selectedTags.every(tag => typeof tag === 'string' && tag) &&
      explanations &&
      typeof explanations === 'object' &&
      Object.keys(explanations).length === 4 && // Ensure explanations object has exactly 4 keys
      Object.values(explanations).every(explanation => typeof explanation === 'string' && explanation.trim().length > 0) && // Check explanations are non-empty strings
      correctAnswer &&
      [1, 2, 3, 4].includes(correctAnswer)
    );
  }
  
  function validateV2(question) {
    const {
      difficulty,
      question: questionText,
      answers,
      explanations,
      correctAnswer,
      version,
      selectedTags
    } = question;
    // console.log(version);
  
    return (
      typeof difficulty === 'string' &&
      ['beginner', 'intermediate', 'advanced','na'].includes(difficulty.toLowerCase()) && 
      questionText &&
      answers &&
      typeof answers === 'object' &&
      answers&&
      typeof answers === 'object' &&
      // Object.keys(answers).length === 4 && // Ensure answers object has exactly 4 keys
      // Object.values(answers).every(answer => typeof answer === 'string' && answer.trim().length > 0) && // Check answers are non-empty strings
      explanations &&
      typeof explanations === 'object' &&
      correctAnswer &&
      typeof correctAnswer === 'string' &&
      ['a', 'b', 'c', 'd','e','f'].includes(correctAnswer) &&
      selectedTags!==undefined && selectedTags!==null &&
      version === 2.0
    );
  }
  
module.exports = { validateV1, validateV2 };
  