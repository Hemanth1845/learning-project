const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIdx: { type: Number, required: true },
  explanation: { type: String, default: '' },
  subtopic: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy-Medium', 'Hard'], default: 'Easy-Medium' },
  companyTags: [{ type: String }],
  hints: [{ type: String }],
  timeEstimate: { type: Number, default: 60 },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 }
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
  slug: {
    type: String,
    required: true,
    unique: true
  },
  year_level: {
    type: [String],
    default: ["1st", "2nd", "3rd", "4th"]
  },
  target_role: {
    type: String,
    default: 'Software Engineer'
  },
  is_placement_prep: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeTopic', AptitudeTopicSchema);
