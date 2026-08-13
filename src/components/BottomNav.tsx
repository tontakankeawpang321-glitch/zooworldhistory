import React from 'react';
import { Home, Layers, Heart, Brain } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  onGoHome: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenFavorites: () => void;
  onOpenQuiz: () => void;
  favoritesCount: number;
  activeTab: ActiveTab;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onGoHome,
  onOpenCategoryDrawer,
  onOpenFavorites,
  onOpenQuiz,
  favoritesCount,
  activeTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080A06]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-90 cursor-pointer ${
            activeTab === 'home' ? 'text-[#A3E635] font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-wider leading-none">หน้าแรก</span>
        </button>

        {/* Categories Drawer */}
        <button
          onClick={onOpenCategoryDrawer}
          className="flex flex-col items-center gap-1 text-white/40 hover:text-[#A3E635] transition-all py-1 px-3 rounded-xl active:scale-90 cursor-pointer"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-wider leading-none">หมวดหมู่</span>
        </button>

        {/* Quiz Game */}
        <button
          onClick={onOpenQuiz}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-90 cursor-pointer ${
            activeTab === 'quiz' ? 'text-[#A3E635] font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-wider leading-none">เกมทดสอบ</span>
        </button>

        {/* Favorites */}
        <button
          onClick={onOpenFavorites}
          className={`relative flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-90 cursor-pointer ${
            activeTab === 'favorites' ? 'text-[#A3E635] font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#A3E635] text-[#A3E635]' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#A3E635] text-[#080A06] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider leading-none">รายการโปรด</span>
        </button>

      </div>
    </nav>
  );
};


