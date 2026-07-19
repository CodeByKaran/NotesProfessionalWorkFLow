import React, { memo, useCallback } from 'react';
import { type Note } from '../types';
import { Calendar, Tag, Edit3, Trash2 } from 'lucide-react';
import { useDeleteNote } from '../hooks/useNote';

interface NoteCardProps {
  note: Note;
  onEditClick: (note: Note) => void;
  index?: number;
}

const NoteCard: React.FC<NoteCardProps> = memo(({ note, onEditClick, index = 0 }) => {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const handleDelete = useCallback(() => {
    if (window.confirm('Delete this note? This action cannot be undone.')) {
      deleteNote(note._id);
    }
  }, [deleteNote, note._id]);

  const handleEdit = useCallback(() => {
    onEditClick(note);
  }, [onEditClick, note]);

  // Stagger animation delay based on card position in grid
  const animDelay = `${Math.min(index * 60, 400)}ms`;

  return (
    <article
      className={`note-card${isDeleting ? ' deleting' : ''}`}
      style={{ animationDelay: animDelay }}
      aria-label={`Note: ${note.title}`}
    >
      {/* Left accent bar */}
      <div className="note-card-accent" aria-hidden="true" />

      {/* Header */}
      <div className="note-card-header">
        <h2 className="note-card-title" title={note.title}>
          {note.title}
        </h2>

        {/* Action buttons — revealed on hover */}
        <div className="note-actions" role="group" aria-label="Note actions">
          <button
            id={`edit-note-${note._id}`}
            className="action-btn"
            onClick={handleEdit}
            title="Edit note"
            aria-label={`Edit note: ${note.title}`}
          >
            <Edit3 size={14} />
          </button>
          <button
            id={`delete-note-${note._id}`}
            className="action-btn danger"
            onClick={handleDelete}
            title="Delete note"
            aria-label={`Delete note: ${note.title}`}
            disabled={isDeleting}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <p className="note-card-body">{note.content}</p>

      {/* Footer */}
      <footer className="note-card-footer">
        <time className="note-date" dateTime={note.createdAt} title={note.createdAt}>
          <Calendar size={12} aria-hidden="true" />
          {formattedDate}
        </time>

        {note.tags && note.tags.length > 0 && (
          <div className="note-tags" aria-label="Tags">
            {note.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="note-tag">
                <Tag size={9} aria-hidden="true" />
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="note-tag" title={note.tags.slice(2).join(', ')}>
                +{note.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </footer>
    </article>
  );
});

NoteCard.displayName = 'NoteCard';

export default NoteCard;