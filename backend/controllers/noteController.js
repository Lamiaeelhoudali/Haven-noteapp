const { v4: uuidv4 } = require('uuid');
const Note = require('../models/Note');

function validateNote(body) {
  const { title, content, tags } = body;
  if (title !== undefined && title.trim().length > 200)
    return 'Title cannot exceed 200 characters.';
  if (content !== undefined && content.length > 50000)
    return 'Content is too long (max 50,000 characters).';
  if (tags !== undefined) {
    if (!Array.isArray(tags)) return 'Tags must be a list.';
    if (tags.length > 20) return 'You can have a maximum of 20 tags per note.';
    for (const t of tags) {
      if (typeof t !== 'string' || t.trim().length > 30)
        return 'Each tag must be a short word (max 30 characters).';
    }
  }
  return null;
}

exports.getNotes = async (req, res, next) => {
  try {
    const { search, pinned, archived, tag } = req.query;
    let filter = { user: req.user._id, isDeleted: false };
    if (archived === 'true') filter.isArchived = true;
    else filter.isArchived = false;
    if (pinned === 'true') filter.isPinned = true;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    if (tag) filter.tags = tag;
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) { next(error); }
};

exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data: note });
  } catch (error) { next(error); }
};

exports.createNote = async (req, res, next) => {
  try {
    const error = validateNote(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: note });
  } catch (error) { next(error); }
};

exports.updateNote = async (req, res, next) => {
  try {
    const error = validateNote(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data: note });
  } catch (error) { next(error); }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    note.isDeleted = true; note.deletedAt = new Date(); await note.save();
    res.json({ success: true, message: 'Note moved to trash.' });
  } catch (error) { next(error); }
};

exports.getTrash = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) { next(error); }
};

exports.restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDeleted: false, deletedAt: null }, { new: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data: note });
  } catch (error) { next(error); }
};

exports.permanentDelete = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, message: 'Note permanently deleted.' });
  } catch (error) { next(error); }
};

exports.shareNote = async (req, res, next) => {
  try {
    const token = uuidv4();
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { shareToken: token }, { new: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, shareUrl: `${req.protocol}://${req.get('host')}/api/notes/shared/${token}` });
  } catch (error) { next(error); }
};

exports.getSharedNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ shareToken: req.params.token, isDeleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'This shared note does not exist or has been removed.' });
    res.json({ success: true, data: note });
  } catch (error) { next(error); }
};

exports.exportNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    const content = `${note.title}\n\n${note.content.replace(/[#*`_]/g, '')}`;
    res.setHeader('Content-Disposition', `attachment; filename="${note.title || 'note'}.txt"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) { next(error); }
};
