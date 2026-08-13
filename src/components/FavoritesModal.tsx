import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Documentary } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Documentary[];
  onPlay: (doc: Documentary) => void;
  onRemoveFavorite: (docId: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onPlay,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Main Modal Box */}
      <div className="relative bg-gray-900 sm:rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl mx-0 sm:mx-4 sm:border border-gray-800 h-full sm:h-[80vh] flex flex-col z-10">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            รายการโปรดของคุณ ({favorites.length})
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer" 
            aria-label="ปิด"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Favorites Content Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-gray-400">
              <svg className="w-16 h-16 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <p className="text-base font-medium">ยังไม่มีรายการโปรด</p>
              <p className="text-sm text-gray-500 mt-1">กดไอคอนหัวใจที่วิดีโอที่คุณชื่นชอบเพื่อบันทึกไว้ดูภายหลัง</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((doc) => (
                <div 
                  key={doc.id}
                  className="relative group bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col"
                  onClick={() => {
                    onPlay(doc);
                    onClose();
                  }}
                >
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img 
                      src={doc.thumbnail} 
                      alt={doc.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(doc.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer z-10"
                      title="ลบออกจากรายการโปรด"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{doc.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{doc.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};



