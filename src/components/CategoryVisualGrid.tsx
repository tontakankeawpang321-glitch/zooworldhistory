import React from 'react';
import { Sparkles, Play, Flame } from 'lucide-react';
import { Documentary } from '../types';

interface CategoryVisualGridProps {
  categories: string[];
  documentaries?: Documentary[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const GRADIENTS = [
  'from-amber-600/80 via-orange-900/60 to-transparent',
  'from-cyan-600/80 via-blue-900/60 to-transparent',
  'from-pink-600/80 via-purple-900/60 to-transparent',
  'from-emerald-600/80 via-teal-900/60 to-transparent',
  'from-red-600/80 via-rose-900/60 to-transparent',
  'from-sky-600/80 via-indigo-900/60 to-transparent',
  'from-lime-600/80 via-emerald-900/60 to-transparent',
  'from-violet-600/80 via-purple-950/60 to-transparent',
];

const FALLBACK_IMAGES: Record<string, string> = {
  'ชีวิตสัตว์': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800',
  'สัตว์ล่าเหยื่อ': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800',
  'สัตว์ป่าสงวน': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800',
  'สัตว์น่ารัก': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  'ธรรมชาติ': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
  'สัตว์ทะเล': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
  'สัตว์เลื้อยคลาน': 'https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&q=80&w=800',
  'นกและสัตว์ปีก': 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=800',
  'สัตว์ใหญ่': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
  'สัตว์เลี้ยงลูกด้วยนม': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800';

export const CategoryVisualGrid: React.FC<CategoryVisualGridProps> = ({
  categories,
  documentaries = [],
  onSelectCategory,
  selectedCategory,
}) => {
  // Filter out 'ทั้งหมด' to display actual categories from the sheet
  const displayCategories = categories.filter((cat) => cat !== 'ทั้งหมด');

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-md mx-auto sm:max-w-7xl px-4 my-6">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          <div>
            <h2 className="text-base sm:text-xl font-black text-white font-serif tracking-tight flex items-center gap-2">
              <span>เมนูยอดฮิต</span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                {displayCategories.length} หมวดหมู่
              </span>
            </h2>
            <p className="text-[11px] text-emerald-100/60 font-light">
              เลือกชมตามหมวดหมู่
            </p>
          </div>
        </div>

        {selectedCategory !== 'ทั้งหมด' && (
          <button
            onClick={() => onSelectCategory('ทั้งหมด')}
            className="text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            ดูทั้งหมด
          </button>
        )}
      </div>

      {/* Slanted / Skewed Category Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {displayCategories.map((categoryName, index) => {
          const isSelected = selectedCategory === categoryName;
          const isEven = index % 2 === 0;

          // Find documentaries in this category
          const catDocs = documentaries.filter((d) => d.category === categoryName);
          const count = catDocs.length;

          // Thumbnail: first doc thumbnail or fallback image
          const imageUrl = catDocs[0]?.thumbnail || FALLBACK_IMAGES[categoryName] || DEFAULT_IMAGE;
          const bgGradient = GRADIENTS[index % GRADIENTS.length];

          return (
            <div
              key={categoryName}
              onClick={() => onSelectCategory(categoryName)}
              className={`group relative h-28 sm:h-36 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border shadow-xl flex flex-col justify-end p-3 active:scale-[0.97] ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-[1.02] z-10'
                  : 'border-emerald-500/20 hover:border-emerald-400/80 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
              }`}
            >
              {/* Image Background */}
              <img
                src={imageUrl}
                alt={categoryName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />

              {/* Slanted Color Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${bgGradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040D0A] via-[#040D0A]/40 to-transparent" />

              {/* Slanted Diagonal Accent Stripe */}
              <div 
                className={`absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent transition-all duration-500 group-hover:translate-x-32 ${
                  isEven ? '-right-6 -skew-x-12' : '-left-6 skew-x-12'
                }`} 
              />

              {/* Video Count Tag Top-Left */}
              <div className="absolute top-2 left-2 z-10">
                <span className="px-2 py-0.5 rounded-full bg-[#040D0A]/80 backdrop-blur-md text-emerald-300 font-extrabold text-[9px] border border-emerald-500/30 shadow">
                  {count > 0 ? `${count} วิดีโอ` : 'สารคดี'}
                </span>
              </div>

              {/* Selected Glow Tag Top-Right */}
              {isSelected && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-400 text-[#040D0A] text-[9px] font-black uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                  เลือกอยู่
                </div>
              )}

              {/* Title Overlay */}
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base font-serif font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-emerald-200 transition-colors flex items-center justify-between">
                  <span>{categoryName}</span>
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-4px] group-hover:translate-x-0" />
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

