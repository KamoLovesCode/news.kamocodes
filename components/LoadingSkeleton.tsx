import React from 'react';

export const FeaturedCardSkeleton: React.FC = () => (
  <div className="w-64 sm:w-72 h-80 sm:h-96 rounded-2xl shimmer-bg shrink-0"></div>
);

export const ListItemSkeleton: React.FC = () => (
    <div className="flex items-center space-x-4">
        <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-lg shimmer-bg shrink-0"></div>
        <div className="flex-1 space-y-3">
            <div className="h-4 shimmer-bg rounded w-1/4"></div>
            <div className="h-5 shimmer-bg rounded w-full"></div>
            <div className="h-5 shimmer-bg rounded w-3/4"></div>
        </div>
    </div>
);

const DashboardWidgetSkeleton: React.FC = () => (
    <div className="h-48 shimmer-bg rounded-xl"></div>
);

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
      {/* Main Content Skeleton */}
      <div className="lg:col-span-2">
        {/* Breaking News Skeleton */}
        <div className="mb-12">
            <div className="h-8 shimmer-bg rounded w-1/3 mb-6"></div>
            <div className="flex overflow-x-auto space-x-6 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <FeaturedCardSkeleton key={index} />
                ))}
            </div>
        </div>

        {/* Trending News Skeleton */}
        <div>
            <div className="h-8 shimmer-bg rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <ListItemSkeleton key={index} />
                ))}
            </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="hidden lg:block space-y-8 mt-16">
        <DashboardWidgetSkeleton />
        <DashboardWidgetSkeleton />
      </div>
    </div>
  );
};

export default LoadingSkeleton;