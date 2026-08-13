import React from 'react';
import { Documentary } from '../types';

interface VideoCardProps {
  documentary: Documentary;
  onPlay: (doc: Documentary) => void;
  isFavorite: boolean;
  onToggleFavorite?: (e: React.MouseEvent, doc: Documentary) => void;
  isSlider?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  documentary,
  onPlay,
  isFavorite,
  isSlider = false,
}) => {
  const wrapperClass = isSlider
    ? 'flex-none w-[85vw] sm:w-[320px] md:w-[400px] lg:w-[480px] snap-start relative aspect-video cursor-pointer group overflow-hidden bg-gray-900 border-r border-black'
    : 'w-full relative aspect-video cursor-pointer group overflow-hidden bg-gray-900 border border-black';

  return (
    <div
      onClick={() => onPlay(documentary)}
      className={wrapperClass}
    >
      {/* Heart Favorite Badge if favorited */}
      {isFavorite && (
        <div className="absolute top-2 left-2 z-40 text-emerald-500 drop-shadow-md">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      )}

      {/* Thumbnail Image */}
      <img
        src={documentary.thumbnail}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400';
        }}
        alt={documentary.title}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-10"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-20 pointer-events-none" />

      {/* Center Play Button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-white ml-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>

      {/* Title & Description at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 drop-shadow-md line-clamp-1">
          {documentary.title}
        </h3>
        <p className="text-gray-300 text-[10px] sm:text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {documentary.description}
        </p>
      </div>
    </div>
  );
};



