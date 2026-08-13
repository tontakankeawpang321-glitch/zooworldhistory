import React from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenDrawer: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenDrawer,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex items-center gap-2 px-4 py-2 overflow-x-auto hide-scrollbar touch-pan-x">
      {/* Category drawer trigger pill */}
      <button
        onClick={onOpenDrawer}
        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#A3E635] text-[#080A06] border border-[#A3E635] transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(163,230,53,0.25)] cursor-pointer active:scale-95"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>ดูทั้งหมด</span>
      </button>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 border cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-white text-[#080A06] border-white shadow-md scale-105'
                  : 'bg-[#161A12] text-[#F1F3ED]/80 border-white/10 hover:border-[#A3E635]/40 hover:text-white'
              }`}
            >
              {cat === 'ทั้งหมด' && <Sparkles className="w-3 h-3 inline mr-1 text-[#A3E635]" />}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

