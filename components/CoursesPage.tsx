import React from 'react';
import { courseCategories } from '../services/courseData';
import { CourseCategory } from '../types';
import CategoryCard from './CategoryCard';

interface CoursesPageProps {
  onCategorySelect: (category: CourseCategory) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ onCategorySelect }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">Courses</h1>
        <p className="text-gray-500 dark:text-gray-400">Explore our catalog of courses to learn a new skill.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseCategories.map(category => (
          <CategoryCard
            key={category.id}
            title={category.name}
            description={category.description}
            icon={category.icon}
            onClick={() => onCategorySelect(category)}
          />
        ))}
      </div>
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

export default CoursesPage;
