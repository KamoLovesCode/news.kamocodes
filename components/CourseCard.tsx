import React from 'react';
import { Course } from '../types';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('400x300');
  };

  return (
    <div
      onClick={() => onSelect(course)}
      className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:shadow-none dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer group"
    >
      <div className="w-full h-40 overflow-hidden bg-gray-200 dark:bg-zinc-800">
        <img
          src={course.imageUrl}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:underline leading-tight line-clamp-2 h-14">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {course.instructor}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {course.duration}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
