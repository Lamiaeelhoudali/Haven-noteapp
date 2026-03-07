import React from 'react';
import { Pin } from 'lucide-react';

const ACCENT_COLORS = {
  default: 'var(--accent)',
  red:     '#e05555',
  orange:  '#e8924a',
  green:   '#5a8a5e',
  blue:    '#5b9bd5',
  purple:  '#7c5cbf',
  pink:    '#d4688a',
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onClick }) {
  const barColor = ACCENT_COLORS[note.color] || ACCENT_COLORS.default;

  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-bar" style={{ background: barColor }} />

      {note.isPinned && (
        <Pin
          size={12}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: 'var(--accent)', fill: 'var(--accent)' }}
        />
      )}

      <h3 style={{ paddingRight: note.isPinned ? '1.5rem' : 0 }}>
        {note.title || 'Untitled'}
      </h3>

      {note.content && (
        <p>{note.content.replace(/[#*`_[\]!>]/g, '').substring(0, 220)}</p>
      )}

      <div className="note-card-footer">
        <div className="note-tags">
          {note.tags?.slice(0, 3).map(t => (
            <span key={t} className="tag-badge">#{t}</span>
          ))}
        </div>
        <span className="note-date">{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
