import React, { useEffect, useState } from 'react';
import { X, Heart, Play, ChevronRight, Share2, Info, Sparkles, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0B09]/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Player Dialog Box */}
      <div className="relative w-full max-w-5xl bg-[#0A0B09] sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[100vh] sm:max-h-[92vh]">
        
        {/* Top Dialog Bar */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-[#1A1C18] shrink-0">
          <div className="flex items-center gap-2 pr-2 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded bg-[#9BBF73] text-[#0A0B09] font-bold text-[10px] uppercase tracking-wider shrink-0">
              {documentary.category}
            </span>
            <h2 className="text-xs sm:text-base font-serif font-bold text-white truncate">
              {documentary.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-white/70 hover:text-white bg-white/5 border border-white/10 hover:border-[#9BBF73]/50 transition-colors cursor-pointer"
              title="แชร์ลิงก์"
            >
              {copied ? <Check className="w-4 h-4 text-[#9BBF73]" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(documentary)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#9BBF73] border-[#9BBF73] text-[#0A0B09]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-[#9BBF73]'
              }`}
              title={isFavorite ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#0A0B09]' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="ปิด"
            >
              <X className="w-5 h-5" />
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0B09] space-y-4 hide-scrollbar">
          
          {/* Title & Category Info */}
          <div>
            <h1 className="text-base sm:text-2xl font-serif text-white leading-tight">
              {documentary.title}
            </h1>
            
            {/* Description Box */}
            <div className="mt-3 p-4 rounded-xl bg-[#1A1C18] border border-white/10 text-xs sm:text-sm text-[#E0E2DB]/80 leading-relaxed font-light">
              <p className={showFullDesc ? '' : 'line-clamp-2'}>
                {documentary.description || 'ไม่มีรายละเอียดสำหรับสารคดีชุดนี้'}
              </p>
              {documentary.description && documentary.description.length > 100 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-xs text-[#9BBF73] hover:underline font-bold flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  {showFullDesc ? 'ย่อรายละเอียด' : 'อ่านรายละเอียดเพิ่มเติม'}
                </button>
              )}
            </div>
          </div>

          {/* Up Next / Next Video Card Banner */}
          {nextVideo && (
            <div className="p-4 rounded-xl bg-[#1A1C18] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={nextVideo.thumbnail}
                  alt={nextVideo.title}
                  className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded border border-white/10 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=300';
                  }}
                />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-[#9BBF73] font-bold uppercase tracking-wider block">
                    สารคดีถัดไป
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {nextVideo.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => onSelectVideo(nextVideo)}
                className="px-4 py-2 rounded-full bg-[#9BBF73] text-[#0A0B09] font-extrabold text-xs shrink-0 flex items-center gap-1 transition-transform active:scale-95 shadow-md uppercase tracking-wider cursor-pointer"
              >
                <span>เล่นเลย</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Playlist / Related Videos Horizontal Carousel */}
          {playlist.length > 1 && (
            <div>
              <h3 className="text-xs sm:text-sm font-serif font-bold text-white/80 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#9BBF73]" />
                <span>รายการสารคดีในหมวดหมู่นี้ ({playlist.length})</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {playlist.map((item) => {
                  const isCurrent = item.id === documentary.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isCurrent && onSelectVideo(item)}
                      className={`relative rounded-xl overflow-hidden border p-2 cursor-pointer transition-all flex flex-col ${
                        isCurrent
                          ? 'bg-[#1A1C18] border-[#9BBF73] shadow-md'
                          : 'bg-[#1A1C18]/60 hover:bg-[#1A1C18] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative aspect-video w-full rounded overflow-hidden bg-black mb-2">
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
                          <div className="absolute inset-0 bg-[#0A0B09]/80 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#0A0B09] uppercase tracking-wider px-2 py-0.5 rounded bg-[#9BBF73]">
                              กำลังเล่น
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-[11px] font-medium text-[#E0E2DB] line-clamp-1 leading-snug">
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
