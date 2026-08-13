import React, { useEffect, useState } from 'react';
import { X, Heart, ChevronRight, Share2, Info, Sparkles, Check } from 'lucide-react';
import { Documentary } from '../types';

interface VideoPlayerModalProps {
  documentary: Documentary | null;
  playlist: Documentary[];
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (doc: Documentary) => void;
  onSelectVideo: (doc: Documentary) => void;
  onShowToast: (msg: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  documentary,
  playlist,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectVideo,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!documentary) return null;

  // Next video in playlist
  const currentIndex = playlist.findIndex((d) => d.id === documentary.id);
  const nextVideo =
    currentIndex !== -1 && currentIndex < playlist.length - 1
      ? playlist[currentIndex + 1]
      : playlist[0] && playlist[0].id !== documentary.id
      ? playlist[0]
      : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(documentary.videoUrl);
      setCopied(true);
      onShowToast('คัดลอกลิงก์วิดีโอเรียบร้อยแล้ว!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#080A06]/95 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Main Mobile Player Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#080A06] rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col max-h-[96vh]">
        
        {/* Top Dialog Bar */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#12150E] shrink-0">
          <div className="flex items-center gap-2 pr-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-[#A3E635] text-[#080A06] font-extrabold text-[9px] uppercase tracking-wider shrink-0">
              {documentary.category}
            </span>
            <h2 className="text-xs font-serif font-bold text-white truncate">
              {documentary.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full text-white/70 hover:text-white bg-white/5 border border-white/10 transition-colors cursor-pointer"
              title="แชร์ลิงก์"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#A3E635]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(documentary)}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#A3E635] border-[#A3E635] text-[#080A06]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-[#A3E635]'
              }`}
              title={isFavorite ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#080A06]' : ''}`} />
            </button>

            {/* Prominent Mobile Dialog Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#080A06] bg-[#A3E635] hover:bg-white transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0 shadow-lg font-bold"
              title="ปิดวิดีโอ"
            >
              <X className="w-4 h-4 text-[#080A06]" />
            </button>
          </div>
        </div>

        {/* Video Embed Frame */}
        <div className="relative w-full aspect-video bg-black shrink-0">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${documentary.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={documentary.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Details & Playlist Content */}
        <div className="flex-1 overflow-y-auto p-3.5 bg-[#080A06] space-y-3 hide-scrollbar">
          
          {/* Title & Category Info */}
          <div>
            <h1 className="text-sm font-serif font-bold text-white leading-snug">
              {documentary.title}
            </h1>
            
            {/* Description Box */}
            <div className="mt-2 p-3 rounded-xl bg-[#12150E] border border-white/10 text-xs text-white/70 leading-relaxed font-light">
              <p className={showFullDesc ? '' : 'line-clamp-2'}>
                {documentary.description || 'ไม่มีรายละเอียดสำหรับสารคดีชุดนี้'}
              </p>
              {documentary.description && documentary.description.length > 80 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-1.5 text-[11px] text-[#A3E635] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  {showFullDesc ? 'ย่อรายละเอียด' : 'อ่านเพิ่มเติม'}
                </button>
              )}
            </div>
          </div>

          {/* Up Next / Next Video Card Banner */}
          {nextVideo && (
            <div className="p-2.5 rounded-xl bg-[#12150E] border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={nextVideo.thumbnail}
                  alt={nextVideo.title}
                  className="w-14 h-9 object-cover rounded border border-white/10 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=300';
                  }}
                />
                <div className="overflow-hidden">
                  <span className="text-[9px] text-[#A3E635] font-bold uppercase tracking-wider block">
                    สารคดีถัดไป
                  </span>
                  <h4 className="text-xs font-semibold text-white truncate">
                    {nextVideo.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => onSelectVideo(nextVideo)}
                className="px-3 py-1.5 rounded-full bg-[#A3E635] text-[#080A06] font-black text-xs shrink-0 flex items-center gap-0.5 active:scale-95 shadow-md uppercase tracking-wider cursor-pointer"
              >
                <span>เล่นเลย</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Playlist / Related Videos Grid */}
          {playlist.length > 1 && (
            <div>
              <h3 className="text-xs font-serif font-bold text-white/80 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>วิดีโออื่นๆ ในหมวดนี้ ({playlist.length})</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {playlist.map((item) => {
                  const isCurrent = item.id === documentary.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isCurrent && onSelectVideo(item)}
                      className={`relative rounded-lg overflow-hidden border p-1.5 cursor-pointer transition-all flex flex-col ${
                        isCurrent
                          ? 'bg-[#12150E] border-[#A3E635] shadow-md'
                          : 'bg-[#12150E]/60 hover:bg-[#12150E] border-white/5'
                      }`}
                    >
                      <div className="relative aspect-video w-full rounded overflow-hidden bg-black mb-1.5">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=300';
                          }}
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#080A06]/80 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[9px] font-bold text-[#080A06] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#A3E635]">
                              กำลังเล่น
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-[10px] font-medium text-white/90 line-clamp-1 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

