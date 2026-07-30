const mongoose = require('mongoose');

const NoteProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  lastReadPage: {
    type: Number,
    default: 1
  },
  readingPercentage: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness per user-note combination
NoteProgressSchema.index({ userId: 1, noteId: 1 }, { unique: true });

module.exports = mongoose.model('NoteProgress', NoteProgressSchema);
