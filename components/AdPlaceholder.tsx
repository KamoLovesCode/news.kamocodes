import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className, width = '100%', height = '250px', label = 'Advertisement' }) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      style={style}
      className={`flex items-center justify-center bg-gray-100 dark:bg-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-center p-4 ${className}`}
    >
      <span className="text-gray-400 dark:text-zinc-500 font-semibold">{label}</span>
    </div>
  );
};

export default AdPlaceholder;
