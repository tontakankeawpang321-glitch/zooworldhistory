import React from 'react';

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div id="category-bar" className="flex overflow-x-auto hide-scrollbar gap-2 px-4 sm:px-8 mb-6 pb-2">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border border-gray-700/50 cursor-pointer ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 backdrop-blur-sm'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};



