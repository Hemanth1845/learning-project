const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const NoteProgress = require('../models/NoteProgress');
const { protect, adminOnly } = require('../middleware/auth');
const { callGemini } = require('../utils/gemini');

// @desc    Get all study notes with user progress details
// @route   GET /api/notes
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    
    // Find all progress items for this user
    const progresses = await NoteProgress.find({ userId: req.user._id });
    
    const augmentedNotes = notes.map(note => {
      const prog = progresses.find(p => p.noteId.toString() === note._id.toString());
      return {
        ...note.toObject(),
        isFavorite: prog ? prog.isFavorite : false,
        isBookmarked: prog ? prog.isBookmarked : false,
        lastReadPage: prog ? prog.lastReadPage : 1,
        readingPercentage: prog ? prog.readingPercentage : 0,
        lastViewedAt: prog ? prog.lastViewedAt : null
      };
    });

    res.json(augmentedNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle favorite status of a note
// @route   POST /api/notes/:id/favorite
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    let prog = await NoteProgress.findOne({ userId: req.user._id, noteId });
    
    if (!prog) {
      prog = new NoteProgress({ userId: req.user._id, noteId });
    }
    
    prog.isFavorite = !prog.isFavorite;
    prog.lastViewedAt = new Date();
    await prog.save();
    
    res.json({ success: true, isFavorite: prog.isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle bookmark status of a note
// @route   POST /api/notes/:id/bookmark
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    let prog = await NoteProgress.findOne({ userId: req.user._id, noteId });
    
    if (!prog) {
      prog = new NoteProgress({ userId: req.user._id, noteId });
    }
    
    prog.isBookmarked = !prog.isBookmarked;
    prog.lastViewedAt = new Date();
    await prog.save();
    
    res.json({ success: true, isBookmarked: prog.isBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update note reading progress (page, percentage)
// @route   POST /api/notes/:id/progress
router.post('/:id/progress', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { lastReadPage, readingPercentage } = req.body;
    
    let prog = await NoteProgress.findOne({ userId: req.user._id, noteId });
    
    if (!prog) {
      prog = new NoteProgress({ userId: req.user._id, noteId });
    }
    
    if (lastReadPage !== undefined) prog.lastReadPage = lastReadPage;
    if (readingPercentage !== undefined) prog.readingPercentage = readingPercentage;
    prog.lastViewedAt = new Date();
    await prog.save();
    
    res.json({ success: true, lastReadPage: prog.lastReadPage, readingPercentage: prog.readingPercentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    AI Note assistant actions (Summarize, quiz, flashcard, explain)
// @route   POST /api/notes/:id/ai
router.post('/:id/ai', protect, async (req, res) => {
  try {
    const { action, text, prompt } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    let aiPrompt = '';
    const systemInstruction = 'You are a placement preparation assistant. Provide concise, clean, markdown-formatted responses.';

    switch (action) {
      case 'summarize':
        aiPrompt = `Summarize the following chapter or notes content for the subject "${note.subject}":\n\n${text || note.description}`;
        break;
      case 'quiz':
        aiPrompt = `Generate a 5-question multiple choice quiz with answers and detailed explanations based on the following notes content for the subject "${note.subject}":\n\n${text || note.description}`;
        break;
      case 'flashcards':
        aiPrompt = `Generate a set of 5 interactive flashcards (Question on front, Answer on back) based on the following notes content for the subject "${note.subject}":\n\n${text || note.description}`;
        break;
      case 'interviews':
        aiPrompt = `Generate 5 high-yield technical interview questions with ideal candidate answers based on the following notes content for the subject "${note.subject}":\n\n${text || note.description}`;
        break;
      case 'explain':
        aiPrompt = `Explain the following specific topic or selected text clearly with a real-world analogy and step-by-step logic:\n\n${text}`;
        break;
      case 'revision':
        aiPrompt = `Generate a quick revision sheet (bullet points, key formulas/cheat sheet codes) based on the following notes content for the subject "${note.subject}":\n\n${text || note.description}`;
        break;
      case 'ask':
        aiPrompt = `Based on the notes for subject "${note.subject}" (Title: ${note.title}, Description: ${note.description}), answer the user's specific query: "${prompt}"`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid AI action requested.' });
    }

    let aiResponse = '';
    try {
      aiResponse = await callGemini(aiPrompt, systemInstruction);
    } catch (err) {
      aiResponse = `### [Offline Mode Response]\n\nHere is a local reference guide for **${action}** on "${note.title}":\n\n1. **Core Concept**: PrepPortal notes cover essential points of ${note.title}.\n2. **Revision Key**: Focus on primary definitions, system invariants, and complexity bounds.\n3. **Analogy**: Think of it as a cache indexing system in high-availability web apps.`;
    }

    res.json({ response: aiResponse });
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
    // Clean progress
    await NoteProgress.deleteMany({ noteId: req.params.id });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
