import React from 'react';
import { Home, Layers, Heart, BookOpen, Search } from 'lucide-react';

interface BottomNavProps {
  onGoHome: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenFavorites: () => void;
  onOpenKnowledge: () => void;
  favoritesCount: number;
  activeTab: 'home' | 'favorites' | 'knowledge';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onGoHome,
  onOpenCategoryDrawer,
  onOpenFavorites,
  onOpenKnowledge,
  favoritesCount,
  activeTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0B09]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl py-2 px-3 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 cursor-pointer ${
            activeTab === 'home' ? 'text-[#9BBF73] font-bold' : 'text-white/50 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">หน้าแรก</span>
        </button>

        {/* Categories Drawer */}
        <button
          onClick={onOpenCategoryDrawer}
          className="flex flex-col items-center gap-1 text-white/50 hover:text-[#9BBF73] transition-all py-1 px-3 rounded-xl active:scale-95 cursor-pointer"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">หมวดหมู่</span>
        </button>

        {/* Knowledge Base */}
        <button
          onClick={onOpenKnowledge}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 cursor-pointer ${
            activeTab === 'knowledge' ? 'text-[#9BBF73] font-bold' : 'text-white/50 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">คลังความรู้</span>
        </button>

        {/* Favorites */}
        <button
          onClick={onOpenFavorites}
          className={`relative flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 cursor-pointer ${
            activeTab === 'favorites' ? 'text-[#9BBF73] font-bold' : 'text-white/50 hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#9BBF73] text-[#9BBF73]' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#9BBF73] text-[#0A0B09] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">รายการโปรด</span>
        </button>

      </div>
    </nav>
  );
};
