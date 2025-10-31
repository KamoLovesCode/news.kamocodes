import React from 'react';
import { Article } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface ArticleListItemProps {
  article: Article;
  onSelect: (article: Article) => void;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article, onSelect }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('300x200');
  };

  return (
    <div 
        onClick={() => onSelect(article)}
        className="flex items-center space-x-4 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-surface-dark transition-colors duration-200"
    >
        <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-surface-dark">
            <img 
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
            />
        </div>
        <div className="flex-1">
            <p className="text-sm font-semibold text-accent-orange">{article.category}</p>
            <h3 className="font-bold text-md sm:text-lg mt-1 text-on-primary group-hover:underline leading-tight line-clamp-2" title={article.title}>
                {article.title}
            </h3>
            {article.sourceName && (
                <p className="text-xs text-on-surface mt-1">{article.sourceName}</p>
            )}
        </div>
    </div>
  );
};

export default ArticleListItem;