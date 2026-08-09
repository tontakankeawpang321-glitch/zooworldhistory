import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Documentary } from '../types';
import { VideoCard } from './VideoCard';

interface VideoSliderSectionProps {
  categoryTitle: string;
  documentaries: Documentary[];
  onPlay: (doc: Documentary) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, doc: Documentary) => void;
}

export const VideoSliderSection: React.FC<VideoSliderSectionProps> = ({
  categoryTitle,
  documentaries,
  onPlay,
  favorites,
  onToggleFavorite,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (documentaries.length === 0) return null;

  return (
    <section className="mb-10 relative group max-w-7xl mx-auto px-4 sm:px-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-[#9BBF73]" />
          <h2 className="text-lg sm:text-2xl font-serif text-white tracking-tight flex items-center gap-2">
            <span>{categoryTitle}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9BBF73]/10 text-[#9BBF73] border border-[#9BBF73]/30">
              {documentaries.length}
            </span>
          </h2>
        </div>

        {/* Desktop Left/Right Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-full bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73] text-white/70 hover:text-[#9BBF73] transition-all active:scale-90 cursor-pointer"
            title="เลื่อนซ้าย"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-full bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73] text-white/70 hover:text-[#9BBF73] transition-all active:scale-90 cursor-pointer"
            title="เลื่อนขวา"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-5 hide-scrollbar py-2 touch-pan-x"
      >
        {documentaries.map((doc) => (
          <VideoCard
            key={doc.id}
            documentary={doc}
            onPlay={onPlay}
            isFavorite={favorites.includes(doc.id)}
            onToggleFavorite={onToggleFavorite}
            isSlider={true}
          />
        ))}
      </div>
    </section>
  );
};
