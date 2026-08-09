import React from 'react';
import { Play, Heart } from 'lucide-react';
import { Documentary } from '../types';

interface VideoCardProps {
  documentary: Documentary;
  onPlay: (doc: Documentary) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, doc: Documentary) => void;
  isSlider?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  documentary,
  onPlay,
  isFavorite,
  onToggleFavorite,
  isSlider = false,
}) => {
  const cardWidthClass = isSlider
    ? 'w-[75vw] sm:w-[300px] md:w-[360px] lg:w-[400px] shrink-0 snap-start'
    : 'w-full';

  return (
    <div
      onClick={() => onPlay(documentary)}
      className={`group relative rounded-xl overflow-hidden bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73] transition-all duration-300 cursor-pointer flex flex-col shadow-xl ${cardWidthClass}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0A0B09]">
        <img
          src={documentary.thumbnail}
          alt={documentary.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B09] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category Pill Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded bg-[#0A0B09]/90 backdrop-blur-md text-[#9BBF73] font-bold text-[10px] uppercase tracking-wider border border-white/10">
            {documentary.category}
          </span>
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, documentary);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
            isFavorite
              ? 'bg-[#9BBF73] border border-[#9BBF73] text-[#0A0B09] shadow-md'
              : 'bg-[#0A0B09]/70 hover:bg-[#0A0B09] border border-white/10 text-white hover:text-[#9BBF73]'
          }`}
          title={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#0A0B09]' : ''}`}
          />
        </button>

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#0A0B09] group-hover:bg-[#9BBF73] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-105 transition-all">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0A0B09] ml-0.5" />
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-[#1A1C18]">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#E0E2DB] leading-snug line-clamp-2 group-hover:text-[#9BBF73] transition-colors">
            {documentary.title}
          </h3>
          {documentary.description && (
            <p className="text-[11px] text-[#E0E2DB]/60 line-clamp-2 mt-1 leading-relaxed font-light">
              {documentary.description}
            </p>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#E0E2DB]/50 font-medium">
          <span className="text-[#9BBF73] flex items-center gap-1 uppercase tracking-wider font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9BBF73] animate-pulse" />
            WILDLIFE
          </span>
          <span className="group-hover:text-[#9BBF73] transition-colors font-bold uppercase tracking-wider">
            รับชม &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
