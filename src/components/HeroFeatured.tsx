import React from 'react';
import { Play, Heart, Compass, Sparkles } from 'lucide-react';
import { Documentary } from '../types';

interface HeroFeaturedProps {
  documentary: Documentary | null;
  onPlay: (doc: Documentary) => void;
  isFavorite: boolean;
  onToggleFavorite: (doc: Documentary) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  documentary,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!documentary) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-2 pb-6">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#1A1C18] group">
        
        {/* Background Image with Gradient Overlays */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] w-full overflow-hidden">
          <img
            src={documentary.thumbnail}
            alt={documentary.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-85"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          
          {/* Subtle Dark Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B09] via-[#0A0B09]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B09]/90 via-[#0A0B09]/40 to-transparent hidden sm:block" />
        </div>

        {/* Hero Content Overlays */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-10 flex flex-col justify-end gap-3 z-10 max-w-3xl">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-[#9BBF73] text-[#0A0B09] text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-[#0A0B09]" />
              สารคดีไฮไลต์ประจำวัน
            </span>
            <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-[#E0E2DB] text-[10px] font-bold uppercase tracking-wider rounded border border-white/10">
              {documentary.category}
            </span>
          </div>

          {/* Title - Editorial Serif */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif leading-[1.1] text-white tracking-tight drop-shadow-lg line-clamp-2">
            {documentary.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#E0E2DB]/80 line-clamp-2 font-light leading-relaxed drop-shadow hidden xs:block">
            {documentary.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(documentary)}
              className="px-6 sm:px-8 py-3 bg-white text-[#0A0B09] hover:bg-[#9BBF73] text-xs font-extrabold uppercase tracking-widest rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-[#0A0B09]" />
              <span>เริ่มชมสารคดี</span>
            </button>

            <button
              onClick={() => onToggleFavorite(documentary)}
              className={`p-3 rounded-full border transition-all active:scale-95 backdrop-blur-md ${
                isFavorite
                  ? 'bg-[#9BBF73] border-[#9BBF73] text-[#0A0B09]'
                  : 'bg-white/10 border-white/10 text-white hover:border-[#9BBF73]/50 hover:text-[#9BBF73]'
              }`}
              title={isFavorite ? 'ยกเลิกรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#0A0B09]' : ''}`} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
