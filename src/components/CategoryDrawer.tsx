import React from 'react';
import { Layers, X, Sparkles, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0A0B09]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-[#0A0B09] border-r border-white/10 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#1A1C18]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#9BBF73]/10 border border-[#9BBF73]/30 flex items-center justify-center text-[#9BBF73]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">หมวดหมู่สารคดี</h2>
              <p className="text-[10px] text-[#E0E2DB]/50">รวมทั้งสิ้น {documentariesCount} รายการ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#9BBF73] text-[#0A0B09] font-extrabold shadow-lg'
                    : 'text-[#E0E2DB]/80 bg-[#1A1C18]/60 hover:bg-[#1A1C18] hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {cat === 'ทั้งหมด' ? (
                    <Sparkles className="w-4 h-4 text-[#0A0B09]" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#0A0B09]' : 'bg-[#9BBF73]'}`} />
                  )}
                  <span>{cat}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0A0B09]" />}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-[#1A1C18] text-center">
          <a
            href="https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#9BBF73] hover:underline flex items-center justify-center gap-1 font-bold uppercase tracking-wider"
          >
            สนับสนุนโดย ZOOWORLD
          </a>
        </div>

      </div>
    </div>
  );
};
