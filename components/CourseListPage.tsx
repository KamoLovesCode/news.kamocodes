import React from 'react';
import { Course, CourseCategory } from '../types';
import ViewHeader from './ViewHeader';
import CourseCard from './CourseCard';

interface CourseListPageProps {
  category: CourseCategory;
  courses: Course[];
  onCourseSelect: (course: Course) => void;
  onBack: () => void;
}

const CourseListPage: React.FC<CourseListPageProps> = ({ category, courses, onCourseSelect, onBack }) => {
  const categoryCourses = courses.filter(c => c.categoryId === category.id);

  return (
    <div className="animate-fade-in">
      <ViewHeader title={category.name} onBack={onBack} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categoryCourses.length > 0 ? (
          categoryCourses.map(course => (
            <CourseCard key={course.id} course={course} onSelect={onCourseSelect} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
            No courses available in this category yet.
          </p>
        )}
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

export default CourseListPage;