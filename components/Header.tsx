import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Declare google object from GSI script
declare const google: any;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const signInContainerRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user && signInContainerRef.current) {
        if (typeof google !== 'undefined') {
            google.accounts.id.renderButton(
                signInContainerRef.current,
                { theme: "outline", size: "medium", type: 'standard', text: 'signin_with' }
            );
        }
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
            <h1 className="text-sm font-medium text-accent-orange uppercase tracking-widest">
              news.kamocodes.xyz
            </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-accent-orange">
                <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-surface-dark shadow-lg ring-1 ring-outline ring-opacity-5 focus:outline-none animate-fade-in-down-sm">
                  <div className="py-1">
                      <div className="px-4 py-3 border-b border-outline">
                          <p className="text-sm font-semibold text-on-primary truncate">{user.name}</p>
                          <p className="text-sm text-on-surface truncate">{user.email}</p>
                      </div>
                      <button
                          onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-on-primary hover:bg-outline"
                      >
                          Logout
                      </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
              <div ref={signInContainerRef} className="h-10 flex items-center"></div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down-sm {
            from { opacity: 0; transform: translateY(-5px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down-sm {
            animation: fade-in-down-sm 0.1s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;