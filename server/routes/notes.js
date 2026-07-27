const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all study notes
// @route   GET /api/notes
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new study note (Admin Only)
// @route   POST /api/notes
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, subject, description, pdfUrl } = req.body;
    if (!title || !subject || !pdfUrl) {
      return res.status(400).json({ message: 'Title, subject, and PDF url are required.' });
    }

    const newNote = await Note.create({
      title,
      subject,
      description: description || '',
      pdfUrl
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete study note (Admin Only)
// @route   DELETE /api/notes/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
