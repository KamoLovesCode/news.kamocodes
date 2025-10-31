import React from 'react';
import { Article } from '../types';

interface GuideCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ article, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(article)}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group p-4 flex flex-col justify-between h-full"
    >
      <div>
        <span className="text-xs font-semibold text-gray-600 uppercase">{article.category}</span>
        <h3 className="font-bold text-md mt-1 text-gray-900 group-hover:underline leading-tight">
          {article.title}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {article.summary}
      </p>
    </div>
  );
};

export default GuideCard;
