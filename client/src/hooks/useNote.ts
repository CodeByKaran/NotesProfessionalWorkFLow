import { useInfiniteQuery } from '@tanstack/react-query';
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