const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, trim: true, maxlength: 200, default: '' },
  content: { type: String, default: '' },
  color: { type: String, default: 'default' },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  shareToken: { type: String, default: null },
  wordCount: { type: Number, default: 0 }
}, { timestamps: true });

noteSchema.pre('save', function(next) {
  if (this.content) this.wordCount = this.content.trim().split(/\s+/).filter(Boolean).length;
  next();
});

module.exports = mongoose.model('Note', noteSchema);
