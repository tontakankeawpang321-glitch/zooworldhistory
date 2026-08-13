import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (documentaries.length === 0) return null;

  return (
    <section className="mb-6 relative max-w-md mx-auto px-4">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-2.5 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full bg-[#A3E635]" />
          <h2 className="text-sm font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <span>{categoryTitle}</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20">
              {documentaries.length}
            </span>
          </h2>
        </div>

        {/* Small Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleScroll('left')}
            className="p-1 rounded-full bg-[#161A12] border border-white/10 text-white/70 hover:text-[#A3E635] active:scale-90 cursor-pointer"
            title="เลื่อนซ้าย"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1 rounded-full bg-[#161A12] border border-white/10 text-white/70 hover:text-[#A3E635] active:scale-90 cursor-pointer"
            title="เลื่อนขวา"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 hide-scrollbar py-1 touch-pan-x"
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

