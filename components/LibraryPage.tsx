import React, { useState, useEffect } from 'react';
import { fetchArticlesForLibrary } from '../services/geminiService';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import ErrorMessage from './ErrorMessage';

interface OfflineReadingPageProps {
    onArticleSelect: (article: Article) => void;
}

const ArticleCardSkeleton: React.FC = () => <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shimmer-bg h-80"></div>;

const OfflineReadingPage: React.FC<OfflineReadingPageProps> = ({ onArticleSelect }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedArticles = await fetchArticlesForLibrary();
        setArticles(fetchedArticles);
      } catch (e) {
        console.error("Failed to load articles for offline reading", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  return (
    <div className="space-y-12">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Offline Reading</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                These articles are available for reading even when you're offline, loaded from your local storage.
            </p>
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
                </div>
            )}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && articles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {articles.map(article => <ArticleCard key={article.id} article={article} onSelect={onArticleSelect} />)}
                </div>
            )}
            {!isLoading && !error && articles.length === 0 && <p className="text-center py-8 text-gray-500">No articles available for offline reading. Add some in the admin panel!</p>}
        </div>
    </div>
  );
};

export default OfflineReadingPage;