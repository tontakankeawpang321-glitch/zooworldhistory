import React from 'react';
import { RefreshCw, Heart } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading,
  favoritesCount,
  onOpenFavorites,
  onGoHome,
}) => {
  return (
    <header className="bg-gradient-to-b from-black/95 to-transparent fixed top-0 w-full z-40 transition-all duration-300 pb-2 sm:pb-4">
      <div className="w-full px-4 sm:px-8 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <h1 
          className="text-xl sm:text-3xl font-bold flex items-center gap-2 drop-shadow-lg text-white cursor-pointer select-none"
          onClick={onGoHome}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 3.8l7.5 14.2H4.5L12 5.8zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/>
          </svg>
          HISTORY-<span className="text-gray-400 font-light">ZOOWORLD</span>
        </h1>
        
        {/* กล่องค้นหา */}
        <div className="relative w-full sm:w-64 md:w-80 order-3 sm:order-none mt-2 sm:mt-0">
          <svg className="w-5 h-5 absolute left-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาวิดีโอ..."
            className="w-full bg-gray-800/80 text-white px-4 py-2 pl-10 rounded-full border border-gray-700/50 focus:outline-none focus:border-emerald-500 focus:bg-gray-900 text-sm backdrop-blur-sm transition-colors shadow-inner"
          />
        </div>

        {/* กลุ่มปุ่มด้านบนขวา */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="p-2 bg-gray-800/80 border border-gray-700/50 rounded-full hover:bg-gray-700 transition-colors backdrop-blur-sm text-gray-300 hover:text-white cursor-pointer disabled:opacity-50" 
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button 
            onClick={onOpenFavorites} 
            className="relative p-2 bg-gray-800/80 border border-gray-700/50 rounded-full hover:bg-gray-700 transition-colors backdrop-blur-sm text-gray-300 hover:text-white cursor-pointer" 
            title="รายการโปรด"
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-emerald-500 fill-emerald-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};




