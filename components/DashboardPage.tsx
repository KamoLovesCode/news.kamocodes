import React, { useState, useEffect } from 'react';
import { Article, EngagingArticle } from '../types';
import { getSavedArticles } from '../services/offlineService';
import Weather from './Weather';
import ArticleCard from './ArticleCard';
import ErrorMessage from './ErrorMessage';

interface DashboardPageProps {
  onArticleSelect: (article: Article | EngagingArticle) => void;
}

const ArticleCardSkeleton: React.FC = () => <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shimmer-bg h-80"></div>;


const DashboardPage: React.FC<DashboardPageProps> = ({ onArticleSelect }) => {
  const [savedArticles, setSavedArticles] = useState<Array<Article | EngagingArticle>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const articles = await getSavedArticles();
        setSavedArticles(articles);
      } catch (err) {
        setError("Failed to load saved articles.");
      } finally {
        setIsLoading(false);
      }
    };
    // Re-load articles when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadSavedArticles();
      }
    };
    
    loadSavedArticles();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <Weather />
      
      <div>
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
          Saved Articles
        </h1>
        {error && <ErrorMessage message={error} />}
        
        {isLoading && (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {Array.from({ length: 5 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
           </div>
        )}

        {!isLoading && savedArticles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onSelect={onArticleSelect} 
              />
            ))}
          </div>
        )}

        {!isLoading && !error && savedArticles.length === 0 && (
           <div className="text-center py-10 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
             </svg>
             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You haven't saved any articles yet.</p>
             <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Find an article and tap the save icon to read it here later.</p>
           </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
