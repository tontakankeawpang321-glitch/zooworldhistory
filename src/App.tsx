import React, { useEffect, useState, useMemo } from 'react';
import { Documentary, KnowledgeItem, ActiveTab, ToastMessage } from './types';
import { fetchDocumentaries, fetchKnowledgeData } from './services/dataService';
import { getDailyBackgroundImage } from './utils/csvParser';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoryBar } from './components/CategoryBar';
import { CategoryDrawer } from './components/CategoryDrawer';
import { HeroFeatured } from './components/HeroFeatured';
import { VideoSliderSection } from './components/VideoSliderSection';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FavoritesModal } from './components/FavoritesModal';
import { KnowledgeModal } from './components/KnowledgeModal';
import { Toast } from './components/Toast';
import { Compass, RefreshCw, Heart, Search, ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bgImage, setBgImage] = useState<string>('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zooworld_favorites') || localStorage.getItem('documentary_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal & Drawer states
  const [playingDoc, setPlayingDoc] = useState<Documentary | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial Load
  const loadData = async () => {
    setIsLoading(true);
    setBgImage(getDailyBackgroundImage());
    try {
      const [docs, kItems] = await Promise.all([
        fetchDocumentaries(),
        fetchKnowledgeData(),
      ]);
      setDocumentaries(docs);
      setKnowledgeItems(kItems);
    } catch (err) {
      console.error('Error loading application data:', err);
      showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล ลองใหม่อีกครั้ง', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save favorites to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('zooworld_favorites', JSON.stringify(favorites));
      localStorage.setItem('documentary_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  // Toggle favorite status
  const handleToggleFavorite = (e: React.MouseEvent | null, doc: Documentary) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(doc.id);
      if (isFav) {
        showToast(`ลบ "${doc.title.substring(0, 20)}..." ออกจากรายการโปรดแล้ว`, 'info');
        return prev.filter((id) => id !== doc.id);
      } else {
        showToast(`เพิ่ม "${doc.title.substring(0, 20)}..." ลงรายการโปรดแล้ว!`, 'success');
        return [...prev, doc.id];
      }
    });
  };

  // Extracted list of unique categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    documentaries.forEach((d) => {
      if (d.category && d.category.trim()) {
        set.add(d.category.trim());
      }
    });
    return ['ทั้งหมด', ...Array.from(set)];
  }, [documentaries]);

  // Daily Featured Documentary (Hero)
  const featuredDoc = useMemo(() => {
    if (documentaries.length === 0) return null;
    return documentaries[0];
  }, [documentaries]);

  // Filtered documentaries list
  const filteredDocs = useMemo(() => {
    return documentaries.filter((doc) => {
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ทั้งหมด' || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documentaries, searchQuery, selectedCategory]);

  // List of favorite documentaries objects
  const favoriteDocs = useMemo(() => {
    return documentaries.filter((doc) => favorites.includes(doc.id));
  }, [documentaries, favorites]);

  // Navigation handlers
  const handleGoHome = () => {
    setActiveTab('home');
    setSelectedCategory('ทั้งหมด');
    setSearchQuery('');
    setIsFavoritesOpen(false);
    setIsKnowledgeOpen(false);
    setIsCategoryDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFavorites = () => {
    setIsFavoritesOpen(true);
    setActiveTab('favorites');
  };

  const handleOpenKnowledge = () => {
    setIsKnowledgeOpen(true);
    setActiveTab('knowledge');
  };

  return (
    <div className="min-h-screen text-[#E0E2DB] font-sans relative pb-24 selection:bg-[#9BBF73] selection:text-[#0A0B09] bg-[#0A0B09]">
      
      {/* Dynamic Nature Background image with dark editorial overlay */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000 opacity-30"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-[#0A0B09]/80 backdrop-blur-md" />
      </div>

      {/* Floating Toast Notification */}
      <Toast toast={toast} />

      {/* Top Header Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadData}
        isLoading={isLoading}
        favoritesCount={favorites.length}
        onOpenFavorites={handleOpenFavorites}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
        onOpenKnowledge={handleOpenKnowledge}
        onGoHome={handleGoHome}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="pt-28 md:pt-20">
        
        {/* Horizontal Category Bar */}
        <CategoryBar
          categories={categoriesList}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSearchQuery('');
          }}
          onOpenDrawer={() => setIsCategoryDrawerOpen(true)}
        />

        {/* Loading Spinner Skeleton */}
        {isLoading && documentaries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-white/50">
            <RefreshCw className="w-10 h-10 text-[#9BBF73] animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider">กำลังโหลดข้อมูลสารคดีสัตวโลก...</p>
          </div>
        )}

        {/* Main Content View logic */}
        {!isLoading && documentaries.length > 0 && (
          <>
            {/* If user is searching */}
            {searchQuery !== '' ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
                  <h2 className="text-lg sm:text-2xl font-serif text-white">
                    ผลการค้นหา: <span className="text-[#9BBF73] italic">"{searchQuery}"</span>
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#1A1C18] border border-white/10 text-[#E0E2DB]/70 font-semibold">
                    พบ {filteredDocs.length} รายการ
                  </span>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-white/50">
                    <Search className="w-12 h-12 text-white/20 mb-3" />
                    <p className="text-base font-serif font-bold text-white mb-1">ไม่พบวิดีโอที่คุณค้นหา</p>
                    <p className="text-xs text-[#E0E2DB]/60 font-light">ลองใช้คำค้นหาอื่น เช่น "เสือ", "ป่า", "ทะเล"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDocs.map((doc) => (
                      <VideoCard
                        key={doc.id}
                        documentary={doc}
                        onPlay={setPlayingDoc}
                        isFavorite={favorites.includes(doc.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : selectedCategory !== 'ทั้งหมด' ? (
              /* If specific category is selected */
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                  <div className="w-1.5 h-6 rounded-full bg-[#9BBF73]" />
                  <h2 className="text-lg sm:text-2xl font-serif text-white">
                    หมวดหมู่: <span className="text-[#9BBF73] italic">{selectedCategory}</span>
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#1A1C18] border border-white/10 text-[#9BBF73] font-bold">
                    {filteredDocs.length} รายการ
                  </span>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredDocs.map((doc) => (
                    <VideoCard
                      key={doc.id}
                      documentary={doc}
                      onPlay={setPlayingDoc}
                      isFavorite={favorites.includes(doc.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Home View: Hero + Horizontal Sliders per Category */
              <>
                {/* Hero Banner */}
                {featuredDoc && (
                  <HeroFeatured
                    documentary={featuredDoc}
                    onPlay={setPlayingDoc}
                    isFavorite={favorites.includes(featuredDoc.id)}
                    onToggleFavorite={(doc) => handleToggleFavorite(null, doc)}
                  />
                )}

                {/* Category Sliders */}
                {categoriesList
                  .filter((cat) => cat !== 'ทั้งหมด')
                  .map((cat) => {
                    const catDocs = documentaries.filter((d) => d.category === cat);
                    if (catDocs.length === 0) return null;
                    return (
                      <VideoSliderSection
                        key={cat}
                        categoryTitle={cat}
                        documentaries={catDocs}
                        onPlay={setPlayingDoc}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    );
                  })}
              </>
            )}
          </>
        )}

        {/* Footer info */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-3 text-xs text-[#E0E2DB]/60 pb-16">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-white font-serif font-bold uppercase tracking-wider">WILDLIFE ZOOWORLD DOCUMENTARY</span>
            <span>•</span>
            <a
              href="https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9BBF73] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เว็บไซต์สนับสนุน ZOOWORLD
            </a>
          </div>
          <p className="text-[11px] text-[#E0E2DB]/40 text-center font-light max-w-lg">
            คลังวิดีโอสารคดีธรรมชาติและสารานุกรมสัตว์ป่า ร่วมอนุรักษ์สิ่งแวดล้อมและธรรมชาติของโลก
          </p>
        </footer>

      </main>

      {/* Floating Category Drawer */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        documentariesCount={documentaries.length}
      />

      {/* Video Player Modal */}
      {playingDoc && (
        <VideoPlayerModal
          documentary={playingDoc}
          playlist={
            selectedCategory === 'ทั้งหมด'
              ? documentaries
              : filteredDocs
          }
          onClose={() => setPlayingDoc(null)}
          isFavorite={favorites.includes(playingDoc.id)}
          onToggleFavorite={(doc) => handleToggleFavorite(null, doc)}
          onSelectVideo={setPlayingDoc}
          onShowToast={showToast}
        />
      )}

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => {
          setIsFavoritesOpen(false);
          setActiveTab('home');
        }}
        favoriteDocumentaries={favoriteDocs}
        onPlay={(doc) => {
          setPlayingDoc(doc);
          setIsFavoritesOpen(false);
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Knowledge Search Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => {
          setIsKnowledgeOpen(false);
          setActiveTab('home');
        }}
        knowledgeItems={knowledgeItems}
      />

      {/* Mobile Portrait Bottom Navigation Bar */}
      <BottomNav
        onGoHome={handleGoHome}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
        onOpenFavorites={handleOpenFavorites}
        onOpenKnowledge={handleOpenKnowledge}
        favoritesCount={favorites.length}
        activeTab={activeTab}
      />

    </div>
  );
}
