import React, { useState } from 'react';
import { X, Search, ExternalLink, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const itemsPerPage = 6;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080A06]/95 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#080A06] rounded-2xl border border-white/15 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 bg-[#12150E] shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#080A06] flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 text-[#080A06]" />
              </div>
              <div>
                <h2 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                  คลังข้อมูลสัตว์โลก
                </h2>
                <p className="text-[10px] text-white/50">
                  {filtered.length} บทความสารานุกรม
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#080A06] bg-[#A3E635] hover:bg-white transition-all cursor-pointer font-bold"
            >
              <X className="w-4 h-4 text-[#080A06]" />
            </button>
          </div>

          {/* Search bar inside knowledge modal */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาบทความสายพันธุ์สัตว์..."
              className="w-full bg-[#080A06] text-white placeholder-white/35 text-xs pl-8 pr-3 py-1.5 rounded-full border border-white/10 focus:outline-none focus:border-[#A3E635]"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 flex-1 overflow-y-auto bg-[#080A06] hide-scrollbar">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Search className="w-10 h-10 text-white/30 mb-2" />
              <h3 className="text-xs font-bold text-white mb-1">
                ไม่พบข้อมูลสัตว์ที่คุณค้นหา
              </h3>
              <p className="text-[11px] text-white/50 font-light">
                ลองค้นหาด้วยคำอื่น
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paginated.map((item) => (
                <a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-xl overflow-hidden bg-[#12150E] border border-white/10 hover:border-[#A3E635]/60 transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.98]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#080A06]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080A06] via-transparent to-transparent opacity-80" />
                    
                    {item.category && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080A06]/90 text-[#A3E635] text-[9px] font-bold uppercase tracking-wider border border-white/10">
                        {item.category}
                      </span>
                    )}

                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#080A06]/70 text-[#A3E635]">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2.5 flex flex-col justify-between flex-1 bg-[#12150E]">
                    <div>
                      <h3 className="text-xs font-serif font-bold text-white line-clamp-1 group-hover:text-[#A3E635] transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[10px] text-white/50 line-clamp-2 mt-1 leading-relaxed font-light">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A3E635] font-bold uppercase tracking-wider">
                      <span>อ่านข้อมูลเต็ม</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-white/10 bg-[#12150E] flex items-center justify-between text-xs text-white/60">
            <span className="text-[11px]">
              หน้า {currentPage} จาก {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-full bg-[#080A06] border border-white/10 hover:border-[#A3E635] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>ก่อนหน้า</span>
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-full bg-[#080A06] border border-white/10 hover:border-[#A3E635] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

