const bcrypt = require('bcryptjs');
const Journal = require('../models/Journal');
const User = require('../models/User');

const PROMPTS = [
  "What are you grateful for today?", "What made you smile today?", "How are you feeling right now?",
  "What's one thing you learned recently?", "What's something you're looking forward to?",
  "Describe a challenge you overcame recently.", "What would make today a great day?",
  "What are three things that went well today?", "Who has positively impacted your life lately?",
  "What's a goal you're working toward?", "What does your ideal day look like?",
  "What is something you want to let go of?", "Describe a moment of peace you had recently.",
  "What are you proud of this week?", "What would you tell your past self?",
  "What does happiness mean to you?", "Write about someone who inspires you.",
  "What's a memory that always makes you smile?", "What are you looking forward to this week?",
  "What does self-care look like for you?", "What's something beautiful you noticed today?",
  "If you could change one thing about today, what would it be?",
  "What's a fear you'd like to overcome?", "What are your top 3 priorities right now?",
  "What's one kind thing you did for yourself today?"
];

exports.getEntries = async (req, res, next) => {
  try {
    const { search, pinned, archived, tag, deleted } = req.query;
    if (deleted === 'true') {
      const filter = { user: req.user._id, isDeleted: true };
      const entries = await Journal.find(filter).select('-pin').sort({ deletedAt: -1 });
      return res.json({ success: true, count: entries.length, data: entries });
    }
    let filter = { user: req.user._id, isDeleted: false };
    if (archived === 'true') filter.isArchived = true;
    else filter.isArchived = false;
    if (pinned === 'true') filter.isPinned = true;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    if (tag) filter.tags = tag;
    const entries = await Journal.find(filter).select('-pin').sort({ isPinned: -1, entryDate: -1 });
    res.json({ success: true, count: entries.length, data: entries, prompts: PROMPTS, streak: req.user.journalStreak, dailyWordGoal: req.user.dailyWordGoal });
  } catch (error) { next(error); }
};

exports.getEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id }).select('-pin');
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: entry });
  } catch (error) { next(error); }
};

exports.createEntry = async (req, res, next) => {
  try {
    const { title, content, mood, isLocked, pin, tags, isPinned } = req.body;
    let hashedPin = null;
    if (isLocked && pin) { const salt = await bcrypt.genSalt(10); hashedPin = await bcrypt.hash(String(pin), salt); }
    const entry = await Journal.create({ user: req.user._id, title, content, mood, isLocked: isLocked || false, pin: hashedPin, tags: tags || [], isPinned: isPinned || false });
    const user = await User.findById(req.user._id);
    user.updateStreak(); await user.save();
    res.status(201).json({ success: true, data: { ...entry.toObject(), pin: undefined }, streak: user.journalStreak });
  } catch (error) { next(error); }
};

exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id }).select('+pin');
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    const allowed = ['title', 'content', 'mood', 'isLocked', 'isPinned', 'isArchived', 'isDeleted', 'deletedAt', 'tags'];
    allowed.forEach(f => { if (req.body[f] !== undefined) entry[f] = req.body[f]; });
    if (req.body.pin) { const salt = await bcrypt.genSalt(10); entry.pin = await bcrypt.hash(String(req.body.pin), salt); }
    await entry.save();
    res.json({ success: true, data: { ...entry.toObject(), pin: undefined } });
  } catch (error) { next(error); }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    entry.isDeleted = true; entry.deletedAt = new Date(); await entry.save();
    res.json({ success: true, message: 'Moved to trash' });
  } catch (error) { next(error); }
};

exports.permanentDeleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    await entry.deleteOne();
    res.json({ success: true, message: 'Permanently deleted' });
  } catch (error) { next(error); }
};

exports.unlockEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id }).select('+pin');
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    if (!entry.isLocked) return res.json({ success: true, data: entry });
    const match = await bcrypt.compare(String(req.body.pin), entry.pin);
    if (!match) return res.status(401).json({ success: false, message: 'Incorrect PIN' });
    res.json({ success: true, data: { ...entry.toObject(), pin: undefined } });
  } catch (error) { next(error); }
};

exports.getCalendar = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const entries = await Journal.find({ user: req.user._id, isDeleted: false, entryDate: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } }).select('entryDate mood title _id');
    const calendar = entries.reduce((acc, e) => {
      const d = new Date(e.entryDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push({ id: e._id, title: e.title, mood: e.mood });
      return acc;
    }, {});
    res.json({ success: true, data: calendar, streak: req.user.journalStreak });
  } catch (error) { next(error); }
};
