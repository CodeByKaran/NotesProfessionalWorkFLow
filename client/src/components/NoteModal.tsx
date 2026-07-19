import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, FileText, Edit3, AlertCircle, Tag, Type } from 'lucide-react';
import { useCreateNote, useUpdateNote } from '../hooks/useNote';
import { type Note } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, noteToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const titleRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const isEditing = Boolean(noteToEdit);

  // Seed form when modal opens or note changes
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTagInput(noteToEdit.tags ? noteToEdit.tags.join(', ') : '');
    } else {
      setTitle('');
      setContent('');
      setTagInput('');
    }
    setValidationError('');
  }, [noteToEdit, isOpen]);

  // Auto-focus title field when modal opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => titleRef.current?.focus(), 80);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, isPending, onClose]);

  // Block body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setValidationError('');

      if (!title.trim()) {
        setValidationError('Title is required.');
        titleRef.current?.focus();
        return;
      }
      if (!content.trim()) {
        setValidationError('Content cannot be empty.');
        return;
      }

      const tags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const mutationOptions = {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setTagInput('');
          onClose();
        },
        onError: (err: Error) => {
          setValidationError(err.message || 'Something went wrong. Please try again.');
        },
      };

      if (noteToEdit) {
        updateMutation.mutate({ id: noteToEdit._id, title, content, tags }, mutationOptions);
      } else {
        createMutation.mutate({ title, content, tags }, mutationOptions);
      }
    },
    [title, content, tagInput, noteToEdit, createMutation, updateMutation, onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isPending) onClose();
    },
    [isPending, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="modal-panel">
        {/* ─── Header ─── */}
        <div className="modal-header">
          <div className="modal-title" id="modal-title">
            <div className="modal-title-icon" aria-hidden="true">
              {isEditing ? <Edit3 size={16} /> : <FileText size={16} />}
            </div>
            {isEditing ? 'Edit Note' : 'New Note'}
          </div>
          <button
            id="modal-close-btn"
            className="modal-close"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Validation Error */}
            {validationError && (
              <div className="form-error" role="alert" aria-live="assertive">
                <AlertCircle size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
                {validationError}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="note-title" className="form-label">
                <Type size={11} aria-hidden="true" />
                Title
              </label>
              <input
                id="note-title"
                ref={titleRef}
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a great title…"
                autoComplete="off"
                maxLength={200}
                required
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <label htmlFor="note-content" className="form-label">
                <FileText size={11} aria-hidden="true" />
                Content
              </label>
              <textarea
                id="note-content"
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, ideas, or anything here…"
                required
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="note-tags" className="form-label">
                <Tag size={11} aria-hidden="true" />
                Tags
              </label>
              <input
                id="note-tags"
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="work, ideas, personal (comma separated)"
                autoComplete="off"
              />
              <span className="form-hint">Separate multiple tags with commas</span>
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="modal-footer">
            <button
              id="modal-cancel-btn"
              type="button"
              className="btn-ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              id="modal-submit-btn"
              type="submit"
              className="btn-submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="btn-spinner" aria-label="Saving…" />
                  <span>{isEditing ? 'Updating…' : 'Creating…'}</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Note'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;