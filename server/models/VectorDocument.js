const mongoose = require('mongoose');

const VectorDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'lesson', 'theory', 'aptitude', 'faq'],
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  embedding: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VectorDocument', VectorDocumentSchema);
