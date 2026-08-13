import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  onGoHome: () => void;
  onOpenFavorites: () => void;
  onOpenQuiz: () => void;
  activeTab?: ActiveTab;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onGoHome,
  onOpenFavorites,
  onOpenQuiz,
  activeTab = 'home',
}) => {
  return (
    <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-xl border-t border-gray-800 z-40 flex justify-around py-2.5 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <button 
        onClick={onGoHome} 
        className={`flex flex-col items-center gap-1 transition-colors flex-1 cursor-pointer ${
          activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-gray-400 hover:text-emerald-400'
        }`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span className="text-[10px] sm:text-xs">หน้าแรก</span>
      </button>

      <button 
        onClick={onOpenFavorites} 
        className={`flex flex-col items-center gap-1 transition-colors flex-1 cursor-pointer ${
          activeTab === 'favorites' ? 'text-emerald-400 font-bold' : 'text-gray-400 hover:text-emerald-400'
        }`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <span className="text-[10px] sm:text-xs">รายการโปรด</span>
      </button>

      <button 
        onClick={onOpenQuiz} 
        className={`flex flex-col items-center gap-1 transition-colors flex-1 cursor-pointer ${
          activeTab === 'quiz' ? 'text-emerald-400 font-bold' : 'text-gray-400 hover:text-emerald-400'
        }`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">เกมทาย</span>
      </button>
    </nav>
  );
};
