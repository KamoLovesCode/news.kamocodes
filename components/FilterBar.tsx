import React from 'react';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shrink-0 ${
            activeCategory === category
              ? 'bg-accent-green text-primary-dark'
              : 'bg-surface-dark text-on-surface hover:bg-outline'
          }`}
        >
          {category === 'General' ? 'All' : category}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;