import React from 'react';

type View = 'home' | 'learn' | 'chat' | 'finance' | 'weather' | 'articleDetail' | 'admin' | 'landing';

interface BottomNavbarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`flex flex-col items-center justify-center w-16 h-16 transition-colors duration-200 text-xs rounded-full
            ${isActive ? 'text-accent-orange' : 'text-on-surface hover:text-on-primary'}
        `}
    >
        <span 
            className="material-symbols-outlined text-2xl mb-1" 
            style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}
        >
            {icon}
        </span>
        <span>{label}</span>
    </button>
);

const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { view: 'home', label: 'Home', icon: 'home' },
    { view: 'learn', label: 'Learn', icon: 'school' },
    { view: 'chat', label: 'Chat', icon: 'chat' },
    { view: 'finance', label: 'Finance', icon: 'monitoring' },
    { view: 'weather', label: 'Weather', icon: 'partly_cloudy_day' },
  ] as const;

  return (
    <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-surface-dark/80 backdrop-blur-xl border border-outline rounded-full shadow-2xl animate-fade-in-up">
        <div className="flex justify-center items-center px-2 py-1">
            {navItems.map(item => (
                <NavItem
                    key={item.view}
                    label={item.label}
                    icon={item.icon}
                    isActive={activeView === item.view}
                    onClick={() => onNavigate(item.view)}
                />
            ))}
        </div>
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
    </nav>
  );
};

export default BottomNavbar;