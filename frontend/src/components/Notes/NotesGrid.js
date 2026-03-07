import React, { useState, useEffect, useCallback } from 'react';
import NoteCard from './NoteCard';
import NoteEditor from '../Editor/NoteEditor';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function NotesGrid({ search, filter, creating, setCreating }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter === 'pinned') params.pinned = 'true';
      if (filter === 'archive') params.archived = 'true';
      const res = await api.get('/notes', { params });
      setNotes(res.data.data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleClose = () => {
    setSelected(null);
    setCreating(false);
    fetchNotes();
  };

  if (creating) {
    return <NoteEditor note={null} onClose={handleClose} onSaved={handleClose} />;
  }

  if (selected) {
    return <NoteEditor note={selected} onClose={handleClose} onSaved={handleClose} />;
  }

  // 3-column masonry
  const cols = [[], [], []];
  notes.forEach((n, i) => cols[i % 3].push(n));

  return (
    <div>
      {notes.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      )}

      {loading ? (
        <div className="masonry-grid">
          {[0,1,2].map(ci => (
            <div key={ci} className="masonry-col">
              {[120, 180, 100].map((h, i) => (
                <div key={i} className="loading-skeleton" style={{ height: h }} />
              ))}
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No notes yet. Click <strong>New</strong> to create one.</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {cols.map((col, ci) => (
            <div key={ci} className="masonry-col">
              {col.map(note => (
                <NoteCard key={note._id} note={note} onClick={() => setSelected(note)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
