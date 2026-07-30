const mongoose = require('mongoose');

const TheorySubjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📖'
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('TheorySubject', TheorySubjectSchema);
