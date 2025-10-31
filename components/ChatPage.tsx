import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful and friendly news assistant. Your name is Kamo. Be concise in your answers.",
            },
        });
        setChat(chatInstance);

        // Initial greeting
        setMessages([{
            role: 'model',
            text: `Hi ${user?.name.split(' ')[0] || 'there'}! I'm Kamo, your news assistant. How can I help you today?`
        }]);
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            // Add a placeholder for the streaming response
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                // Update the last message in the array with the new chunk
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            const errorMsg = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => {
                 const newMessages = [...prev];
                 // If the last message was the placeholder, replace it. Otherwise, add a new one.
                 if (newMessages[newMessages.length - 1].text === '') {
                    newMessages[newMessages.length - 1] = errorMsg;
                 } else {
                    newMessages.push(errorMsg)
                 }
                 return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const UserMessage: React.FC<{ text: string }> = ({ text }) => (
        <div className="flex justify-end mb-4">
            <div className="bg-accent-orange text-primary-dark rounded-l-xl rounded-t-xl p-3 max-w-[80%] sm:max-w-md lg:max-w-lg animate-fade-in">
                <p>{text}</p>
            </div>
        </div>
    );

    const ModelMessage: React.FC<{ text: string, isTyping: boolean }> = ({ text, isTyping }) => (
        <div className="flex justify-start mb-4">
            <div className="bg-surface-dark rounded-r-xl rounded-t-xl p-3 max-w-[80%] sm:max-w-md lg:max-w-lg border border-outline animate-fade-in">
                <p className="whitespace-pre-wrap">{text}{isTyping && <span className="blinking-cursor"></span>}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <h1 className="text-3xl font-bold text-on-primary mb-4 shrink-0">Chat with Kamo</h1>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
                {messages.map((msg, index) => {
                    const isLastMessage = index === messages.length - 1;
                    return msg.role === 'user' ? (
                        <UserMessage key={index} text={msg.text} />
                    ) : (
                        <ModelMessage key={index} text={msg.text} isTyping={isLoading && isLastMessage && msg.text === ''} />
                    )
                })}
                {isLoading && messages[messages.length-1]?.role === 'user' && <ModelMessage text="" isTyping={true} />}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-auto pt-4 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about the news..."
                        className="flex-1 bg-surface-dark border-2 border-outline focus:border-accent-orange focus:ring-0 text-on-primary rounded-lg py-3 px-4 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-12 h-12 flex items-center justify-center bg-accent-orange text-primary-dark rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
            <style>{`
                .blinking-cursor {
                    display: inline-block;
                    width: 8px;
                    height: 1em;
                    background-color: #E0E0E0;
                    animation: blink 1s step-end infinite;
                    vertical-align: bottom;
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ChatPage;