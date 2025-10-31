import React from 'react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 text-left hover:shadow-lg hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 group flex flex-col"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
       <div className="mt-4 text-sm font-semibold text-black dark:text-white">
        Explore
        <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 inline-block ml-1">&rarr;</span>
      </div>
    </button>
  );
};

export default CategoryCard;
