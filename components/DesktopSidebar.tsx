import React from 'react';

type View = 'home' | 'admin' | 'learn' | 'chat' | 'finance' | 'weather' | 'landing' | 'articleDetail';

interface DesktopSidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavLink: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full p-3 text-left rounded-lg transition-colors duration-200
            ${isActive ? 'bg-accent-orange/10 text-accent-orange' : 'text-on-surface hover:bg-outline'}
        `}
    >
        <span className="material-symbols-outlined mr-4">{icon}</span>
        <span className="font-semibold">{label}</span>
    </button>
);

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-dark border-r border-outline h-screen sticky top-0">
        <div className="p-4 h-16 flex items-center border-b border-outline">
            <h2 className="text-sm font-medium text-accent-orange uppercase tracking-widest">
                news.kamocodes.xyz
            </h2>
        </div>
        <nav className="p-4 space-y-2 flex-1">
            <NavLink label="Home" icon="home" isActive={activeView === 'home'} onClick={() => onNavigate('home')} />
            <NavLink label="Learn" icon="school" isActive={activeView === 'learn'} onClick={() => onNavigate('learn')} />
            
            <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-on-surface/50 uppercase tracking-wider">Tools</h3>
            <NavLink label="Chat" icon="chat" isActive={activeView === 'chat'} onClick={() => onNavigate('chat')} />
            <NavLink label="Finance" icon="monitoring" isActive={activeView === 'finance'} onClick={() => onNavigate('finance')} />
            <NavLink label="Weather" icon="partly_cloudy_day" isActive={activeView === 'weather'} onClick={() => onNavigate('weather')} />
            
            <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-on-surface/50 uppercase tracking-wider">Management</h3>
            <NavLink label="Admin Panel" icon="shield_person" isActive={activeView === 'admin'} onClick={() => onNavigate('admin')} />
        </nav>
    </aside>
  );
};

export default DesktopSidebar;