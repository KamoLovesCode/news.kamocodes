import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { getSavedArticles } from '../services/offlineService';
import ArticleCard from './ArticleCard';
import ErrorMessage from './ErrorMessage';
import { useAuth } from '../contexts/AuthContext';

interface SavedArticlesPageProps {
  onArticleSelect: (article: Article) => void;
}

const ArticleCardSkeleton: React.FC = () => <div className="bg-surface-dark rounded-lg overflow-hidden shimmer-bg h-80"></div>;


const SavedArticlesPage: React.FC<SavedArticlesPageProps> = ({ onArticleSelect }) => {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
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
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        // Don't show "API not implemented" to the user, show a friendlier message.
        if (errorMessage.includes('not implemented')) {
            setError("This feature is not yet connected to our servers.");
        } else {
            setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedArticles();
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-1 text-on-primary tracking-tight">
          Welcome, {user?.name.split(' ')[0] || 'Guest'}!
        </h1>
        <p className="text-on-surface">Your collection of saved articles.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-on-primary">Your Saved Articles</h2>
        
        {error && <ErrorMessage message={error} />}
        
        {isLoading && (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
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
           <div className="text-center py-10 bg-surface-dark rounded-lg border border-outline">
             <span className="material-symbols-outlined text-4xl text-on-surface/50">bookmark</span>
             <p className="mt-2 text-sm text-on-surface">You haven't saved any articles yet.</p>
             <p className="mt-1 text-xs text-on-surface/70">Find an article and tap the save icon to read it here later.</p>
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

export default SavedArticlesPage;
