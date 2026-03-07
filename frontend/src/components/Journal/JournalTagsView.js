import React, { useState, useEffect } from 'react';
import JournalEditor from './JournalEditor';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

export default function JournalTagsView() {
  const [entries,   setEntries]   = useState([]);
  const [allTags,   setAllTags]   = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);

  const fetchEntries = async (tag) => {
    setLoading(true);
    try {
      const res = await api.get('/journal', { params: tag ? { tag } : {} });
      const data = res.data.data;
      setEntries(data);
      if (!tag) setAllTags([...new Set(data.flatMap(e => e.tags || []))].sort());
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEntries(activeTag); }, [activeTag]);

  const handleClose = () => { setSelected(null); fetchEntries(activeTag); };

  if (selected) return <JournalEditor entry={selected} onClose={handleClose} />;

  return (
    <div>
      <h2 className="section-title">Tags</h2>

      {allTags.length > 0 && (
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
          {['', ...allTags].map(tag => (
            <button
              key={tag || 'all'}
              onClick={() => setActiveTag(tag)}
              style={{
                padding:'0.3rem 0.75rem', borderRadius:20, border:'none',
                background: activeTag === tag ? 'var(--accent)' : 'var(--bg-secondary)',
                color: activeTag === tag ? 'white' : 'var(--text-secondary)',
                fontSize:'0.82rem', cursor:'pointer',
                fontFamily:'var(--font-body)', transition:'all 0.2s'
              }}
            >
              {tag ? `#${tag}` : 'All'}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-skeleton" style={{ height:200 }} />
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <p>{activeTag ? `No entries tagged #${activeTag}` : 'No tagged entries yet.'}</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {[0,1,2].map(ci => (
            <div key={ci} className="masonry-col">
              {entries.filter((_,i) => i%3===ci).map(entry => (
                <div key={entry._id} className="journal-card" onClick={() => setSelected(entry)}>
                  <div className="journal-card-date">{formatDate(entry.entryDate)}</div>
                  <div className="journal-card-title">{entry.title || 'Untitled'}</div>
                  <div className="note-tags" style={{ marginTop:'0.4rem' }}>
                    {entry.tags?.map(t => <span key={t} className="tag-badge">#{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
