import React from 'react';
import { EngagingArticle } from '../types';
import AdPlaceholder from './AdPlaceholder';

interface TrendingSidebarProps {
  trendingArticles: EngagingArticle[];
  onArticleSelect: (article: EngagingArticle) => void;
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ trendingArticles, onArticleSelect }) => {
  if (trendingArticles.length === 0) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Trending Topics</h2>
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-zinc-900 text-center text-gray-500 dark:text-gray-400">
                    No trending articles available right now.
                </div>
            </div>
             <AdPlaceholder height="280px" label="Vertical Ad"/>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Trending Topics</h2>
        <div className="space-y-3">
          {trendingArticles.map((article, index) => (
            <div
              key={article.id}
              onClick={() => onArticleSelect(article)}
              className="group cursor-pointer p-4 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <span className="text-xl font-bold text-gray-400 dark:text-zinc-600 pt-0.5">{index + 1}</span>
                <div>
                    <h3 className="font-bold text-md text-gray-900 dark:text-white group-hover:underline leading-tight">
                        {article.shortHeadline}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase">{article.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdPlaceholder height="280px" label="Vertical Ad"/>
    </div>
  );
};

export default TrendingSidebar;