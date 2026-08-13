import React from 'react';
import { X } from 'lucide-react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar - Slide in from Left */}
      <div className="relative w-64 bg-gray-900/95 backdrop-blur-2xl border-r border-gray-800 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
          <span className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg> 
            เลือกหมวดหมู่
          </span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 hide-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};



