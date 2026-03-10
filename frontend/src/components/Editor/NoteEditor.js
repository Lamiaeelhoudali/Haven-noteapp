import React, { useState, useRef, useEffect } from 'react';
import { X, Pin, Archive, Trash2, Share2, Download, Tag, Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import { wordCount, renderMarkdown } from '../../utils/markdown';
import toast from 'react-hot-toast';

const BACKGROUNDS = {
  none:     { label: 'None',     bg: 'var(--bg-card)' },
  sunset:   { label: 'Sunset',   bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
  sky:      { label: 'Sky',      bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
  lavender: { label: 'Lavender', bg: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
  mint:     { label: 'Mint',     bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' },
  rose:     { label: 'Rose',     bg: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
  sand:     { label: 'Sand',     bg: 'linear-gradient(135deg,#ffeaa7,#dfe6e9)' },
  cream:    { label: 'Cream',    bg: '#faf8f2' },
  slate:    { label: 'Slate',    bg: '#f1f5f9' },
  blush:    { label: 'Blush',    bg: '#fff0f3' },
};

export default function NoteEditor({ note, onClose, onSaved }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [background, setBackground] = useState('none');
  const [viewMode, setViewMode] = useState('write');
  const [saving, setSaving] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Insert text at cursor
  const insertAtCursor = (before, after = '', placeholder = 'text') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const needsNewline = (before.startsWith('#') || before.startsWith('-') || before.startsWith('*'))
      && start > 0 && content[start - 1] !== '\n';
    const prefix = needsNewline ? '\n' : '';
    const inserted = `${prefix}${before}${selected}${after}`;
    const newContent = content.substring(0, start) + inserted + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      const pos = start + prefix.length + before.length + selected.length + (after ? after.length : 0);
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertImage = (src) => {
    const tag = `\n![image](${src})\n`;
    const ta = textareaRef.current;
    const pos = ta ? ta.selectionStart : content.length;
    setContent(c => c.substring(0, pos) + tag + c.substring(pos));
    setShowImageModal(false);
    setImageUrl('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => insertImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Please add a title'); return; }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content,
        isPinned,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (note?._id) {
        await api.put(`/notes/${note._id}`, payload);
      } else {
        await api.post('/notes', payload);
      }
      toast.success('Note saved! ✨');
      onSaved ? onSaved() : onClose();
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note?._id) { onClose(); return; }
    if (!window.confirm('Move this note to trash?')) return;
    try {
      await api.delete(`/notes/${note._id}`);
      toast.success('Moved to trash');
      onClose();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async () => {
    if (!note?._id) { toast.error('Please save the note first'); return; }
    try {
      const res = await api.post(`/notes/${note._id}/share`);
      await navigator.clipboard.writeText(res.data.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const handleExport = async (format) => {
    if (!note?._id) { toast.error('Please save the note first'); return; }
    try {
      const res = await api.get(`/notes/${note._id}/export?format=${format}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `${title || 'note'}.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  };

  const bgStyle = BACKGROUNDS[background] ? { background: BACKGROUNDS[background].bg } : {};
  const wc = wordCount(content);

  return (
    <div className="editor-wrap" style={bgStyle}>
      {/* Top bar */}
      <div className="editor-topbar">
        <button className="btn-icon" onClick={onClose} title="Close"><X size={18} /></button>
        <input
          className="editor-title"
          placeholder="Note title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus={!note?._id}
        />
        <div className="editor-actions">
          <button
            className="btn-icon"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={15} color={isPinned ? 'var(--accent)' : undefined} fill={isPinned ? 'var(--accent)' : 'none'} />
          </button>

          {/* Write / Preview toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-toggle-btn ${viewMode === 'write' ? 'active' : ''}`}
              onClick={() => setViewMode('write')}
            >
              <Edit3 size={12} /> Write
            </button>
            <button
              className={`mode-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={12} /> Preview
            </button>
          </div>

          {note?._id && (
            <>
              <button className="btn-icon" title="Archive" onClick={() => api.put(`/notes/${note._id}`, { isArchived: true }).then(onClose)}><Archive size={15} /></button>
              <button className="btn-icon" title="Share" onClick={handleShare}><Share2 size={15} /></button>
              <button className="btn-icon" title="Export .txt" onClick={() => handleExport('txt')}><Download size={15} /></button>
              <button className="btn-icon" title="Delete" onClick={handleDelete} style={{ color: '#e05555' }}><Trash2 size={15} /></button>
            </>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Toolbar (write mode only) */}
      {viewMode === 'write' && (
        <div className="editor-toolbar">
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('**', '**', 'bold text')}><strong>B</strong></button>
            <div className="toolbar-tooltip"><strong>Bold</strong><span>Select a word then click B to make it bold</span><code>**your text**</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('*', '*', 'italic text')}><em>I</em></button>
            <div className="toolbar-tooltip"><strong>Italic</strong><span>Select a word then click I to make it italic</span><code>*your text*</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('# ', '', 'Heading 1')}>H1</button>
            <div className="toolbar-tooltip"><strong>Heading 1</strong><span>Click to add a large title heading</span><code># Your heading</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('## ', '', 'Heading 2')}>H2</button>
            <div className="toolbar-tooltip"><strong>Heading 2</strong><span>Click to add a smaller section heading</span><code>## Your heading</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('- ', '', 'List item')}>• List</button>
            <div className="toolbar-tooltip"><strong>Bullet List</strong><span>Click to add a bullet point item</span><code>- list item</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => insertAtCursor('- [ ] ', '', 'Task')}>☐ Task</button>
            <div className="toolbar-tooltip"><strong>Checkbox Task</strong><span>Click to add a checkbox — great for to-do lists!</span><code>- [ ] task item</code></div>
          </div>
          <div className="toolbar-tooltip-wrap">
            <button className="toolbar-btn" onClick={() => setShowImageModal(true)}><ImageIcon size={13} /> Image</button>
            <div className="toolbar-tooltip"><strong>Insert Image</strong><span>Click to add an image by URL or from your computer</span></div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Background picker */}
            <div style={{ position: 'relative' }}>
              <button className="toolbar-btn" onClick={() => setShowBgPicker(v => !v)} title="Background">🎨 BG</button>
              {showBgPicker && (
                <div className="bg-picker">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Background</div>
                  <div className="bg-grid">
                    {Object.entries(BACKGROUNDS).map(([key, val]) => (
                      <button
                        key={key}
                        className={`bg-swatch ${background === key ? 'selected' : ''}`}
                        style={{ background: val.bg }}
                        title={val.label}
                        onClick={() => { setBackground(key); setShowBgPicker(false); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags inline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Tag size={13} color="var(--text-muted)" />
              <input
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.78rem', color: 'var(--text-secondary)', width: 150, fontFamily: 'var(--font-body)' }}
                placeholder="tags, comma separated"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wc} words</span>
          </div>
        </div>
      )}

      {/* Editor body */}
      <div className="editor-body">
        {viewMode === 'write' ? (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={"Start writing freely...\n\nTips:\n# Heading 1\n## Heading 2\n**bold**  *italic*\n- bullet item\n- [ ] checkbox task"}
          />
        ) : (
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || '<p style="color:var(--text-muted)">Nothing to preview yet...</p>' }}
          />
        )}
      </div>

      {/* Image insert modal */}
      {showImageModal && (
        <div className="overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={e => e.stopPropagation()}>
            <h3>Insert Image</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Paste image URL</label>
              <input
                className="input-field"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.6rem 0' }}>— or —</div>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
              onClick={() => fileInputRef.current.click()}
            >
              📁 Upload from computer
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowImageModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => imageUrl && insertImage(imageUrl)}>Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
