import React from 'react';
import { Article } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface FeaturedArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({ article, onSelect }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('400x500');
  };

  return (
    <div
      onClick={() => onSelect(article)}
      className="w-64 sm:w-72 h-80 sm:h-96 rounded-2xl overflow-hidden relative group cursor-pointer shrink-0 shadow-xl bg-surface-dark border border-outline/20"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-on-primary">
        <span className="inline-block bg-accent-orange text-primary-dark text-xs font-bold px-3 py-1 rounded-full mb-2">
          {article.category}
        </span>
        <h3 className="font-bold text-lg leading-tight group-hover:underline line-clamp-3" title={article.title}>
          {article.title}
        </h3>
        {article.sourceName && (
            <p className="text-xs text-on-surface mt-2">{article.sourceName}</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedArticleCard;