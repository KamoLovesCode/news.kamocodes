import React, { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md z-50 flex flex-col p-4 animate-slide-in-up" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close search">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900 dark:text-white">Discover</h2>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8">News from all around the world</p>
        
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-zinc-900 border-2 border-transparent focus:border-black dark:focus:border-white focus:ring-0 text-gray-900 dark:text-white text-base sm:text-lg rounded-lg py-3 pl-12 pr-4 transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;