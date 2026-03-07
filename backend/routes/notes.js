const express = require('express');
const { getNotes, getNote, createNote, updateNote, deleteNote, getTrash, restoreNote, permanentDelete, shareNote, getSharedNote, exportNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/trash', protect, getTrash);
router.get('/shared/:token', getSharedNote);
router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').get(protect, getNote).put(protect, updateNote).delete(protect, deleteNote);
router.put('/:id/restore', protect, restoreNote);
router.delete('/:id/permanent', protect, permanentDelete);
router.post('/:id/share', protect, shareNote);
router.get('/:id/export', protect, exportNote);

module.exports = router;
