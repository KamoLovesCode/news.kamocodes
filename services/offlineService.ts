import { Article } from '../types';

const SAVED_ARTICLES_KEY = 'news-kamocodes-saved-articles';

const getSavedArticlesFromStorage = (): Article[] => {
    try {
        const saved = localStorage.getItem(SAVED_ARTICLES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Could not read saved articles from localStorage", error);
        return [];
    }
};

export async function getSavedArticles(): Promise<Article[]> {
  return getSavedArticlesFromStorage();
}

export async function saveArticle(article: Article): Promise<void> {
    const articles = getSavedArticlesFromStorage();
    if (!articles.find(a => a.id === article.id)) {
        const updatedArticles = [...articles, article];
        localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(updatedArticles));
    }
}

export async function removeArticle(articleId: string): Promise<void> {
    const articles = getSavedArticlesFromStorage();
    const updatedArticles = articles.filter(a => a.id !== articleId);
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(updatedArticles));
}

export async function isArticleSaved(articleId: string): Promise<boolean> {
    const articles = getSavedArticlesFromStorage();
    return articles.some(a => a.id === articleId);
}
