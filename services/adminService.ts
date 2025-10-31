import { Article, ContentBlock } from '../types';

const ADMIN_ARTICLES_KEY = 'news-kamocodes-admin-articles';

// Helper to parse content string from textarea into ContentBlock[]
const parseFullContent = (contentString: string): ContentBlock[] => {
    return contentString.split('\n').filter(line => line.trim() !== '').map(line => {
        if (line.startsWith('## ')) {
            return { type: 'subheading', content: line.substring(3).trim() };
        }
        if (line.startsWith('> ')) {
            return { type: 'quote', content: line.substring(2).trim() };
        }
        return { type: 'paragraph', content: line.trim() };
    });
};


const getAdminArticlesFromStorage = (): Article[] => {
    try {
        const saved = localStorage.getItem(ADMIN_ARTICLES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Could not read admin articles from localStorage", error);
        return [];
    }
};

export async function getArticles(): Promise<Article[]> {
  return getAdminArticlesFromStorage();
}

export async function addArticle(articleData: {
    title: string;
    summary: string;
    fullContent: string; // From textarea
    category: string;
    imageUrl: string;
    sourceUrl: string;
    sourceName: string;
}): Promise<Article> {
    const articles = getAdminArticlesFromStorage();
    const newArticle: Article = {
        id: Date.now().toString(),
        title: articleData.title,
        summary: articleData.summary,
        fullContent: parseFullContent(articleData.fullContent),
        category: articleData.category,
        imageUrl: articleData.imageUrl,
        sourceUrl: articleData.sourceUrl,
        sourceName: articleData.sourceName,
    };
    
    const updatedArticles = [...articles, newArticle];
    localStorage.setItem(ADMIN_ARTICLES_KEY, JSON.stringify(updatedArticles));
    return newArticle;
}

export async function deleteArticle(id: string): Promise<void> {
    const articles = getAdminArticlesFromStorage();
    const updatedArticles = articles.filter(a => a.id !== id);
    localStorage.setItem(ADMIN_ARTICLES_KEY, JSON.stringify(updatedArticles));
}
