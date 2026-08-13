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
    ? 'w-[78vw] max-w-[280px] shrink-0 snap-start'
    : 'w-full';

  return (
    <div
      onClick={() => onPlay(documentary)}
      className={`group relative rounded-xl overflow-hidden bg-[#12150E] border border-white/10 hover:border-[#A3E635]/60 transition-all duration-300 cursor-pointer flex flex-col shadow-lg active:scale-[0.98] ${cardWidthClass}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#080A06]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A06] via-transparent to-transparent opacity-85" />

        {/* Category Pill Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 rounded bg-[#080A06]/90 backdrop-blur-md text-[#A3E635] font-bold text-[9px] uppercase tracking-wider border border-white/10">
            {documentary.category}
          </span>
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, documentary);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
            isFavorite
              ? 'bg-[#A3E635] border border-[#A3E635] text-[#080A06] shadow-md'
              : 'bg-[#080A06]/70 hover:bg-[#080A06] border border-white/15 text-white hover:text-[#A3E635]'
          }`}
          title={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#080A06]' : ''}`}
          />
        </button>

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-[#A3E635] text-[#080A06] flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-110 transition-all">
            <Play className="w-4 h-4 fill-[#080A06] ml-0.5" />
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-[#12150E]">
        <div>
          <h3 className="text-xs font-serif font-bold text-[#F1F3ED] leading-snug line-clamp-2 group-hover:text-[#A3E635] transition-colors">
            {documentary.title}
          </h3>
          {documentary.description && (
            <p className="text-[10px] text-white/50 line-clamp-2 mt-1 leading-relaxed font-light">
              {documentary.description}
            </p>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-medium">
          <span className="text-[#A3E635] flex items-center gap-1 uppercase tracking-wider font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
            WILDLIFE
          </span>
          <span className="text-[#A3E635] font-bold text-[10px] uppercase tracking-wider">
            เปิดรับชมวิดีโอ &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

