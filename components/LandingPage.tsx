import React, { useRef, useEffect } from 'react';

declare const google: any;

interface LandingPageProps {
  onNavigate: (view: 'home') => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-surface-dark border border-outline rounded-xl p-8 text-center transition-all duration-300 hover:border-accent-orange hover:-translate-y-1">
        <span className="material-symbols-outlined text-5xl text-accent-orange mb-4">{icon}</span>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-on-surface text-sm">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const signInContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (signInContainerRef.current) {
            if (typeof google !== 'undefined') {
                google.accounts.id.renderButton(
                    signInContainerRef.current,
                    { theme: "outline", size: "large", type: 'standard', text: 'signin_with' }
                );
            }
        }
    }, []);

    return (
        <div className="animate-fade-in landing-page-bg">
            {/* Header */}
            <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
                <h1 className="text-xl font-semibold">news.kamocodes</h1>
                <div ref={signInContainerRef} className="h-10 flex items-center"></div>
            </header>

            {/* Hero Section */}
            <section className="text-center py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Your Daily Source of Curated News.</h1>
                    <p className="max-w-2xl mx-auto text-lg text-on-surface mb-8">
                        Stay informed with AI-powered articles, live feeds, and offline reading capabilities. All in one place.
                    </p>
                    <div className="flex justify-center items-center gap-4">
                        <button onClick={() => onNavigate('home')} className="bg-accent-orange text-primary-dark font-semibold px-8 py-3 rounded-lg hover:bg-accent-orange-dark transition-transform hover:scale-105">
                            Explore News
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon="robot_2" title="AI-Powered Articles">
                        Generate unique, up-to-date news articles on any topic using the power of generative AI and Google Search.
                    </FeatureCard>
                    <FeatureCard icon="menu_book" title="Offline Reading">
                        Save articles to your personal library and access them anytime, even without an internet connection.
                    </FeatureCard>
                    <FeatureCard icon="query_stats" title="Insights & Tools">
                        Chat with an AI assistant, get the latest financial news, and check the weather forecast.
                    </FeatureCard>
                </div>
            </section>
            <style>{`
                .landing-page-bg {
                    background-image: radial-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;