import React from 'react';
import { X, Heart, Play, Trash2 } from 'lucide-react';
import { Documentary } from '../types';
import { VideoCard } from './VideoCard';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteDocumentaries: Documentary[];
  onPlay: (doc: Documentary) => void;
  onToggleFavorite: (e: React.MouseEvent, doc: Documentary) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteDocumentaries,
  onPlay,
  onToggleFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0B09]/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-6xl bg-[#0A0B09] sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1A1C18] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9BBF73]/10 border border-[#9BBF73]/30 flex items-center justify-center text-[#9BBF73]">
              <Heart className="w-5 h-5 fill-[#9BBF73]" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-white uppercase tracking-wider">
                รายการวิดีโอโปรดของคุณ
              </h2>
              <p className="text-[11px] text-[#E0E2DB]/50">
                บันทึกไว้ทั้งหมด {favoriteDocumentaries.length} รายการ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-[#0A0B09] hide-scrollbar">
          {favoriteDocumentaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#1A1C18] border border-white/10 flex items-center justify-center text-white/30 mb-4">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-2">
                ยังไม่มีวิดีโอในรายการโปรด
              </h3>
              <p className="text-xs text-[#E0E2DB]/60 max-w-sm mb-6 font-light">
                กดไอคอนหัวใจที่การ์ดวิดีโอที่คุณชื่นชอบ เพื่อบันทึกไว้รับชมย้อนหลังได้สะดวกทุกเวลา
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-[#9BBF73] text-[#0A0B09] font-extrabold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg cursor-pointer"
              >
                สำรวจวิดีโอสารคดี
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteDocumentaries.map((doc) => (
                <VideoCard
                  key={doc.id}
                  documentary={doc}
                  onPlay={onPlay}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
