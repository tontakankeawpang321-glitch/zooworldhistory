import React from 'react';
import { Layers, X, Sparkles, Check, ChevronRight } from 'lucide-react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  documentariesCount: number;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  documentariesCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#080A06]/90 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Drawer - Slide in from Right */}
      <div className="relative w-80 max-w-[85vw] bg-[#080A06] border-l border-white/15 h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#12150E]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#A3E635] text-[#080A06] flex items-center justify-center font-bold shadow-md">
              <Layers className="w-4 h-4 text-[#080A06]" />
            </div>
            <div>
              <h2 className="text-xs font-serif font-black text-white uppercase tracking-wider">หมวดหมู่ทั้งหมด</h2>
              <p className="text-[10px] text-white/50">{documentariesCount} วิดีโอสารคดี</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white bg-white/10 hover:bg-[#A3E635] hover:text-[#080A06] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2 hide-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#A3E635] text-[#080A06] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                    : 'text-white/80 bg-[#12150E] hover:bg-[#161A12] border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {cat === 'ทั้งหมด' ? (
                    <Sparkles className={`w-4 h-4 ${isSelected ? 'text-[#080A06]' : 'text-[#A3E635]'}`} />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#080A06]' : 'bg-[#A3E635]'}`} />
                  )}
                  <span>{cat}</span>
                </div>
                {isSelected ? <Check className="w-4 h-4 text-[#080A06]" /> : <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#12150E] text-center">
          <a
            href="https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#A3E635] hover:underline flex items-center justify-center gap-1 font-bold uppercase tracking-wider"
          >
            ZOOWORLD MOBILE
          </a>
        </div>

      </div>
    </div>
  );
};

