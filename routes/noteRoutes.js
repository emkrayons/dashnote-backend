const express = require("express");
const protect = require("../middleware/authMiddleware");
const { 
  createNote, 
  getNotes, 
  updateNote, 
  deleteNote 
} = require("../controllers/noteController");

const router = express.Router();

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', protect, createNote);

// @route   GET /api/notes
// @desc    Get all notes (with optional search query)
// @access  Private
router.get('/', protect, getNotes);

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', protect, updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', protect, deleteNote);

module.exports = router;