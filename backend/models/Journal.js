const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, trim: true, maxlength: 200, default: '' },
  content: { type: String, default: '' },
  mood: { emoji: { type: String, default: '' }, label: { type: String, default: '' } },
  prompt: { type: String, default: '' },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  pin: { type: String, default: null, select: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  wordCount: { type: Number, default: 0 },
  entryDate: { type: Date, default: () => new Date() }
}, { timestamps: true });

journalSchema.pre('save', function(next) {
  if (this.content) this.wordCount = this.content.trim().split(/\s+/).filter(Boolean).length;
  next();
});

module.exports = mongoose.model('Journal', journalSchema);
