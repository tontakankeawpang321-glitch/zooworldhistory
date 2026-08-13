import React from 'react';
import { Play, Heart, Sparkles, Flame } from 'lucide-react';
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
    <div className="relative w-full max-w-md mx-auto px-4 pt-1 pb-4">
      <div 
        onClick={() => onPlay(documentary)}
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-[#12150E] group cursor-pointer transition-all duration-300 active:scale-[0.98]"
      >
        
        {/* Thumbnail Background */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={documentary.thumbnail}
            alt={documentary.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800';
            }}
          />
          
          {/* Mobile Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A06] via-[#080A06]/60 to-transparent" />
          
          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 bg-[#A3E635] text-[#080A06] text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3 text-[#080A06] fill-[#080A06]" />
              สารคดีมาแรงวันนี้
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(documentary);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 cursor-pointer ${
                isFavorite
                  ? 'bg-[#A3E635] border-[#A3E635] text-[#080A06]'
                  : 'bg-[#080A06]/70 border-white/15 text-white hover:text-[#A3E635]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#080A06]' : ''}`} />
            </button>
          </div>

          {/* Center Pulsing Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-[#A3E635]/90 border border-white/30 text-[#080A06] flex items-center justify-center shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-[#080A06] ml-1" />
            </div>
          </div>
        </div>

        {/* Hero Card Text Content */}
        <div className="p-4 bg-gradient-to-b from-[#12150E] to-[#080A06] border-t border-white/5 flex flex-col gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#A3E635] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#A3E635]/10 border border-[#A3E635]/20">
              {documentary.category}
            </span>
            <span className="text-[10px] text-white/50 font-medium">
              วิดีโอคุณภาพสูง HD
            </span>
          </div>

          <h2 className="text-base font-serif font-bold text-white leading-snug line-clamp-2 group-hover:text-[#A3E635] transition-colors">
            {documentary.title}
          </h2>

          <p className="text-xs text-white/60 line-clamp-2 font-light leading-relaxed">
            {documentary.description}
          </p>

          <div className="mt-1 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#A3E635] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              แตะเพื่อรับชมสารคดี
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              [แตะเพื่อเล่น]
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

