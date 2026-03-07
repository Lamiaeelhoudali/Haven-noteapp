const express = require('express');
const { getEntries, getEntry, createEntry, updateEntry, deleteEntry, unlockEntry, getCalendar, permanentDeleteEntry } = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.get('/calendar', getCalendar);
router.route('/').get(getEntries).post(createEntry);
router.route('/:id').get(getEntry).put(updateEntry).delete(deleteEntry);
router.post('/:id/unlock', unlockEntry);
router .delete('/:id/permanent', permanentDeleteEntry);
module.exports = router;
