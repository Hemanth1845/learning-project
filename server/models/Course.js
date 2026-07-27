const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  year_level: {
    type: [String],
    default: []
  },
  target_role: {
    type: String,
    default: ''
  },
  is_placement_prep: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
