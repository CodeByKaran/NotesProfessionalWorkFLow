import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { type Note } from '../types';

// Define the shape of our new paginated API response
interface FetchNotesResponse {
    notes: Note[];
    nextPage: number | null;
    totalNotes: number;
}

export const useNotes = () => {
    return useInfiniteQuery({
        queryKey: ['notes'], // The unique cache key for this data
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await api.get<FetchNotesResponse>(`/notes?page=${pageParam}&limit=10`);
            return data;
        },
        initialPageParam: 1, // Start on page 1
        getNextPageParam: (lastPage) => lastPage.nextPage, // React Query will use this to fetch the next chunk
    });
};

interface CreateNotePayload {
    title: string;
    content: string;
    tags?: string[];
}

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newNote: CreateNotePayload) => {
            const { data } = await api.post<Note>('/notes', newNote);
            return data;
        },
        // Crucial Senior Step: Invalidate the cache on success to force a UI refresh
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};