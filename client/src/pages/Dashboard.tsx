import React, { useEffect, useState, useMemo } from 'react';
import { useNotes } from '../hooks/useNote';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { useInView } from 'react-intersection-observer';
import { type Note } from '../types';
import {
  Plus,
  Search,
  FileText,
  Layers,
  Tag,
  AlertCircle,
  FileX2,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotes();

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '120px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEditInitiate = (note: Note) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNoteToEdit(null);
  };

  /* --- Derived stats ---- */
  const allNotes = useMemo(
    () => data?.pages.flatMap((p) => p.notes) ?? [],
    [data]
  );

  const totalNotes = data?.pages[0]?.totalNotes ?? allNotes.length;

  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    allNotes.forEach((n) => n.tags?.forEach((t) => set.add(t)));
    return set.size;
  }, [allNotes]);

  /* --- Client-side search filter ---- */
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return allNotes;
    const q = searchQuery.toLowerCase();
    return allNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [allNotes, searchQuery]);

  const isEmpty = !isLoading && allNotes.length === 0;
  const noResults = !isLoading && allNotes.length > 0 && filteredNotes.length === 0;

  return (
    <>
      {/* ─── Sticky Navbar ─── */}
      <nav className="navbar" aria-label="Primary navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <a href="/" className="logo" aria-label="NotesPro home">
            <div className="logo-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span className="logo-text">NotesPro</span>
          </a>

          {/* Right meta */}
          <div className="navbar-meta">
            <span className="badge-live">Live</span>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="page-container" id="main-content">
        {/* Hero */}
        <header className="page-hero">
          <div className="page-hero-label">
            <FileText size={11} />
            Professional Workspace
          </div>
          <h1>Your Intelligent<br />Note Universe</h1>
          <p>Capture, organise, and retrieve your ideas with a workspace built for deep work.</p>
        </header>

        {/* Stats Bar */}
        {!isLoading && (
          <div className="stats-bar" role="region" aria-label="Statistics">
            <div className="stat-item">
              <div className="stat-value">{totalNotes}</div>
              <div className="stat-label">Total Notes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{allNotes.length}</div>
              <div className="stat-label">Loaded</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{uniqueTags}</div>
              <div className="stat-label">Unique Tags</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{filteredNotes.length}</div>
              <div className="stat-label">Showing</div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          {/* Search */}
          <div className="search-wrap" role="search">
            <Search size={15} aria-hidden="true" />
            <input
              id="notes-search"
              type="search"
              className="search-input"
              placeholder="Search notes, tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search notes"
            />
          </div>

          {/* New Note CTA */}
          <button
            id="create-note-btn"
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
            aria-label="Create new note"
          >
            <Plus size={17} />
            <span>New Note</span>
          </button>
        </div>

        {/* Error Banner */}
        {isError && (
          <div className="error-banner" role="alert" aria-live="assertive">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{(error as Error).message}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="spinner-wrap" aria-label="Loading notes">
            <div className="spinner" role="status" aria-label="Loading" />
            <span className="spinner-label">Fetching your notes…</span>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="empty-state" role="region" aria-label="No notes">
            <div className="empty-state-icon" aria-hidden="true">
              <FileX2 size={30} />
            </div>
            <h3>No notes yet</h3>
            <p>Start by creating your first note. Capture an idea, a task, or anything that matters.</p>
            <button
              id="create-first-note-btn"
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              <span>Create your first note</span>
            </button>
          </div>
        )}

        {/* No Search Results */}
        {noResults && (
          <div className="empty-state" role="region" aria-label="No search results">
            <div className="empty-state-icon" aria-hidden="true">
              <Search size={30} />
            </div>
            <h3>No matches found</h3>
            <p>Try a different keyword or clear the search to see all notes.</p>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && filteredNotes.length > 0 && (
          <>
            <section
              className="notes-grid"
              aria-label="Notes grid"
              id="notes-grid"
            >
              {filteredNotes.map((note, idx) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEditClick={handleEditInitiate}
                  index={idx}
                />
              ))}
            </section>

            {/* Infinite scroll sentinel */}
            <div ref={ref} className="scroll-sentinel" aria-live="polite">
              {isFetchingNextPage ? (
                <>
                  <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} role="status" aria-label="Loading more notes" />
                  <span>Loading more…</span>
                </>
              ) : hasNextPage ? (
                <>
                  <div className="sentinel-dot" />
                  <div className="sentinel-dot" />
                  <div className="sentinel-dot" />
                  <span>Scroll for more</span>
                </>
              ) : allNotes.length > 0 ? (
                <>
                  <Layers size={13} />
                  <span>All {totalNotes} notes loaded</span>
                  <Tag size={13} />
                  <span>{uniqueTags} tags</span>
                </>
              ) : null}
            </div>
          </>
        )}
      </main>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        noteToEdit={noteToEdit}
      />
    </>
  );
};

export default Dashboard;