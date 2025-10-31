import React, { useState, useEffect } from 'react';
import { fetchNews, fetchTrendingNews } from '../services/geminiService';
import { Article } from '../types';
import FeaturedArticleCard from './FeaturedArticleCard';
import ArticleListItem from './ArticleListItem';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';
import Weather from './Weather';
import SavedArticles from './SavedArticles';

interface HomePageProps {
  onArticleSelect: (article: Article) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onArticleSelect }) => {
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [breaking, trending] = await Promise.all([
          fetchNews(),
          fetchTrendingNews(),
        ]);
        setBreakingNews(breaking);
        setTrendingNews(trending);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching news.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllNews();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-on-primary">Breaking News</h2>
          {breakingNews.length > 0 ? (
            <div className="flex overflow-x-auto space-x-6 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4">
              {breakingNews.map((article) => (
                <FeaturedArticleCard key={article.id} article={article} onSelect={onArticleSelect} />
              ))}
            </div>
          ) : (
             <p className="text-on-surface">No breaking news available.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-on-primary">Trending on the Internet</h2>
          {trendingNews.length > 0 ? (
             <div className="space-y-6">
                {trendingNews.map((article) => (
                    <ArticleListItem key={article.id} article={article} onSelect={onArticleSelect} />
                ))}
             </div>
          ) : (
             <p className="text-on-surface">Could not load trending news from the web.</p>
          )}
        </section>
      </div>

      {/* Sidebar / Dashboard */}
      <aside className="lg:sticky lg:top-24 space-y-8 mt-12 lg:mt-0">
         <Weather />
         <SavedArticles onArticleSelect={onArticleSelect} />
      </aside>
    </div>
  );
};

export default HomePage;