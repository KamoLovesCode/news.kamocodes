import React from 'react';
import { Book } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface StoryViewerProps {
  book: Book;
  onBack: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ book, onBack }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('800x600');
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-black pb-24 -mx-4 -mt-4 animate-fade-in">
       {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-50/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button
                onClick={onBack}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 className="text-lg font-bold text-center truncate px-4">{book.title}</h1>
            <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full h-80 md:h-96 bg-gray-200 dark:bg-zinc-800">
        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" onError={handleImageError} />
      </div>

      <div className="bg-gray-50 dark:bg-black rounded-t-3xl -mt-12 relative p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">{book.category}</span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{book.title}</h1>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
              <p className="italic text-gray-600 dark:text-gray-400">{book.summary}</p>
              {book.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
        </div>
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

export default StoryViewer;