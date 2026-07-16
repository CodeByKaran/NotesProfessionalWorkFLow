import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Note } from '../types';

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get<Note[]>('/notes');
            setNotes(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch notes');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return { notes, isLoading, error, refetch: fetchNotes };
};