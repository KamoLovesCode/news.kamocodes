import React from 'react';
import { EngagingArticle } from '../types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  title: string;
  articles: EngagingArticle[];
  onBack: () => void;
  onArticleSelect: (article: EngagingArticle) => void;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ title, articles, onBack, onArticleSelect }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} onSelect={onArticleSelect} />
        ))}
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ArticleGrid;