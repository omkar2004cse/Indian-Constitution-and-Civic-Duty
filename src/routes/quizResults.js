const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');

router.post('/api/quiz-results', async (req, res) => {
  try {
    console.log('📥 Received quiz result submission:', req.body);
    
    const {
      userId,
      quizTitle,
      correctAnswers,
      totalQuestions,
      scorePercentage,
      timeTaken,
    } = req.body;

    const result = new QuizResult({
      userId,
      quizTitle,
      correctAnswers,
      totalQuestions,
      scorePercentage,
      timeTaken,
    });

    const saved = await result.save();
    console.log('✓ Quiz result saved to database:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('✗ Error saving quiz result:', err);
    res.status(500).json({ message: 'Failed to save quiz result', error: err.message });
  }
});

module.exports = router;
