import React, { useState } from 'react';
import { X, Search, ExternalLink, BookOpen, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeItems: KnowledgeItem[];
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  knowledgeItems,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (!isOpen) return null;

  // Filter items
  const filtered = knowledgeItems.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0B09]/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-6xl bg-[#0A0B09] sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1A1C18] shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9BBF73]/10 border border-[#9BBF73]/30 flex items-center justify-center text-[#9BBF73] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-white uppercase tracking-wider">
                คลังข้อมูลสัตว์โลก ZOOWORLD
              </h2>
              <p className="text-[11px] text-[#E0E2DB]/50">
                ข้อมูลสารานุกรมสัตว์ป่า ({filtered.length} รายการ)
              </p>
            </div>
          </div>

          {/* Search bar inside knowledge modal */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ค้นหาสัตว์, สายพันธุ์..."
                className="w-full bg-[#0A0B09] text-[#E0E2DB] placeholder-white/40 text-xs pl-9 pr-3 py-2 rounded-full border border-white/10 focus:outline-none focus:border-[#9BBF73]"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white bg-white/10 hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-[#0A0B09] hide-scrollbar">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <Search className="w-12 h-12 text-white/30 mb-3" />
              <h3 className="text-base font-serif font-bold text-white mb-1">
                ไม่พบข้อมูลสัตว์ที่คุณค้นหา
              </h3>
              <p className="text-xs text-[#E0E2DB]/60 font-light">
                ลองค้นหาด้วยคำอื่น หรือกดรีเซ็ตคำค้นหา
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map((item) => (
                <a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-xl overflow-hidden bg-[#1A1C18] border border-white/10 hover:border-[#9BBF73] shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0A0B09]">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B09] via-transparent to-transparent opacity-80" />
                    
                    {item.category && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0A0B09]/90 text-[#9BBF73] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {item.category}
                      </span>
                    )}

                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#0A0B09]/70 text-white/70 group-hover:text-[#9BBF73] transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#1A1C18]">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#E0E2DB] line-clamp-1 group-hover:text-[#9BBF73] transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[11px] text-[#E0E2DB]/60 line-clamp-2 mt-1 leading-relaxed font-light">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#9BBF73] font-bold uppercase tracking-wider">
                      <span>อ่านบทความเต็ม</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-[#1A1C18] flex items-center justify-between text-xs text-[#E0E2DB]/60">
            <span>
              หน้า {currentPage} จาก {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-[#0A0B09] border border-white/10 hover:border-[#9BBF73] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ก่อนหน้า</span>
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full bg-[#0A0B09] border border-white/10 hover:border-[#9BBF73] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold uppercase tracking-wider"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
