import React, { useState, useCallback, useRef, useEffect } from 'react';
import { streamNewsUpdates } from '../services/geminiService';
import ViewHeader from './ViewHeader';
import ErrorMessage from './ErrorMessage';

const AILiveFeed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [topic, setTopic] = useState('');
    const [feedContent, setFeedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to the bottom of the feed as content is added
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [feedContent]);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setFeedContent('');
        
        try {
            const stream = streamNewsUpdates(topic);
            for await (const chunk of stream) {
                setFeedContent(prev => prev + chunk);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while streaming.");
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleGenerate();
    };
    
    return (
        <div className="animate-fade-in space-y-8">
            <ViewHeader title="AI Live Feed" onBack={onBack} />
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Start a Live Feed</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">Enter a topic to generate a real-time stream of news updates.</p>
                <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., breakthroughs in battery technology"
                        className="flex-grow bg-gray-100 dark:bg-zinc-800 border-2 border-transparent focus:border-black dark:focus:border-white focus:ring-0 text-gray-900 dark:text-white rounded-lg py-2 px-4 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="px-6 py-3 font-semibold rounded-lg transition-colors duration-200 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Streaming...' : 'Start Feed'}
                    </button>
                </form>
            </div>
            
            {error && <ErrorMessage message={error} />}

            <div 
                ref={feedRef}
                className="w-full h-96 bg-black dark:bg-zinc-900/50 rounded-lg p-4 font-mono text-sm text-green-400 dark:text-green-300 border border-gray-200 dark:border-zinc-800 overflow-y-auto scrollbar-hide whitespace-pre-wrap"
            >
                {feedContent}
                {isLoading && <span className="blinking-cursor"></span>}
                {!isLoading && !feedContent && (
                     <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 9.393a15 15 0 0121.213 0" /></svg>
                        <span>Feed output will appear here...</span>
                     </div>
                )}
            </div>
        </div>
    );
};

export default AILiveFeed;