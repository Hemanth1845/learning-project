const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIdx: { type: Number, required: true },
  explanation: { type: String, default: '' }
});

const AptitudeTopicSchema = new mongoose.Schema({
  category: {
    type: String, // 'quant', 'logical', 'verbal'
    required: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  desc: {
    type: String,
    default: ''
  },
  questionsCount: {
    type: Number,
    default: 10
  },
  shortcutsCount: {
    type: Number,
    default: 5
  },
  duration: {
    type: String,
    default: '30 min'
  },
  tags: [{
    type: String // e.g. ['TCS', 'Infosys']
  }],
  concepts: [{
    term: String,
    definition: String
  }],
  shortcuts: [{
    type: String
  }],
  quizQuestions: [QuizQuestionSchema],
  xpReward: {
    type: Number,
    default: 50
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeTopic', AptitudeTopicSchema);
