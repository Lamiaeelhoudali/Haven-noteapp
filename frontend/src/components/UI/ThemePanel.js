import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';

export default function ThemePanel({ onClose }) {
  const { themeName, isDark, switchTheme, applyCustom } = useTheme();
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({
    bg: '#f8faff', card: '#ffffff', sidebar: '#eef2fb',
    accent: '#5b9bd5', text: '#1a2540', muted: '#7a8aaa', border: '#dce4f0'
  });

  const handleCustomApply = () => {
    applyCustom({ ...custom });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="theme-panel" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2>Choose your theme</h2>
            <p className="theme-panel-sub">Pick a mood for today — change anytime</p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* 8 theme tiles */}
        <div className="theme-grid">
          {Object.entries(THEMES).map(([key, t]) => {
            const c = isDark ? t.dark : t.light;
            return (
              <div
                key={key}
                className={`theme-tile ${themeName === key ? 'selected' : ''}`}
                style={{ background: c.bg }}
                onClick={() => { switchTheme(key); }}
                title={t.name}
              >
                <div className="theme-preview" style={{ background: c.bg }}>
                  {t.emoji}
                </div>
                <div className="theme-label" style={{ background: c.sidebar, color: c.text }}>
                  {t.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom color section */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>🎨 Custom Colors</div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
              onClick={() => setShowCustom(v => !v)}
            >
              {showCustom ? 'Hide' : 'Customize'}
            </button>
          </div>

          {showCustom && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                {[
                  { key: 'bg', label: 'Background' },
                  { key: 'card', label: 'Card' },
                  { key: 'sidebar', label: 'Sidebar' },
                  { key: 'accent', label: 'Accent' },
                  { key: 'text', label: 'Text' },
                  { key: 'border', label: 'Border' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                    <input
                      type="color"
                      value={custom[key]}
                      onChange={e => setCustom(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ width: '100%', height: 34, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2, background: 'var(--bg-secondary)' }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleCustomApply}
              >
                Apply Custom Theme
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
