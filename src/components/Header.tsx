import React from 'react';
import { Search, RefreshCw, Heart, Compass, X, SlidersHorizontal, Brain } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenQuiz: () => void;
  onGoHome: () => void;
  activeTab: ActiveTab;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading,
  favoritesCount,
  onOpenFavorites,
  onOpenCategoryDrawer,
  onOpenQuiz,
  onGoHome,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#080A06]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-md mx-auto px-4 py-3 flex flex-col gap-2.5">
        
        {/* Mobile Top Bar Row */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo Brand - ZOOWORLD */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A3E635] to-[#65A30D] flex items-center justify-center text-[#080A06] font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)] group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-[#080A06]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase font-serif text-[#A3E635] leading-none">
                ZOOWORLD
              </span>
              <span className="text-[9px] text-white/50 uppercase tracking-[0.18em] font-semibold mt-0.5">
                สารคดีสัตวโลกมือถือ
              </span>
            </div>
          </div>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quiz Game Quick Trigger */}
            <button
              onClick={onOpenQuiz}
              className="p-2 bg-[#161A12] border border-[#A3E635]/30 hover:border-[#A3E635] rounded-full text-[#A3E635] hover:bg-[#A3E635] hover:text-[#080A06] transition-all cursor-pointer shadow-md active:scale-95"
              title="เกมแบบทดสอบ"
            >
              <Brain className="w-4 h-4" />
            </button>

            {/* Category Drawer Trigger Button */}
            <button
              onClick={onOpenCategoryDrawer}
              className="px-2.5 py-1.5 rounded-full bg-[#161A12] border border-white/15 text-white text-xs font-bold flex items-center gap-1 hover:border-[#A3E635] hover:text-[#A3E635] transition-all cursor-pointer shadow-md active:scale-95"
              title="เปิดหมวดหมู่"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>หมวดหมู่</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-[#161A12] border border-white/10 hover:border-[#A3E635]/50 rounded-full text-white/70 hover:text-[#A3E635] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="รีเฟรช"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#A3E635]' : ''}`} />
            </button>

            {/* Favorites Badge Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 bg-[#161A12] border border-white/10 hover:border-[#A3E635]/50 rounded-full text-white/70 hover:text-[#A3E635] transition-all active:scale-95 cursor-pointer"
              title="รายการวิดีโอโปรด"
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-[#A3E635] fill-[#A3E635]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A3E635] text-[#080A06] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Integrated Mobile Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาวิดีโอสารคดี, สัตว์ป่า, สัตว์ทะเล..."
            className="w-full bg-[#161A12] text-[#F1F3ED] placeholder-white/35 text-xs pl-9 pr-8 py-2 rounded-full border border-white/10 focus:outline-none focus:border-[#A3E635] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};


