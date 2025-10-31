import React, { useState, useEffect } from 'react';
import { ContentBlock, Article } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';
import { saveArticle, removeArticle, isArticleSaved } from '../services/offlineService';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
        const saved = await isArticleSaved(article.id);
        setIsSaved(saved);
    };
    checkSavedStatus();
  }, [article.id]);

  const handleToggleSave = async () => {
    // Optimistic UI update
    const newSavedStatus = !isSaved;
    setIsSaved(newSavedStatus);
    
    try {
      if (newSavedStatus) {
        await saveArticle(article);
      } else {
        await removeArticle(article.id);
      }
    } catch (error) {
      console.error("Failed to update saved status:", error);
      // Revert UI on error
      setIsSaved(!newSavedStatus);
      alert("Could not update save status. Please try again.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('1200x800');
  };
  
  const formatDate = (timestamp: string) => {
    const dateNum = parseInt(timestamp, 10);
    if (isNaN(dateNum)) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });
      }
      return null;
    }
    const date = new Date(dateNum);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formattedDate = formatDate(article.id);

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'subheading':
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-on-primary mt-8 mb-4">
            {block.content}
          </h2>
        );
      case 'quote':
        return (
          <blockquote key={index} className="my-6 pl-4 border-l-4 border-accent-orange">
            <p className="text-lg md:text-xl italic text-on-surface">
              "{block.content}"
            </p>
          </blockquote>
        );
      case 'paragraph':
      default:
        return (
          <p key={index} className="text-lg text-on-surface mb-6 leading-relaxed">
            {block.content}
          </p>
        );
    }
  };

  return (
    <div className="w-full bg-primary-dark pb-24">
      {/* Sticky Header */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
      >
        <div className="bg-surface-dark/80 backdrop-blur-lg border-b border-outline">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-dark text-on-primary hover:bg-opacity-75 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-sm font-bold text-on-primary truncate px-2 flex-1 text-center">
              {article.title}
            </h1>
            <button
              onClick={handleToggleSave}
              aria-label={isSaved ? "Unsave article" : "Save article"}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-dark text-on-primary hover:bg-opacity-75 transition-colors shrink-0"
            >
              {isSaved ? (
                <span className="material-symbols-outlined text-accent-orange" style={{fontVariationSettings: "'FILL' 1, 'wght' 400"}}>bookmark</span>
              ) : (
                <span className="material-symbols-outlined">bookmark</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image and Header */}
      <header className="w-full h-[60vh] sm:h-[70vh] relative text-on-primary">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-dark/50 backdrop-blur-sm text-on-primary hover:bg-surface-dark/80 transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
                onClick={handleToggleSave}
                aria-label={isSaved ? "Unsave article" : "Save article"}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-dark/50 backdrop-blur-sm text-on-primary hover:bg-surface-dark/80 transition-colors"
            >
                 {isSaved ? (
                    <span className="material-symbols-outlined text-accent-orange" style={{fontVariationSettings: "'FILL' 1, 'wght' 400"}}>bookmark</span>
                    ) : (
                    <span className="material-symbols-outlined">bookmark</span>
                )}
            </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <span className="inline-block bg-accent-orange text-primary-dark text-xs font-bold px-3 py-1 rounded-full mb-4">{article.category}</span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight shadow-text">
                    {article.title}
                </h1>
                <div className="flex items-center text-sm md:text-base text-on-surface">
                  {article.sourceName && (
                      <span>By {article.sourceName}</span>
                  )}
                  {article.sourceName && formattedDate && (
                    <span className="mx-2">&middot;</span>
                  )}
                  {formattedDate && (
                    <span>{formattedDate}</span>
                  )}
                </div>
            </div>
        </div>
      </header>
      
      {/* Article Content */}
      <div className="relative p-6 sm:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Summary */}
          <p className="text-xl text-on-surface italic mb-10">
            {article.summary}
          </p>

          {/* Body */}
          <div className="prose-lg max-w-none">
            {article.fullContent.map(renderContentBlock)}
          </div>
          
          {article.sourceUrl && article.sourceUrl !== '#' && (
            <div className="mt-12 border-t border-outline pt-8 text-center">
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-accent-orange text-primary-dark font-semibold px-8 py-3 rounded-lg hover:bg-accent-orange-dark transition-opacity"
              >
                Read on {article.sourceName}
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
            </div>
          )}

          {article.groundingUrls && article.groundingUrls.length > 0 && (
            <div className="mt-12 border-t border-outline pt-8">
                <h3 className="text-xl font-bold text-on-primary mb-4">Google Search Sources</h3>
                <ul className="list-disc list-inside space-y-2 text-on-surface">
                    {article.groundingUrls.map((url, index) => (
                        <li key={index}>
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-accent-orange hover:underline break-all"
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
      <style>{`
        .shadow-text {
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .prose-lg p {
            font-size: 1.125rem;
            line-height: 1.75;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;