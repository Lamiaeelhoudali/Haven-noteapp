import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import NotesGrid from '../components/Notes/NotesGrid';
import TagsView from '../components/Notes/TagsView';
import TrashView from '../components/Notes/TrashView';
import NoteEditor from '../components/Editor/NoteEditor';
import JournalEntries from '../components/Journal/JournalEntries';
import JournalCalendar from '../components/Journal/JournalCalendar';
import JournalTagsView from '../components/Journal/JournalTagsView';
import WelcomeModal from '../components/UI/WelcomeModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode] = useState(() => localStorage.getItem('haven_mode') || 'notes');
  const [activeView, setActiveView] = useState('all');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    localStorage.setItem('haven_mode', m);
    setActiveView(m === 'journal' ? 'entries' : 'all');
    setSearch('');
    setCreating(false);
  };

  useEffect(() => {
    const key = `haven_welcomed_${user?.id}`;
    if (!sessionStorage.getItem(key)) {
      setTimeout(() => setShowWelcome(true), 600);
      sessionStorage.setItem(key, '1');
    }
  }, [user]);

  const isJournal = mode === 'journal';

  const renderContent = () => {
    if (creating && !isJournal) {
      return (
        <NoteEditor
          note={null}
          onClose={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      );
    }

    if (isJournal) {
      switch (activeView) {
        case 'calendar': return <JournalCalendar />;
        case 'tags':     return <JournalTagsView />;
        case 'pinned':   return <JournalEntries search={search} filter="pinned" creating={creating} setCreating={setCreating} />;
        case 'archive':  return <JournalEntries search={search} filter="archive" creating={creating} setCreating={setCreating} />;
        case 'trash':    return <TrashView mode="journal" />;
        default:         return <JournalEntries search={search} creating={creating} setCreating={setCreating} />;
      }
    }

    switch (activeView) {
      case 'pinned':  return <NotesGrid search={search} filter="pinned" creating={creating} setCreating={setCreating} />;
      case 'archive': return <NotesGrid search={search} filter="archive" creating={creating} setCreating={setCreating} />;
      case 'tags':    return <TagsView />;
      case 'trash':   return <TrashView mode="notes" />;
      default:        return <NotesGrid search={search} filter="all" creating={creating} setCreating={setCreating} />;
    }
  };

  return (
    <div className="app-layout">
      {showWelcome && (
        <WelcomeModal
          isFirstTime={user?.isFirstLogin}
          username={user?.username}
          onClose={() => setShowWelcome(false)}
        />
      )}

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mode={mode}
        switchMode={switchMode}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header
          search={search}
          setSearch={setSearch}
          onNew={() => setCreating(true)}
          activeView={activeView}
          isJournal={isJournal}
        />
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
