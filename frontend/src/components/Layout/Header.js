import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function Header({ search, setSearch, onNew, activeView, isJournal }) {
  const showNew = ['all', 'pinned', 'entries', 'tags', 'archive'].includes(activeView);

  return (
    <div className="header">
      <div className="search-bar">
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder={isJournal ? 'Search journal...' : 'Search notes...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {showNew && (
        <button className="btn btn-primary" onClick={onNew}>
          <Plus size={15} />
          New
        </button>
      )}
    </div>
  );
}
