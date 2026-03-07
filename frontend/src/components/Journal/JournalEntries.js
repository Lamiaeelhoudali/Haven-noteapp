import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Flame, Target, Lightbulb, X } from 'lucide-react';
import api from '../../utils/api';
import JournalEditor from './JournalEditor';
import PinModal from '../UI/PinModal';
import toast from 'react-hot-toast';

const MOODS = [
  { emoji: '😊', label: 'Happy' }, { emoji: '😌', label: 'Calm' },
  { emoji: '😔', label: 'Sad' },   { emoji: '😤', label: 'Frustrated' },
  { emoji: '🤩', label: 'Excited' },{ emoji: '😴', label: 'Tired' },
  { emoji: '🙏', label: 'Grateful' },{ emoji: '😰', label: 'Anxious' },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function JournalEntries({ search, filter, creating, setCreating }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [dailyWordGoal, setDailyWordGoal] = useState(200);
  const [prompts, setPrompts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pinEntry, setPinEntry] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter === 'pinned') params.pinned = 'true';
      if (filter === 'archive') params.archived = 'true';
      const res = await api.get('/journal', { params });
      setEntries(res.data.data);
      setStreak(res.data.streak || 0);
      setDailyWordGoal(res.data.dailyWordGoal || 200);
      setPrompts(res.data.prompts || []);
    } catch {
      toast.error('Failed to load journal');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const todayWords = entries
    .filter(e => new Date(e.entryDate).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + (e.wordCount || 0), 0);

  const handleClose = () => {
    setSelected(null);
    setCreating(false);
    setSelectedPrompt('');
    fetchEntries();
  };

  if (creating || selected) {
    return (
      <JournalEditor
        entry={selected}
        defaultPrompt={selectedPrompt}
        onClose={handleClose}
      />
    );
  }

  return (
    <div>
      {/* Top controls bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.85rem' }}
          onClick={() => setShowPrompts(v => !v)}
        >
          <Lightbulb size={15} />
          {showPrompts ? 'Hide Prompts' : 'Browse Prompts'}
        </button>

        {streak > 0 && (
          <div className="streak-badge">
            <Flame size={13} /> {streak} day streak
          </div>
        )}

        <div className="word-goal-wrap">
          <Target size={13} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div className="word-goal-text">{todayWords} / {dailyWordGoal} words today</div>
            <div className="word-goal-bar">
              <div className="word-goal-fill" style={{ width: `${Math.min((todayWords / dailyWordGoal) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Prompts browser */}
      {showPrompts && (
        <div className="prompts-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>✍️ Choose a writing prompt</div>
            <button className="btn-icon" onClick={() => setShowPrompts(false)}><X size={15} /></button>
          </div>
          <div className="prompts-grid">
            {prompts.map((p, i) => (
              <button
                key={i}
                className="prompt-btn"
                onClick={() => {
                  setSelectedPrompt(p);
                  setShowPrompts(false);
                  setCreating(true);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="loading-skeleton" style={{ height: 100 }} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕯️</div>
          <p>No entries yet. Click <strong>New</strong> to begin.</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {[0,1,2].map(ci => (
            <div key={ci} className="masonry-col">
              {entries.filter((_, i) => i % 3 === ci).map(entry => (
                <div
                  key={entry._id}
                  className="journal-card"
                  onClick={() => entry.isLocked ? setPinEntry(entry) : setSelected(entry)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="journal-card-date">{formatDate(entry.entryDate)}</div>
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      {entry.mood?.emoji && <span className="mood-emoji">{entry.mood.emoji}</span>}
                      {entry.isPinned && <span title="Pinned" style={{ fontSize: '0.7rem' }}>📌</span>}
                      {entry.isLocked && <Lock size={11} color="var(--accent)" />}
                    </div>
                  </div>

                  <div className="journal-card-title">{entry.title || 'Untitled Entry'}</div>

                  {!entry.isLocked && entry.content && (
                    <div className="journal-card-preview">
                      {entry.content.replace(/[#*`_]/g, '').substring(0, 150)}
                    </div>
                  )}
                  {entry.isLocked && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      🔒 Private entry
                    </div>
                  )}

                  <div className="journal-card-meta">
                    <div className="note-tags">
                      {entry.tags?.slice(0, 3).map(t => <span key={t} className="tag-badge">#{t}</span>)}
                    </div>
                    {entry.wordCount > 0 && (
                      <span className="word-count-text">{entry.wordCount} words</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {pinEntry && (
        <PinModal
          entry={pinEntry}
          onSuccess={(e) => { setPinEntry(null); setSelected(e); }}
          onClose={() => setPinEntry(null)}
        />
      )}
    </div>
  );
}
