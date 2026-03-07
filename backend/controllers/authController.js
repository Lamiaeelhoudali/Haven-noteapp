const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
  res.status(statusCode).json({ success: true, token, user: { id: user._id, username: user.username, isFirstLogin: user.isFirstLogin, journalStreak: user.journalStreak, dailyWordGoal: user.dailyWordGoal, preferences: user.preferences } });
};

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ── validation ──
    if (!username || !username.trim())
      return res.status(400).json({ success: false, field: 'username', message: 'Username is required.' });
    if (username.trim().length < 3)
      return res.status(400).json({ success: false, field: 'username', message: 'Username must be at least 3 characters.' });
    if (username.trim().length > 30)
      return res.status(400).json({ success: false, field: 'username', message: 'Username cannot exceed 30 characters.' });
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
      return res.status(400).json({ success: false, field: 'username', message: 'Username can only contain letters, numbers, and underscores.' });
    if (!password)
      return res.status(400).json({ success: false, field: 'password', message: 'Password is required.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, field: 'password', message: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ username: username.trim().toLowerCase() });
    if (existing)
      return res.status(400).json({ success: false, field: 'username', message: 'That username is already taken. Please choose another.' });

    const user = await User.create({ username: username.trim(), password });
    sendToken(user, 201, res);
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ── validation ──
    if (!username || !username.trim())
      return res.status(400).json({ success: false, field: 'username', message: 'Please enter your username.' });
    if (!password)
      return res.status(400).json({ success: false, field: 'password', message: 'Please enter your password.' });

    const user = await User.findOne({ username: username.trim() }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, field: 'username', message: 'No account found with that username.' });
    if (!(await user.matchPassword(password)))
      return res.status(401).json({ success: false, field: 'password', message: 'Incorrect password. Please try again.' });

    if (user.isFirstLogin) { user.isFirstLogin = false; await user.save(); }
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: { id: req.user._id, username: req.user.username, journalStreak: req.user.journalStreak, dailyWordGoal: req.user.dailyWordGoal, preferences: req.user.preferences } });
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { preferences: req.body }, { new: true });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};
