import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { fetchHowToGuides } from '../services/geminiService';
import ArticleCard from './ArticleCard';
import ErrorMessage from './ErrorMessage';

const HowToPage: React.FC<{ onArticleSelect: (article: Article) => void }> = ({ onArticleSelect }) => {
    const [guides, setGuides] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGuides = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedGuides = await fetchHowToGuides();
                setGuides(fetchedGuides);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        loadGuides();
    }, []);

    const SkeletonCard = () => (
        <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Practical Guides</h2>
            <p className="text-gray-500 mb-6">
                Step-by-step guides for common tasks and services in South Africa.
            </p>
            
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {error && <ErrorMessage message={error} />}

            {!isLoading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {guides.map(guide => (
                        <ArticleCard key={guide.id} article={guide} onSelect={onArticleSelect} />
                    ))}
                </div>
            )}

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

export default HowToPage;