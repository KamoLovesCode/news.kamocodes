import React, { useState, useEffect } from 'react';
import { fetchFinancialNews, fetchMarketData } from '../services/geminiService';
import { Article, StockData } from '../types';
import ErrorMessage from './ErrorMessage';
import ArticleListItem from './ArticleListItem';

const FinancePage: React.FC<{onArticleSelect: (article: Article) => void}> = ({ onArticleSelect }) => {
    const [marketData, setMarketData] = useState<StockData[]>([]);
    const [news, setNews] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFinanceData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [market, newsData] = await Promise.all([
                    fetchMarketData(),
                    fetchFinancialNews()
                ]);
                setMarketData(market);
                setNews(newsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load financial data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadFinanceData();
    }, []);

    const MarketCard: React.FC<{ item: StockData }> = ({ item }) => {
        const isPositive = !item.change.startsWith('-');
        return (
            <div className="bg-surface-dark p-4 rounded-lg border border-outline">
                <p className="text-sm text-on-surface truncate">{item.name}</p>
                <h3 className="text-xl font-bold text-on-primary">{item.price}</h3>
                <p className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change} ({item.changePercent})
                </p>
            </div>
        );
    };

    const MarketSkeleton = () => <div className="h-24 bg-surface-dark rounded-lg shimmer-bg"></div>;
    const NewsSkeleton = () => (
        <div className="flex items-center space-x-4 p-2">
            <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-lg shimmer-bg shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="h-4 shimmer-bg rounded w-1/4"></div>
                <div className="h-5 shimmer-bg rounded w-full"></div>
                <div className="h-5 shimmer-bg rounded w-3/4"></div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-on-primary mb-8">Finance</h1>
            {error && <ErrorMessage message={error} />}
            
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-on-primary">Market Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isLoading ?
                        Array.from({ length: 4 }).map((_, i) => <MarketSkeleton key={i} />) :
                        marketData.map(item => <MarketCard key={item.symbol} item={item} />)
                    }
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-on-primary">Top Stories</h2>
                <div className="space-y-6">
                    {isLoading ?
                        Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />) :
                        news.map(article => <ArticleListItem key={article.id} article={article} onSelect={onArticleSelect} />)
                    }
                </div>
            </section>
        </div>
    );
};

export default FinancePage;
