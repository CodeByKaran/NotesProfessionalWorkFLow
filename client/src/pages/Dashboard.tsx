import React, { useEffect } from 'react';
import { useNotes } from '../hooks/useNote';
import NoteCard from '../components/NoteCard';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Dashboard: React.FC = () => {
    // 1. Destructure all the powerful utilities React Query gives us
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useNotes();

    // 2. Set up the Intersection Observer
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "50px", // Trigger fetch 100px before reaching the bottom
    });

    // 3. Trigger the next fetch when the observer element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            console.log("fetching");
            
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                    <p className="text-gray-500 mt-1">Manage your thoughts and ideas securely.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <PlusCircle size={18} />
                    New Note
                </button>
            </div>

            {/* Error State */}
            {isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
                    {(error as Error).message}
                </div>
            )}

            {/* Initial Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : data?.pages[0].notes.length === 0 ? (
                /* Empty State */
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notes yet</h3>
                    <p className="text-gray-500">Get started by creating a new note.</p>
                </div>
            ) : (
                <>
                    {/* Data Grid: Map through pages, then map through notes in each page */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.notes.map((note) => (
                                    <NoteCard key={note._id} note={note} />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* The Intersection Observer Target */}
                    <div ref={ref} className="flex justify-center py-8">
                        {isFetchingNextPage ? (
                            <Loader2 className="animate-spin text-blue-600" size={24} />
                        ) : hasNextPage ? (
                            <span className="text-gray-400 text-sm">Scroll for more</span>
                        ) : (
                            <span className="text-gray-400 text-sm">You've reached the end!</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;