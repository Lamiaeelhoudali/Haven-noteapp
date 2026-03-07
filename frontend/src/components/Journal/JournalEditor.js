import React, { useState, useRef } from 'react';
import { X, Lock, Unlock, Eye, Edit3, Tag, Pin, Image as ImageIcon, Archive, Download  } from 'lucide-react';
import api from '../../utils/api';
import { wordCount, renderMarkdown } from '../../utils/markdown';
import toast from 'react-hot-toast';

const MOODS = [
  { emoji:'😊', label:'Happy'   },
  { emoji:'😌', label:'Calm'    },
  { emoji:'😔', label:'Sad'     },
  { emoji:'😤', label:'Frustrated' },
  { emoji:'🤩', label:'Excited' },
  { emoji:'😴', label:'Tired'   },
  { emoji:'🙏', label:'Grateful'},
  { emoji:'😰', label:'Anxious' },
];

export default function JournalEditor({ entry, defaultPrompt, onClose }) {
  const [title,       setTitle]       = useState(entry?.title || '');
  const [content,     setContent]     = useState(entry?.content || '');
  const [mood,        setMood]        = useState(entry?.mood || { emoji:'', label:'' });
  const [tags,        setTags]        = useState(entry?.tags?.join(', ') || '');
  const [isPinned,    setIsPinned]    = useState(entry?.isPinned || false);
  const [isLocked,    setIsLocked]    = useState(entry?.isLocked || false);
  const [pin,         setPin]         = useState('');
  const [showPinInput,setShowPinInput]= useState(false);
  const [viewMode,    setViewMode]    = useState('write');
  const [saving,      setSaving]      = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl,    setImageUrl]    = useState('');
  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);

  /* ── helpers ── */
  const insertAtCursor = (before, after = '', placeholder = 'text') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const needsNewline =
      (before.startsWith('#') || before.startsWith('-')) &&
      start > 0 && content[start - 1] !== '\n';
    const prefix   = needsNewline ? '\n' : '';
    const inserted = `${prefix}${before}${selected}${after}`;
    setContent(content.substring(0, start) + inserted + content.substring(end));
    setTimeout(() => {
      ta.focus();
      const pos = start + prefix.length + before.length + selected.length + (after ? after.length : 0);
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertImage = (src) => {
    const tag = `\n![image](${src})\n`;
    const pos = textareaRef.current ? textareaRef.current.selectionStart : content.length;
    setContent(c => c.substring(0, pos) + tag + c.substring(pos));
    setShowImageModal(false);
    setImageUrl('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => insertImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title:   title.trim(),
        content,
        mood,
        isPinned,
        isLocked,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (isLocked && pin.length === 4) payload.pin = pin;
      if (entry?._id) await api.put(`/journal/${entry._id}`, payload);
      else            await api.post('/journal', payload);
      toast.success('Entry saved ✨');
      onClose();
    } catch {
      toast.error('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };
const handleExport = () => {
    const text = `${title}\n\n${content}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'journal'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDelete = async () => {
    if (!entry?._id) { onClose(); return; }
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/journal/${entry._id}`);
      toast.success('Entry deleted');
      onClose();
    } catch { toast.error('Failed to delete'); }
  };

  const wc = wordCount(content);

  return (
    <div className="editor-wrap">

      {/* ── top bar ── */}
      <div className="editor-topbar">
        <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        <input
          style={{ flex:1, border:'none', outline:'none', fontFamily:'var(--font-heading)', fontSize:'1.4rem', color:'var(--text-primary)', background:'transparent', minWidth:0 }}
          placeholder="Entry title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus={!entry?._id}
        />
        <div className="editor-actions">
          {/* pin */}
          <button className="btn-icon" onClick={() => setIsPinned(!isPinned)} title="Pin">
            <Pin size={15} color={isPinned ? 'var(--accent)' : undefined} fill={isPinned ? 'var(--accent)' : 'none'} />
          </button>
          {/* lock */}
          <button
            className="btn-icon"
            title={isLocked ? 'Locked' : 'Lock entry'}
            style={{ color: isLocked ? 'var(--accent)' : undefined }}
            onClick={() => { setIsLocked(v => !v); if (!isLocked) setShowPinInput(true); }}
          >
            {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          </button>
          {/* write / preview */}
          <div className="mode-toggle">
            <button className={`mode-toggle-btn ${viewMode==='write'?'active':''}`} onClick={() => setViewMode('write')}>
              <Edit3 size={12} /> Write
            </button>
            <button className={`mode-toggle-btn ${viewMode==='preview'?'active':''}`} onClick={() => setViewMode('preview')}>
              <Eye size={12} /> Preview
            </button>
          </div>
          {entry?._id && (
            <button className="btn-icon" onClick={handleDelete} style={{ color:'#e05555', fontSize:'0.8rem', padding:'4px 8px', borderRadius:6 }}>
           <button className="btn-icon" title="Export .txt" onClick={handleExport}><Download size={15} /></button>
              Delete
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── mood + PIN + tags bar ── */}
      <div style={{ padding:'0.5rem 1.25rem', borderBottom:'1px solid var(--border)', background:'var(--bg-secondary)', display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
        {/* mood */}
        <div style={{ display:'flex', gap:'0.2rem' }}>
          {MOODS.map(m => (
            <button
              key={m.emoji}
              title={m.label}
              onClick={() => setMood(mood.emoji === m.emoji ? { emoji:'', label:'' } : m)}
              style={{
                fontSize:'1.2rem', padding:'0.2rem 0.35rem', borderRadius:8,
                border: mood.emoji === m.emoji ? '2px solid var(--accent)' : '2px solid transparent',
                background: mood.emoji === m.emoji ? 'var(--bg-secondary)' : 'transparent',
                cursor:'pointer', transition:'all 0.15s',
              }}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        {/* PIN input */}
        {showPinInput && isLocked && (
          <input
            type="password"
            maxLength={4}
            placeholder="4-digit PIN"
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            style={{ width:110, padding:'0.32rem 0.7rem', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-primary)', outline:'none', fontSize:'0.85rem', fontFamily:'var(--font-body)' }}
          />
        )}

        {/* tags */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', flex:1, minWidth:0 }}>
          <Tag size={13} color="var(--text-muted)" />
          <input
            style={{ border:'none', outline:'none', background:'transparent', fontSize:'0.8rem', color:'var(--text-secondary)', flex:1, fontFamily:'var(--font-body)' }}
            placeholder="tags, comma separated"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{wc} words</span>
      </div>

      {/* ── toolbar (write mode only) ── */}
      {viewMode === 'write' && (
        <div className="editor-toolbar">
          <button className="toolbar-btn" onClick={() => insertAtCursor('**','**','bold text')}><strong>B</strong></button>
          <button className="toolbar-btn" onClick={() => insertAtCursor('*','*','italic text')}><em>I</em></button>
          <button className="toolbar-btn" onClick={() => insertAtCursor('# ','','Heading 1')}>H1</button>
          <button className="toolbar-btn" onClick={() => insertAtCursor('## ','','Heading 2')}>H2</button>
          <button className="toolbar-btn" onClick={() => insertAtCursor('- ','','List item')}>• List</button>
          <button className="toolbar-btn" onClick={() => insertAtCursor('- [ ] ','','Task')}>☐ Task</button>
          <button className="toolbar-btn" onClick={() => setShowImageModal(true)}>
            <ImageIcon size={13} /> Image
          </button>
        </div>
      )}

      {/* ── prompt hint ── */}
      {defaultPrompt && !entry && viewMode === 'write' && (
        <div style={{ padding:'0.45rem 1.25rem', fontSize:'0.82rem', color:'var(--text-muted)', fontStyle:'italic', borderBottom:'1px solid var(--border)', background:'var(--bg-primary)' }}>
          💭 {defaultPrompt}
        </div>
      )}

      {/* ── editor body ── */}
      <div className="editor-body">
        {viewMode === 'write' ? (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write freely...\n\nYour thoughts, your words, your Haven."
          />
        ) : (
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || '<p style="color:var(--text-muted)">Nothing to preview yet...</p>' }}
          />
        )}
      </div>

      {/* ── image modal ── */}
      {showImageModal && (
        <div className="overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={e => e.stopPropagation()}>
            <h3>Insert Image</h3>
            <label style={{ fontSize:'0.8rem', color:'var(--text-muted)', display:'block', marginBottom:'0.3rem' }}>Paste image URL</label>
            <input
              className="input-field"
              placeholder="https://example.com/photo.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              style={{ marginBottom:'0.75rem' }}
            />
            <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.8rem', margin:'0.5rem 0' }}>— or —</div>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginBottom:'1rem' }} onClick={() => fileInputRef.current.click()}>
              📁 Upload from computer
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileUpload} />
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowImageModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={() => imageUrl && insertImage(imageUrl)}>Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
