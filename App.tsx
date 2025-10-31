import React, { useState, useEffect } from 'react';
import { Article } from './types';
import Header from './components/Header';
import ArticleDetail from './components/ArticleDetail';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import LearnPage from './components/LearnPage';
import ChatPage from './components/ChatPage';
import FinancePage from './components/FinancePage';
import WeatherPage from './components/WeatherPage';
import DesktopSidebar from './components/DesktopSidebar';
import LandingPage from './components/LandingPage';
import BottomNavbar from './components/BottomNavbar';
import { useAuth } from './contexts/AuthContext';

type View = 'home' | 'articleDetail' | 'admin' | 'learn' | 'chat' | 'finance' | 'weather' | 'landing';

const App: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [previousView, setPreviousView] = useState<View>('landing');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    // If the user logs in while on the landing page, automatically navigate to home.
    if (user && view === 'landing') {
      setView('home');
    }
  }, [user, view]);


  const handleArticleSelect = (article: Article) => {
    setPreviousView(view);
    setSelectedArticle(article);
    setView('articleDetail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setView(previousView);
  };

  const handleNavigate = (targetView: View) => {
    // If navigating away from an article detail, clear the article
    if (view === 'articleDetail') {
      setSelectedArticle(null);
    }
    setView(targetView);
    window.scrollTo(0, 0);
  }

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'articleDetail':
        return selectedArticle ? <ArticleDetail article={selectedArticle} onBack={handleBack} /> : <HomePage onArticleSelect={handleArticleSelect} />;
      case 'home':
        return <HomePage onArticleSelect={handleArticleSelect} />;
      case 'admin':
        return <AdminPage />;
      case 'learn':
        return <LearnPage />;
      case 'chat':
        return <ChatPage />;
      case 'finance':
        return <FinancePage onArticleSelect={handleArticleSelect} />;
      case 'weather':
        return <WeatherPage />;
      default:
        return <HomePage onArticleSelect={handleArticleSelect} />;
    }
  };
  
  // Landing and Admin pages have their own full-screen layouts without the main nav components
  if (view === 'landing' || view === 'admin') {
    return <div className="min-h-screen bg-primary-dark text-on-primary">{renderView()}</div>;
  }

  // Main application layout for all other views
  return (
    <div className="min-h-screen bg-primary-dark text-on-primary lg:flex">
      <DesktopSidebar activeView={view} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className={`sticky top-0 z-30 bg-primary-dark/80 backdrop-blur-lg lg:border-b border-outline shadow-sm ${view === 'articleDetail' ? 'hidden' : ''}`}>
          <Header />
        </div>
        
        {/* ArticleDetail has its own full-width layout, others are constrained */}
        {view === 'articleDetail' ? (
          <div className="flex-1">{renderView()}</div>
        ) : (
           <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 flex-1">
             {renderView()}
           </main>
        )}
      </div>
      
      <BottomNavbar activeView={view} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;