import React, { useRef } from 'react';
import { Sparkles, Layers } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-7xl mx-auto flex items-center gap-2 px-4 sm:px-8 py-2 overflow-x-auto hide-scrollbar touch-pan-x">
      {/* Category drawer trigger pill */}
      <button
        onClick={onOpenDrawer}
        className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-[#9BBF73] border border-white/10 hover:bg-[#9BBF73] hover:text-[#0A0B09] transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>เลือกหมวดหมู่</span>
      </button>

      {/* Category Pills */}
      <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-[#9BBF73] text-[#0A0B09] border-[#9BBF73] font-extrabold shadow-lg scale-105'
                  : 'bg-[#1A1C18] text-[#E0E2DB]/80 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {cat === 'ทั้งหมด' && <Sparkles className="w-3 h-3 inline mr-1 text-[#0A0B09]" />}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
