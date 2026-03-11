const Note = require("../models/Note");

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    // Check note count limit (100 notes per user)
    const noteCount = await Note.countDocuments({ user: req.user.id });
    
    if (noteCount >= 100) {
      return res.status(400).json({ 
        error: "You've reached the 100-note limit on the free plan. Delete some notes to continue." 
      });
    }

    const { title, content, tags, isFavorite, color } = req.body;
    
    const newNote = new Note({
      title,
      content,
      tags: tags || [],           
      isFavorite: isFavorite || false, 
      color: color || null,
      user: req.user.id
    });
    
    const note = await newNote.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get all notes (with optional search)
// @route   GET /api/notes?q=search
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { q } = req.query;
    let query = { user: req.user.id };
    
    // Enhanced search - search in both title and content
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }
    
    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { title, content, tags, isFavorite, color } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Make sure user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;           
    if (isFavorite !== undefined) note.isFavorite = isFavorite;
    if (color !== undefined) note.color = color;
    
    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Update note error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Make sure user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (error) {
    console.error('Delete note error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { 
  createNote, 
  getNotes, 
  updateNote, 
  deleteNote 
};


