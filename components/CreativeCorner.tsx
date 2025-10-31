import React, { useState, useEffect, useCallback } from 'react';
import { fetchDailyQuote, generateCreativeIdea } from '../services/geminiService';
import { Quote } from '../types';
import ViewHeader from './ViewHeader';

const QuoteSkeleton: React.FC = () => (
    <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-zinc-800 rounded w-full mb-3"></div>
        <div className="h-6 bg-gray-300 dark:bg-zinc-800 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-800 rounded w-1/4 ml-auto"></div>
    </div>
);

const IdeaSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 text-center animate-pulse">
        <div className="h-5 bg-gray-300 dark:bg-zinc-800 rounded w-5/6 mx-auto mb-6"></div>
        <div className="h-12 bg-gray-300 dark:bg-zinc-800 rounded-lg w-40 mx-auto"></div>
    </div>
);


const CreativeCorner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [idea, setIdea] = useState<string | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(true);
    const [isIdeaLoading, setIsIdeaLoading] = useState(false);

    useEffect(() => {
        fetchDailyQuote()
            .then(setQuote)
            .catch(err => {
                console.error("Failed to fetch daily quote:", err);
                // Set quote to null to prevent rendering a broken component on error
                setQuote(null);
            })
            .finally(() => setIsQuoteLoading(false));
    }, []);

    const handleGenerateIdea = useCallback(async () => {
        setIsIdeaLoading(true);
        try {
            const newIdea = await generateCreativeIdea();
            setIdea(newIdea);
        } catch (error) {
            console.error(error);
            setIdea("Could not generate an idea. Please try again.");
        } finally {
            setIsIdeaLoading(false);
        }
    }, []);
    
    // Generate an initial idea on component mount
    useEffect(() => {
        handleGenerateIdea();
    }, [handleGenerateIdea]);


    return (
        <div className="animate-fade-in space-y-8">
            <ViewHeader title="Creative Corner" onBack={onBack} />
            
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quote of the Day</h2>
                {isQuoteLoading ? <QuoteSkeleton /> : quote && (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 p-8 rounded-xl shadow-inner">
                        <blockquote className="text-center">
                            <p className="text-2xl font-serif italic text-gray-800 dark:text-gray-200">
                                “{quote.text}”
                            </p>
                            <footer className="mt-4 text-md font-semibold text-gray-600 dark:text-gray-400">
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                )}
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Spark Your Creativity</h2>
                {(isIdeaLoading && !idea) ? <IdeaSkeleton /> : (
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center min-h-[150px]">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 flex-grow flex items-center">{idea || "Click the button to generate an idea!"}</p>
                        <button
                            onClick={handleGenerateIdea}
                            disabled={isIdeaLoading}
                            className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors duration-200 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isIdeaLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : "Generate New Idea"}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CreativeCorner;