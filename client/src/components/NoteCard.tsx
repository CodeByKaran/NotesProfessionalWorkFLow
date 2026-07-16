import React from 'react';
import { type Note } from '../types';
import { Calendar, Tag, Edit3, Trash2 } from 'lucide-react';
import { useDeleteNote } from '../hooks/useNote';

interface NoteCardProps {
    note: Note;
    onEditClick: (note: Note) => void; // Added callback to handle edit click
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEditClick }) => {
    const formattedDate = new Date(note.createdAt).toLocaleDateString();
    const { mutate: deleteNote, isPending: dishonestyIsDeleting } = useDeleteNote();

    const handleDelete = () => {
        if (window.confirm('Are you completely sure you want to delete this note?')) {
            deleteNote(note._id);
        }
    };

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full ${dishonestyIsDeleting ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{note.title}</h3>
                
                {/* Action Controls */}
                <div className="flex items-center gap-2 ml-2 opacity-60 hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEditClick(note)}
                        className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Note"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Note"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 flex-grow mb-4 line-clamp-3 whitespace-pre-wrap">{note.content}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                </div>
                
                {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <Tag size={12} />
                        <span className="text-xs font-medium">{note.tags[0]}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteCard;