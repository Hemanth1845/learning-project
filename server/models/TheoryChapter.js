const mongoose = require('mongoose');

const TheoryChapterSchema = new mongoose.Schema({
  subjectId: {
    type: String, // references TheorySubject.id e.g. 'dsa', 'oops'
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  content: {
    type: String, // Markdown content
    required: true
  },
  codeExamples: [{
    language: String, // e.g. 'Java', 'C++', 'Python'
    code: String
  }],
  diagramUrl: {
    type: String,
    default: ''
  },
  tables: [{
    title: String,
    headers: [String],
    rows: [[String]]
  }],
  interviewTips: {
    type: String,
    default: ''
  },
  commonMistakes: {
    type: String,
    default: ''
  },
  realInterviewQuestions: [{
    question: String,
    answer: String,
    difficulty: String
  }],
  companyFAQs: [{
    companyName: String,
    questionText: String
  }],
  notesUrl: {
    type: String, // link to PDF download
    default: ''
  },
  xpReward: {
    type: Number,
    default: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TheoryChapter', TheoryChapterSchema);
