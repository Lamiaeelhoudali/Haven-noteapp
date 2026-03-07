import React, { useState, useEffect } from 'react';
import NoteCard from './NoteCard';
import NoteEditor from '../Editor/NoteEditor';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function TagsView() {
  const [notes, setNotes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async (tag) => {
    setLoading(true);
    try {
      const res = await api.get('/notes', { params: tag ? { tag } : {} });
      const data = res.data.data;
      setNotes(data);
      if (!tag) setAllTags([...new Set(data.flatMap(n => n.tags || []))].sort());
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(activeTag); }, [activeTag]);

  const handleClose = () => { setSelected(null); fetchNotes(activeTag); };

  if (selected) return <NoteEditor note={selected} onClose={handleClose} onSaved={handleClose} />;

  return (
    <div>
      <h2 className="section-title">Tags</h2>

      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {['', ...allTags].map(tag => (
            <button
              key={tag || 'all'}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '0.3rem 0.75rem', borderRadius: 20, border: 'none',
                background: activeTag === tag ? 'var(--accent)' : 'var(--bg-secondary)',
                color: activeTag === tag ? 'white' : 'var(--text-secondary)',
                fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s'
              }}
            >
              {tag ? `#${tag}` : 'All'}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-skeleton" style={{ height: 200 }} />
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <p>{activeTag ? `No notes tagged #${activeTag}` : 'No tagged notes yet.'}</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {[0,1,2].map(ci => (
            <div key={ci} className="masonry-col">
              {notes.filter((_, i) => i % 3 === ci).map(note => (
                <NoteCard key={note._id} note={note} onClick={() => setSelected(note)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
