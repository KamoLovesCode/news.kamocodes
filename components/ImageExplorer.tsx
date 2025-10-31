import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

const ImageExplorer: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!imageUrl || !prompt) return;

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imageUrl;

        // Sanitize the prompt to create a valid filename
        const sanitizedPrompt = prompt
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '_')        // Replace spaces with underscores
            .substring(0, 50);           // Truncate

        link.download = `${sanitizedPrompt || 'ai-generated-image'}.png`;

        // Append to the document, click, and then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleGenerate();
    };

    return (
        <div className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="e.g., A robot riding a skateboard in Cape Town"
                    className="flex-grow bg-white dark:bg-zinc-800 border-2 border-gray-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-0 text-gray-900 dark:text-white rounded-lg py-2 px-4 transition-colors"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="px-6 py-2 font-semibold rounded-lg transition-colors duration-200 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </form>

            {error && (
                <div className="text-center text-red-500 mb-4">{error}</div>
            )}
            
            <div className="w-full aspect-video bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                {isLoading && (
                    <div className="animate-pulse flex flex-col items-center text-gray-500 dark:text-gray-400">
                         <svg className="w-10 h-10 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
                        </svg>
                        <span>AI is creating...</span>
                    </div>
                )}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
                )}
                {!imageUrl && !isLoading && (
                     <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p>Your generated image will appear here.</p>
                     </div>
                )}
            </div>

            {imageUrl && !isLoading && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center sm:text-left">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Prompt:</span> {prompt}
                    </p>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700"
                    >
                        <span className="material-symbols-outlined mr-2 text-base">download</span>
                        Download
                    </button>
                </div>
            )}
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

export default ImageExplorer;