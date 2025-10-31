import React, { useState } from 'react';
import { Article } from '../types';

import SavedArticlesPage from './SavedArticlesPage'; // Renamed from DashboardPage
import OfflineReadingPage from './OfflineReadingPage'; // Renamed from LibraryPage
import ArticleDetail from './ArticleDetail';


// Define the possible views within the Learn section
type View =
  | { name: 'savedArticles' } 
  | { name: 'offlineReading' } 
  | { name: 'articleDetail'; article: Article; from: View };


const LearnPage: React.FC = () => {
  const [view, setView] = useState<View>({ name: 'savedArticles' });

  const handleArticleSelect = (article: Article) => {
    setView({ name: 'articleDetail', article, from: view });
    window.scrollTo(0, 0);
  }

  // Handle back navigation within the Learn section
  const handleBack = () => {
    switch (view.name) {
      case 'articleDetail':
        setView(view.from);
        break;
      default:
        setView({ name: 'savedArticles' }); // Default back to Saved Articles
        break;
    }
  };

  const renderContent = () => {
    switch (view.name) {
      case 'savedArticles':
        return <SavedArticlesPage onArticleSelect={handleArticleSelect} />;
      case 'offlineReading':
        return <OfflineReadingPage onArticleSelect={handleArticleSelect} />;
      case 'articleDetail':
        return <ArticleDetail article={view.article} onBack={handleBack} />;
      default:
        return <SavedArticlesPage onArticleSelect={handleArticleSelect} />;
    }
  };
  
  const NavItem: React.FC<{
    label: string;
    targetView: View['name'];
    children: React.ReactNode;
  }> = ({ label, targetView, children }) => {
      const isActive = () => {
        const currentViewName = view.name;
        if (currentViewName === targetView) return true;
        
        // If viewing an article that originated from 'offlineReading', then 'offlineReading' is active.
        if (targetView === 'offlineReading' && view.name === 'articleDetail' && view.from.name === 'offlineReading') {
            return true;
        }

        return false;
      };

      return (
        <button
          onClick={() => setView({ name: targetView as any })}
          className={`flex flex-col items-center justify-center w-full p-2 transition-colors duration-200 rounded-lg ${
            isActive()
              ? 'bg-outline text-on-primary'
              : 'text-on-surface hover:bg-surface-dark'
          }`}
        >
          {children}
          <span className="text-xs mt-1 font-medium">{label}</span>
        </button>
      );
  };


  return (
    <div className="animate-fade-in">
        <div className="sticky top-16 z-20 bg-primary-dark/80 backdrop-blur-lg -mx-4 px-4 py-3 mb-6 border-b border-outline">
            <div className="grid grid-cols-2 gap-2"> 
                <NavItem label="Saved Articles" targetView="savedArticles">
                   <span className="material-symbols-outlined">bookmark</span>
                </NavItem>
                <NavItem label="Offline Reading" targetView="offlineReading">
                   <span className="material-symbols-outlined">menu_book</span>
                </NavItem>
            </div>
        </div>

        {renderContent()}

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

export default LearnPage;
