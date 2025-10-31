import React, { useState, useCallback } from 'react';
import { Article, ContentBlock } from '../types';
import { generateNewsArticle, createSolidColorPlaceholderUrl } from '../services/geminiService';
import ViewHeader from './ViewHeader';
import ErrorMessage from './ErrorMessage';

const GeneratedArticleDisplay: React.FC<{ article: Article }> = ({ article }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = createSolidColorPlaceholderUrl('800x400');
    };

    const renderContentBlock = (block: ContentBlock, index: number) => {
        switch (block.type) {
        case 'subheading':
            return (
            <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                {block.content}
            </h2>
            );
        case 'quote':
            return (
            <blockquote key={index} className="my-6 pl-4 border-l-4 border-gray-300 dark:border-zinc-700">
                <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 font-serif">
                "{block.content}"
                </p>
            </blockquote>
            );
        case 'paragraph':
        default:
            return (
            <p key={index} className="text-lg text-gray-800 dark:text-gray-300 mb-6 leading-relaxed font-serif">
                {block.content}
            </p>
            );
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-zinc-800 animate-fade-in">
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover" onError={handleImageError} />
            <div className="p-6 md:p-8">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">{article.category}</span>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white my-2">{article.title}</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mb-6">{article.sourceName}</p>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 font-serif italic mb-8">
                    {article.summary}
                </p>

                <div className="prose-lg max-w-none dark:prose-invert">
                    {article.fullContent.map(renderContentBlock)}
                </div>

                {/* FIX: Display Google Search Grounding URLs if available */}
                {article.groundingUrls && article.groundingUrls.length > 0 && (
                    <div className="mt-12 border-t border-gray-200 dark:border-zinc-700 pt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Google Search Sources</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {article.groundingUrls.map((url, index) => (
                                <li key={index}>
                                    <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const ArticleSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
        <div className="w-full h-64 shimmer-bg"></div>
        <div className="p-6 md:p-8">
            <div className="h-4 w-1/4 shimmer-bg rounded mb-4"></div>
            <div className="h-8 w-full shimmer-bg rounded mb-2"></div>
            <div className="h-8 w-3/4 shimmer-bg rounded mb-4"></div>
            <div className="h-5 w-1/3 shimmer-bg rounded mb-8"></div>

            <div className="space-y-4">
                <div className="h-5 w-full shimmer-bg rounded"></div>
                <div className="h-5 w-full shimmer-bg rounded"></div>
                <div className="h-5 w-5/6 shimmer-bg rounded"></div>
                 <div className="h-5 w-full shimmer-bg rounded mt-6"></div>
                <div className="h-5 w-1/2 shimmer-bg rounded"></div>
            </div>
        </div>
    </div>
);


const AINewsroom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [topic, setTopic] = useState('');
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setArticle(null);
        
        try {
            const newArticle = await generateNewsArticle(topic);
            setArticle(newArticle);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
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
            <ViewHeader title="AI Newsroom" onBack={onBack} />
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generate an Article</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">Enter any topic and let our AI journalist write a news story for you.</p>
                <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The future of renewable energy in Africa"
                        className="flex-grow bg-gray-100 dark:bg-zinc-800 border-2 border-transparent focus:border-black dark:focus:border-white focus:ring-0 text-gray-900 dark:text-white rounded-lg py-2 px-4 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="px-6 py-3 font-semibold rounded-lg transition-colors duration-200 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </form>
            </div>
            
            <div className="max-w-4xl mx-auto">
                {isLoading && <ArticleSkeleton />}
                {error && <ErrorMessage message={error} />}
                {article && !isLoading && <GeneratedArticleDisplay article={article} />}
            </div>
        </div>
    );
};

export default AINewsroom;