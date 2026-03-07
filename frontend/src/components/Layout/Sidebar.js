import React, { useState } from 'react';
import { BookOpen, FileText, Pin, Archive, Trash2, Tag, Calendar, Flame, ChevronLeft, ChevronRight, Palette, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemePanel from '../UI/ThemePanel';

export default function Sidebar({ activeView, setActiveView, mode, switchMode, collapsed, setCollapsed }) {
  const { isDark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const [showThemes, setShowThemes] = useState(false);
  const isJournal = mode === 'journal';

  const notesNav = [
    { id: 'all',     label: 'All Notes', icon: <FileText size={16} /> },
    { id: 'pinned',  label: 'Pinned',    icon: <Pin size={16} /> },
    { id: 'tags',    label: 'Tags',      icon: <Tag size={16} /> },
    { id: 'archive', label: 'Archive',   icon: <Archive size={16} /> },
    { id: 'trash',   label: 'Trash',     icon: <Trash2 size={16} /> },
  ];

  const journalNav = [
    { id: 'entries',  label: 'Entries',  icon: <BookOpen size={16} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} /> },
    { id: 'pinned',   label: 'Pinned',   icon: <Pin size={16} /> },
    { id: 'tags',     label: 'Tags',     icon: <Tag size={16} /> },
    { id: 'archive',  label: 'Archive',  icon: <Archive size={16} /> },
    { id: 'trash',    label: 'Trash',    icon: <Trash2 size={16} /> },
  ];

  const navItems = isJournal ? journalNav : notesNav;

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Brand + collapse toggle */}
        <div className="sidebar-brand">
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(c => !c)}
            title="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
          {!collapsed && (
            <div>
              <div className="sidebar-brand-name">Haven</div>
              <div className="sidebar-brand-user">@{user?.username}</div>
            </div>
          )}
        </div>

        {/* Mode selector */}
        <div className="mode-selector">
          <button
            className={`mode-btn ${!isJournal ? 'active' : ''}`}
            onClick={() => { switchMode('notes'); setActiveView('all'); }}
            title="Notes"
          >
            <FileText size={16} />
            {!collapsed && <span>Notes</span>}
          </button>
          <button
            className={`mode-btn ${isJournal ? 'active' : ''}`}
            onClick={() => { switchMode('journal'); setActiveView('entries'); }}
            title="Journal"
          >
            <BookOpen size={16} />
            {!collapsed && <span>Journal</span>}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section">{isJournal ? 'Journal' : 'Notes'}</div>}
          {navItems.map((item, i) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={item.label}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {item.icon}
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}

          {!collapsed && <div className="nav-section" style={{ marginTop: '0.4rem' }}>Appearance</div>}
          <button
            className="nav-item"
            onClick={() => setShowThemes(true)}
            title="Themes"
          >
            <Palette size={16} />
            {!collapsed && <span className="nav-label">Themes</span>}
          </button>
        </nav>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          {isJournal && user?.journalStreak > 0 && !collapsed && (
            <div className="streak-badge">
              <Flame size={13} /> {user.journalStreak} day streak
            </div>
          )}
          <div className="sidebar-actions">
            <button
              className="btn-icon"
              onClick={toggleDark}
              title={isDark ? 'Light mode' : 'Dark mode'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              className="btn-icon"
              onClick={logout}
              title="Logout"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {showThemes && <ThemePanel onClose={() => setShowThemes(false)} />}
    </>
  );
}
