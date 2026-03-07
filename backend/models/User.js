const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  password: { type: String, required: true, minlength: 6, select: false },
  journalStreak: { type: Number, default: 0 },
  lastJournalDate: { type: Date, default: null },
  dailyWordGoal: { type: Number, default: 200 },
  isFirstLogin: { type: Boolean, default: true },
  preferences: {
    theme: { type: String, default: 'cloud' },
    isDark: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!this.lastJournalDate) {
    this.journalStreak = 1;
  } else {
    const last = new Date(this.lastJournalDate);
    last.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - last) / 86400000);
    if (diff === 1) this.journalStreak += 1;
    else if (diff > 1) this.journalStreak = 1;
  }
  this.lastJournalDate = today;
};

module.exports = mongoose.model('User', userSchema);
