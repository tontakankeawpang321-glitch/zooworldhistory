import React from 'react';
import { X, Heart } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080A06]/95 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#080A06] rounded-2xl border border-white/15 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#12150E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#080A06] flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-[#080A06]" />
            </div>
            <div>
              <h2 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                วิดีโอโปรดของคุณ
              </h2>
              <p className="text-[10px] text-white/50">
                {favoriteDocumentaries.length} วิดีโอที่บันทึก
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#080A06] bg-[#A3E635] hover:bg-white transition-all cursor-pointer font-bold"
          >
            <X className="w-4 h-4 text-[#080A06]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 flex-1 overflow-y-auto bg-[#080A06] hide-scrollbar">
          {favoriteDocumentaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-[#12150E] border border-white/10 flex items-center justify-center text-white/30 mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-serif font-bold text-white mb-1">
                ยังไม่มีวิดีโอในรายการโปรด
              </h3>
              <p className="text-[11px] text-white/50 max-w-xs mb-4 font-light">
                กดหัวใจบนวิดีโอสารคดีเพื่อบันทึกไว้ดูภายหลัง
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#A3E635] text-[#080A06] font-black text-xs uppercase tracking-wider active:scale-95 shadow-lg cursor-pointer"
              >
                สำรวจสารคดี
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

