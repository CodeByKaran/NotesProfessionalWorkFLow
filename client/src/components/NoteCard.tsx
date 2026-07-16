import React from 'react';
import { type Note } from '../types';
import { Calendar, Tag } from 'lucide-react'; // From the lucide-react package we installed

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const formattedDate = new Date(note.createdAt).toLocaleDateString();

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
            <p className="text-gray-600 grow mb-4 line-clamp-3">{note.content}</p>
            
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