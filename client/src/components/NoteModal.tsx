import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCreateNote, useUpdateNote } from '../hooks/useNote';
import { type Note } from '../types';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    noteToEdit?: Note | null; // Added option to pass a note for editing
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, noteToEdit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [validationError, setValidationError] = useState('');

    const createMutation = useCreateNote();
    const updateMutation = useUpdateNote();

    const isPending = createMutation.isPending || updateMutation.isPending;

    // Effect to seed the form state if we are in Edit Mode
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
    }, [noteToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (!title.trim() || !content.trim()) {
            setValidationError('Title and Content are explicitly required.');
            return;
        }

        const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        const mutationOptions = {
            onSuccess: () => {
                setTitle('');
                setContent('');
                setTagInput('');
                onClose();
            }
        };

        if (noteToEdit) {
            // Execute Update Mutation
            updateMutation.mutate(
                { id: noteToEdit._id, title, content, tags },
                mutationOptions
            );
        } else {
            // Execute Create Mutation
            createMutation.mutate(
                { title, content, tags },
                mutationOptions
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 transform transition-all">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {noteToEdit ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {validationError && (
                        <div className="text-sm bg-red-50 text-red-600 p-3 rounded-lg border border-red-100">
                            {validationError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Enter note title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                            placeholder="Write your thoughts here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="e.g. work, ideas, personal"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center disabled:opacity-70"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModal;