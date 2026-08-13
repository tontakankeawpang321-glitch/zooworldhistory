import React, { useEffect, useState, useRef } from 'react';
import { Maximize2, Minimize2, Play, Film } from 'lucide-react';
import { Documentary } from '../types';

interface VideoPlayerModalProps {
  documentary: Documentary | null;
  playlist?: Documentary[];
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (doc: Documentary) => void;
  onSelectVideo?: (doc: Documentary) => void;
  onShowToast?: (msg: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  documentary,
  playlist = [],
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectVideo,
}) => {
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPseudoFullscreen) {
          setIsPseudoFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isPseudoFullscreen]);

  if (!documentary) return null;

  const handleToggleFullscreen = () => {
    setIsPseudoFullscreen(!isPseudoFullscreen);
  };

  // Filter other videos from playlist excluding currently playing documentary
  const otherVideos = playlist.filter((d) => d.id !== documentary.id);

  const handleChooseOtherVideo = (video: Documentary) => {
    if (onSelectVideo) {
      onSelectVideo(video);
      // Scroll modal body back to top smoothly
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Main Content Box */}
      <div className="relative bg-gray-900 sm:rounded-xl overflow-hidden shadow-2xl w-full max-w-5xl mx-0 sm:mx-4 sm:border border-gray-800 h-full sm:h-[90vh] flex flex-col z-10">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800 bg-black shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-white truncate pr-4 flex-1">
            {documentary.title}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {/* Fullscreen toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-full text-emerald-300 hover:text-white bg-emerald-950/80 border border-emerald-500/30 transition-all active:scale-90 cursor-pointer flex items-center gap-1 text-[10px] font-extrabold"
              title={isPseudoFullscreen ? "ย่อหน้าจอ" : "ขยายเต็มจอ"}
            >
              {isPseudoFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPseudoFullscreen ? "ย่อจอ" : "เต็มจอ"}</span>
            </button>

            {/* Favorite button */}
            <button 
              onClick={() => onToggleFavorite(documentary)} 
              className={`p-2 rounded-full transition-colors ${
                isFavorite ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-500 hover:bg-gray-800'
              }`} 
              aria-label="เพิ่มลงรายการโปรด"
            >
              <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>

            {/* Close button */}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer" 
              aria-label="ปิด"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={modalBodyRef} className="flex-1 overflow-y-auto bg-gray-900">
          
          {/* Video Embed Frame Container */}
          <div
            ref={videoContainerRef}
            className={
              isPseudoFullscreen
                ? "fixed inset-0 z-[100] w-screen h-screen bg-black flex flex-col justify-center items-center"
                : "relative w-full aspect-video bg-black shrink-0 group"
            }
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${documentary.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&enablejsapi=1`}
              title={documentary.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen={true}
            />

            {/* Overlay Fullscreen Toggle Button */}
            <button
              onClick={handleToggleFullscreen}
              className="absolute bottom-4 right-4 z-30 px-3 py-2 rounded-xl bg-[#040D0A]/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-xs font-black flex items-center gap-1.5 active:scale-90 shadow-2xl hover:bg-emerald-500 hover:text-[#040D0A] transition-all cursor-pointer"
            >
              {isPseudoFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>ออกจากเต็มจอ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>ขยายเต็มจอ</span>
                </>
              )}
            </button>
          </div>

          {/* Description & Auto-play indicator */}
          <div className="p-4 sm:p-6 text-gray-300 text-sm sm:text-base border-b border-gray-800">
            <p className="mb-4 text-gray-200 leading-relaxed">
              {documentary.description || 'รายละเอียดสารคดี...'}
            </p>
            <div className="flex items-center text-xs text-emerald-400 gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              <span>เล่นอัตโนมัติเมื่อจบ (Auto-play Next)</span>
            </div>
          </div>

          {/* Other Videos Section (เรื่องอื่น ๆ ให้เลือกเล่น) */}
          {otherVideos.length > 0 && (
            <div className="p-4 sm:p-6 bg-black/60">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <span>เรื่องอื่น ๆ ที่น่าสนใจ</span>
                </h3>
                <span className="text-[11px] text-gray-400">เลือกเล่นวิดีโอได้ทันที</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {otherVideos.slice(0, 12).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleChooseOtherVideo(item)}
                    className="group bg-gray-800/80 hover:bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-black overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-1.5 block font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
