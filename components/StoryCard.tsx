import React, { useRef, useState, useEffect } from 'react';
import { Book } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface StoryCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ book, onSelect }) => {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (summaryRef.current) {
      if (summaryRef.current.scrollHeight > summaryRef.current.clientHeight) {
        setIsTruncated(true);
      }
    }
  }, [book.summary]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('400x640');
  };

  return (
    <div
      onClick={() => onSelect(book)}
      className="w-full bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:shadow-none dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer group flex flex-col"
    >
      <div className="w-full aspect-[9/16] overflow-hidden bg-gray-200 dark:bg-zinc-800">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
       <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{book.category}</span>
        <h3 className="font-bold text-base mt-1 text-gray-900 dark:text-white group-hover:underline leading-tight line-clamp-2 flex-grow">
          {book.title}
        </h3>
        <p ref={summaryRef} className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
          {book.summary}
        </p>
        {isTruncated && (
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-500 mt-1 self-start">
                Read More
            </span>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
