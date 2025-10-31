import React, { useRef, useState, useEffect } from 'react';
import { Article, EngagingArticle } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface ArticleCardProps {
  article: Article | EngagingArticle;
  onSelect: (article: Article | EngagingArticle) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (summaryRef.current) {
      if (summaryRef.current.scrollHeight > summaryRef.current.clientHeight) {
        setIsTruncated(true);
      }
    }
  }, [article.summary]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('400x300');
  };

  const displayHeadline = 'shortHeadline' in article ? (article as EngagingArticle).shortHeadline : article.title;

  return (
    <div
      onClick={() => onSelect(article)}
      className="bg-surface-dark rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-outline/50 hover:border-outline"
    >
      <div className="w-full h-40 sm:h-48 overflow-hidden bg-primary-dark">
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-on-surface uppercase">{article.category}</span>
        <h3 className="font-bold text-base sm:text-lg mt-1 h-14 text-on-primary group-hover:underline leading-tight line-clamp-2" title={article.title}>
          {displayHeadline}
        </h3>
        <p ref={summaryRef} className="text-sm text-on-surface mt-2 h-16 line-clamp-3">
          {article.summary}
        </p>
        {isTruncated && (
          <span className="text-sm font-semibold text-accent-orange mt-1 inline-block">
            Read More
          </span>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;