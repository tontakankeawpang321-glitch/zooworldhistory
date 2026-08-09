import React from 'react';
import { Search, RefreshCw, Heart, Compass, X } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenKnowledge: () => void;
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
  onOpenKnowledge,
  onGoHome,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0A0B09]/90 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#9BBF73]/10 border border-[#9BBF73]/30 flex items-center justify-center text-[#9BBF73] group-hover:bg-[#9BBF73] group-hover:text-[#0A0B09] transition-all">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold tracking-tighter italic uppercase font-serif text-[#9BBF73] leading-none">
                WILDLIFE <span className="text-white font-normal not-italic text-sm sm:text-base tracking-normal">ZOOWORLD</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#E0E2DB]/50 uppercase tracking-[0.2em] font-semibold hidden sm:inline mt-0.5">
                ศูนย์รวมสารคดีสัตว์โลก
              </span>
            </div>
          </div>

          {/* Search Input Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหาสารคดี, สายพันธุ์สัตว์..."
              className="w-full bg-[#1A1C18] text-[#E0E2DB] placeholder-white/40 text-xs pl-10 pr-9 py-2 rounded-full border border-white/10 focus:outline-none focus:border-[#9BBF73] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Category Button for Mobile Header */}
            <button
              onClick={onOpenCategoryDrawer}
              className="md:hidden px-3 py-1.5 rounded-full bg-[#1A1C18] border border-white/10 text-xs text-[#E0E2DB] hover:text-[#9BBF73] hover:border-[#9BBF73]/50 transition-colors flex items-center gap-1.5"
            >
              <span>หมวดหมู่</span>
            </button>

            {/* Knowledge Explorer Button */}
            <button
              onClick={onOpenKnowledge}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#E0E2DB] hover:bg-[#9BBF73] hover:text-[#0A0B09] transition-all"
              title="คลังความรู้สัตว์โลก"
            >
              <Search className="w-3.5 h-3.5 text-[#9BBF73] group-hover:text-[#0A0B09]" />
              <span>ความรู้สัตว์โลก</span>
            </button>

            {/* Refresh Data Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73]/50 rounded-full text-white/70 hover:text-[#9BBF73] transition-all active:scale-95 disabled:opacity-50"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#9BBF73]' : ''}`} />
            </button>

            {/* Favorites Badge Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73]/50 rounded-full text-white/70 hover:text-[#9BBF73] transition-all active:scale-95"
              title="รายการวิดีโอโปรด"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[#9BBF73] fill-[#9BBF73]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9BBF73] text-[#0A0B09] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header logo on small screens */}
        <div className="mt-2 md:hidden relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาวิดีโอสารคดีสัตว์ป่า..."
            className="w-full bg-[#1A1C18] text-[#E0E2DB] placeholder-white/40 text-xs pl-9 pr-8 py-2 rounded-full border border-white/10 focus:outline-none focus:border-[#9BBF73]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
