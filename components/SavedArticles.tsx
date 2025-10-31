import React, { useState, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { getSavedArticles } from '../services/offlineService';
import ErrorMessage from './ErrorMessage';

interface SavedArticlesProps {
  onArticleSelect: (article: Article) => void;
}

const SavedArticleItem: React.FC<{ article: Article, onSelect: (article: Article) => void }> = ({ article, onSelect }) => (
    <div
        onClick={() => onSelect(article)}
        className="group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-outline transition-colors flex items-center gap-3"
    >
        <div className="w-12 h-12 rounded-md bg-primary-dark overflow-hidden shrink-0">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-semibold text-on-primary group-hover:underline line-clamp-2 leading-tight">
                {article.title}
            </h4>
            <p className="text-xs text-on-surface line-clamp-1">{article.sourceName}</p>
        </div>
    </div>
);


const SavedArticles: React.FC<SavedArticlesProps> = ({ onArticleSelect }) => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedArticles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Re-load articles when the page becomes visible, to reflect changes made elsewhere
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadSavedArticles();
      }
    };
    
    loadSavedArticles();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // NOTE: The 'storageUpdated' event listener has been removed as it was tied to localStorage.
    // The component now relies on visibility changes or parent component re-renders to refresh its data.
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadSavedArticles]);

  return (
    <div className="bg-surface-dark p-6 rounded-xl border border-outline">
        <h3 className="text-xl font-bold text-on-primary mb-4">Saved Articles</h3>
        {error && <ErrorMessage message={error} />}
        
        {isLoading && (
           <div className="space-y-3">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 shimmer-bg p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-md bg-outline"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-full bg-outline rounded"></div>
                        <div className="h-3 w-1/2 bg-outline rounded"></div>
                    </div>
                </div>
             ))}
           </div>
        )}

        {!isLoading && savedArticles.length > 0 && (
          <div className="space-y-3">
            {savedArticles.slice(0, 5).map(article => ( // Show up to 5 articles
              <SavedArticleItem 
                key={article.id} 
                article={article} 
                onSelect={onArticleSelect} 
              />
            ))}
          </div>
        )}

        {!isLoading && !error && savedArticles.length === 0 && (
           <div className="text-center py-6">
             <span className="material-symbols-outlined text-4xl text-on-surface/50">bookmark_add</span>
             <p className="mt-2 text-sm text-on-surface">No saved articles yet.</p>
             <p className="mt-1 text-xs text-on-surface/70">Save articles to read them here later.</p>
           </div>
        )}
    </div>
  );
};

export default SavedArticles;