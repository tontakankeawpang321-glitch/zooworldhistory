import React, { useRef } from 'react';
import { Documentary } from '../types';
import { VideoCard } from './VideoCard';

interface VideoSliderSectionProps {
  categoryTitle: string;
  documentaries: Documentary[];
  onPlay: (doc: Documentary) => void;
  favorites: string[];
}

export const VideoSliderSection: React.FC<VideoSliderSectionProps> = ({
  categoryTitle,
  documentaries,
  onPlay,
  favorites,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: number) => {
    if (!scrollRef.current) return;
    const itemWidth = window.innerWidth < 640 ? window.innerWidth * 0.85 : window.innerWidth < 1024 ? 400 : 480;
    scrollRef.current.scrollBy({
      left: itemWidth * direction,
      behavior: 'smooth',
    });
  };

  if (documentaries.length === 0) return null;

  return (
    <section className="mb-10 relative group px-0 sm:px-8">
      {/* Category Header Title */}
      <h2 className="text-lg sm:text-xl font-bold mb-3 px-4 sm:px-0 flex items-center gap-2 text-white">
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {categoryTitle}
      </h2>

      {/* Left Scroll Arrow */}
      <button
        onClick={() => scrollSlider(-1)}
        className="hidden md:flex absolute left-0 sm:left-4 top-[2rem] bottom-0 z-30 bg-black/60 hover:bg-black/90 text-white w-12 items-center justify-center transition-all focus:outline-none opacity-0 group-hover:opacity-100 rounded-r-xl cursor-pointer"
        title="เลื่อนซ้าย"
      >
        <svg className="w-8 h-8 transform -translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Horizontal Slider Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-0 hide-scrollbar scroll-smooth px-0 sm:px-0 pb-2 cursor-grab active:cursor-grabbing"
      >
        {documentaries.map((doc) => (
          <VideoCard
            key={doc.id}
            documentary={doc}
            onPlay={onPlay}
            isFavorite={favorites.includes(doc.id)}
            isSlider={true}
          />
        ))}
      </div>

      {/* Right Scroll Arrow */}
      <button
        onClick={() => scrollSlider(1)}
        className="hidden md:flex absolute right-0 sm:right-4 top-[2rem] bottom-0 z-30 bg-black/60 hover:bg-black/90 text-white w-12 items-center justify-center transition-all focus:outline-none opacity-0 group-hover:opacity-100 rounded-l-xl cursor-pointer"
        title="เลื่อนขวา"
      >
        <svg className="w-8 h-8 transform translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};



