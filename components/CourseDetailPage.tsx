import React from 'react';
import { Course } from '../types';
import ViewHeader from './ViewHeader';
import { createSolidColorPlaceholderUrl } from '../services/geminiService';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, onBack }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = createSolidColorPlaceholderUrl('800x400');
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <ViewHeader title="Course Details" onBack={onBack} />
        
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
            <div className="w-full h-64 bg-gray-200 dark:bg-zinc-800">
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" onError={handleImageError} />
            </div>
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{course.title}</h1>
                <p className="text-md text-gray-600 dark:text-gray-400 mb-4">An online course by {course.instructor}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-300 mb-6">
                    <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{course.duration}</span>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">About this course</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{course.description}</p>
            </div>
        </div>

        <div className="mt-8 text-center bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Content Coming Soon!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Lessons, discussions, and resources for this course will be available here.</p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
