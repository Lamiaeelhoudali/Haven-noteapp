import React, { useState, useEffect } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function TrashView({ mode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(mode === 'journal' ? '/journal?deleted=true' : '/notes/trash');
      setItems(res.data.data);
    } catch {
      toast.error('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [mode]);

  const restore = async (item) => {
    try {
      if (mode === 'journal') await api.put(`/journal/${item._id}`, { isDeleted: false });
      else await api.put(`/notes/${item._id}/restore`);
      toast.success('Restored!');
      fetchItems();
    } catch { toast.error('Failed to restore'); }
  };

  const permDelete = async (item) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return;
    try {
      if (mode === 'journal') await api.delete(`/journal/${item._id}`);
      else await api.delete(`/notes/${item._id}/permanent`);
      toast.success('Permanently deleted');
      fetchItems();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <h2 className="section-title">🗑️ Trash</h2>

      {items.length > 0 && (
        <div className="info-bar" style={{ borderColor: 'rgba(224,85,85,0.3)', background: 'rgba(224,85,85,0.06)' }}>
          ⚠️ Items here are not automatically deleted. Restore or permanently remove them.
        </div>
      )}

      {loading ? (
        <div className="loading-skeleton" style={{ height: 120 }} />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗑️</div>
          <p>Trash is empty</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map(item => (
            <div key={item._id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1.25rem', background: 'var(--bg-card)',
              borderRadius: 12, border: '1px solid var(--border)'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title || 'Untitled'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {item.deletedAt ? `Deleted ${new Date(item.deletedAt).toLocaleDateString()}` : 'Deleted recently'}
                </div>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => restore(item)}>
                <RotateCcw size={13} /> Restore
              </button>
              <button className="btn btn-danger" style={{ fontSize: '0.8rem' }} onClick={() => permDelete(item)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
