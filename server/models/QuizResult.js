const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  userId: { type: String },
  quizTitle: { type: String, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  scorePercentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
