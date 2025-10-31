import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { getArticles, addArticle, deleteArticle } from '../services/adminService';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [fullContent, setFullContent] = useState('');
    const [category, setCategory] = useState('Technology');
    const [imageUrl, setImageUrl] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceName, setSourceName] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadArticles();
        }
    }, [isAuthenticated]);

    const loadArticles = async () => {
        setIsLoading(true);
        setError('');
        try {
            const fetchedArticles = await getArticles();
            setArticles(fetchedArticles);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load articles.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a secure authentication call.
        // For this demo, we'll use a simple hardcoded password.
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password.');
        }
    };
    
    const resetForm = () => {
        setTitle('');
        setSummary('');
        setFullContent('');
        setCategory('Technology');
        setImageUrl('');
        setSourceUrl('');
        setSourceName('');
    };

    const handleAddArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !summary || !fullContent || !category || !imageUrl || !sourceUrl || !sourceName) {
            alert("Please fill out all fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            const newArticleData = {
                title, summary, fullContent, category, imageUrl, sourceUrl, sourceName
            };
            await addArticle(newArticleData);
            resetForm();
            await loadArticles(); // Refresh the list
        } catch (err) {
             alert(err instanceof Error ? err.message : 'Failed to add article.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteArticle = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteArticle(id);
                await loadArticles(); // Refresh the list
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete article.');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md border dark:border-zinc-800">
                    <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-gray-100 dark:bg-zinc-800 border-2 border-transparent focus:border-black dark:focus:border-white focus:ring-0 rounded-lg p-3 mb-4"
                        />
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-8 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                     <div className="flex items-center space-x-4">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline">View Site</a>
                        <button onClick={() => setIsAuthenticated(false)} className="font-semibold text-red-600 dark:text-red-500 hover:underline">Logout</button>
                    </div>
                </div>

                {/* Add Article Form */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
                    <form onSubmit={handleAddArticle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3">
                            <option>Technology</option>
                            <option>World News</option>
                            <option>Business</option>
                            <option>Sports</option>
                            <option>Science</option>
                        </select>
                        <input required placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="md:col-span-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <input required placeholder="Source Name (e.g., Reuters)" value={sourceName} onChange={e => setSourceName(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <input required placeholder="Source URL" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <textarea required placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="md:col-span-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <textarea required placeholder="Full Content. Use ## for subheadings and > for quotes. Each new line is a paragraph." value={fullContent} onChange={e => setFullContent(e.target.value)} rows={8} className="md:col-span-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-3" />
                        <div className="md:col-span-2 text-right">
                           <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-semibold rounded-lg transition-colors duration-200 bg-black text-white hover:bg-gray-800 disabled:opacity-50">
                               {isSubmitting ? 'Submitting...' : 'Add Article'}
                           </button>
                        </div>
                    </form>
                </div>

                {/* Article List */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Manage Articles</h2>
                    {isLoading ? <p>Loading articles...</p> : error ? <p className="text-red-500">{error}</p> : (
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                        <p className="font-bold">{article.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{article.category} - {new Date(parseInt(article.id)).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteArticle(article.id)} className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-500/20 rounded-md hover:bg-red-200 dark:hover:bg-red-500/30">Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;