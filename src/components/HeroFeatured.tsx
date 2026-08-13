import React from 'react';
import { Play, Heart, Sparkles, Flame, Film } from 'lucide-react';
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
    <div className="relative w-full max-w-md mx-auto sm:max-w-7xl px-4 pt-1 pb-6">
      <div 
        onClick={() => onPlay(documentary)}
        className="relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_20px_50px_rgba(3,6,17,0.95)] bg-[#050B1E] group cursor-pointer transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_25px_60px_rgba(6,182,212,0.35)] active:scale-[0.99]"
      >
        
        {/* Thumbnail Background */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
          <img
            src={documentary.thumbnail}
            alt={documentary.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-95 group-hover:brightness-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          
          {/* Cinema Vignette Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1E] via-[#050B1E]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B1E]/90 via-transparent to-transparent hidden sm:block" />
          
          {/* Top Floating Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Flame className="w-3.5 h-3.5 text-lime-300 fill-lime-300 animate-bounce" />
              แนะนำ • พากย์ไทย
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(documentary);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-90 cursor-pointer ${
                isFavorite
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : 'bg-[#040D0A]/80 border-emerald-500/30 text-white hover:text-emerald-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Center Glowing Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.7)] group-hover:scale-110 transition-all p-[3px]">
              <div className="w-full h-full rounded-full bg-[#040D0A] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card Details Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#061813] via-[#040D0A] to-[#020806] border-t border-emerald-500/20 flex flex-col gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-emerald-300 font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {documentary.category}
            </span>
            <span className="text-[10px] sm:text-xs text-lime-300 font-extrabold uppercase tracking-wider flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lime-950/80 border border-lime-500/30">
              <Film className="w-3 h-3 text-lime-400" /> 4K HD
            </span>
          </div>

          <h2 className="text-base sm:text-xl font-serif font-black text-white leading-snug group-hover:text-emerald-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {documentary.title}
          </h2>

          <p className="text-xs text-emerald-100/70 line-clamp-2 font-light leading-relaxed">
            {documentary.description}
          </p>

          <div className="mt-1 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              แตะเพื่อรับชม
            </span>
            <span className="text-[11px] text-white font-mono flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              [รับชมเลย]
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};


