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
import { QuizModal } from './components/QuizModal';
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
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // 1. Prevent background main page scrolling when any dialog/modal/drawer is open
  const isAnyModalOpen = Boolean(playingDoc || isCategoryDrawerOpen || isFavoritesOpen || isQuizOpen);

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // 2. Mobile Browser / Hardware Back Button Support (popstate event)
  useEffect(() => {
    if (isAnyModalOpen) {
      // Push history state if not already marked
      if (!window.history.state?.modalActive) {
        window.history.pushState({ modalActive: true }, '');
      }
    }

    const handlePopState = () => {
      // When back button is pressed on phone/browser, close open dialogs
      if (playingDoc) setPlayingDoc(null);
      if (isCategoryDrawerOpen) setIsCategoryDrawerOpen(false);
      if (isFavoritesOpen) {
        setIsFavoritesOpen(false);
        setActiveTab('home');
      }
      if (isQuizOpen) {
        setIsQuizOpen(false);
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [playingDoc, isCategoryDrawerOpen, isFavoritesOpen, isQuizOpen]);

  // Close handlers that also maintain clean browser history
  const handleCloseVideoModal = () => {
    setPlayingDoc(null);
    if (window.history.state?.modalActive) {
      window.history.back();
    }
  };

  const handleCloseCategoryDrawer = () => {
    setIsCategoryDrawerOpen(false);
    if (window.history.state?.modalActive) {
      window.history.back();
    }
  };

  const handleCloseFavorites = () => {
    setIsFavoritesOpen(false);
    setActiveTab('home');
    if (window.history.state?.modalActive) {
      window.history.back();
    }
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    setActiveTab('home');
    if (window.history.state?.modalActive) {
      window.history.back();
    }
  };

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
    setIsQuizOpen(false);
    setIsCategoryDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFavorites = () => {
    setIsFavoritesOpen(true);
    setActiveTab('favorites');
  };

  const handleOpenQuiz = () => {
    setIsQuizOpen(true);
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen text-[#E0E2DB] font-sans relative pb-20 selection:bg-[#A3E635] selection:text-[#080A06] bg-[#080A06]">
      
      {/* Dynamic Nature Background image with dark editorial overlay */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000 opacity-25"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-[#080A06]/90 backdrop-blur-md" />
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
        onOpenQuiz={handleOpenQuiz}
        onGoHome={handleGoHome}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="pt-24 sm:pt-20 max-w-md mx-auto sm:max-w-7xl">
        
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
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <RefreshCw className="w-8 h-8 text-[#A3E635] animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider">กำลังโหลดข้อมูลสารคดีสัตวโลก...</p>
          </div>
        )}

        {/* Main Content View logic */}
        {!isLoading && documentaries.length > 0 && (
          <>
            {/* If user is searching */}
            {searchQuery !== '' ? (
              <div className="px-3 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                  <h2 className="text-xs sm:text-lg font-serif font-bold text-white">
                    ผลการค้นหา: <span className="text-[#A3E635] italic">"{searchQuery}"</span>
                  </h2>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#12150E] border border-white/10 text-white/70 font-semibold">
                    พบ {filteredDocs.length} รายการ
                  </span>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-white/50">
                    <Search className="w-10 h-10 text-white/20 mb-2" />
                    <p className="text-xs font-serif font-bold text-white mb-1">ไม่พบวิดีโอที่คุณค้นหา</p>
                    <p className="text-[11px] text-white/50 font-light">ลองใช้คำค้นหาอื่น เช่น "เสือ", "ป่า", "ทะเล"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <div className="px-3 sm:px-6 py-4">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2.5">
                  <div className="w-1.5 h-4 rounded-full bg-[#A3E635]" />
                  <h2 className="text-xs sm:text-lg font-serif font-bold text-white">
                    หมวดหมู่: <span className="text-[#A3E635] italic">{selectedCategory}</span>
                  </h2>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#12150E] border border-white/10 text-[#A3E635] font-bold">
                    {filteredDocs.length} รายการ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
        <footer className="px-4 mt-12 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-2 text-[10px] text-white/50 pb-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-white font-serif font-black uppercase tracking-wider">WILDLIFE ZOOWORLD MOBILE</span>
            <span>•</span>
            <a
              href="https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A3E635] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
            >
              <ExternalLink className="w-3 h-3" />
              ZOOWORLD
            </a>
          </div>
          <p className="text-[10px] text-white/40 max-w-xs font-light">
            คลังวิดีโอสารคดีธรรมชาติและสารานุกรมสัตว์ป่า ร่วมอนุรักษ์ธรรมชาติ
          </p>
        </footer>

      </main>

      {/* Floating Category Drawer */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={handleCloseCategoryDrawer}
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        documentariesCount={documentaries.length}
      />

      {/* Video Player Dialog Modal */}
      {playingDoc && (
        <VideoPlayerModal
          documentary={playingDoc}
          playlist={
            selectedCategory === 'ทั้งหมด'
              ? documentaries
              : filteredDocs
          }
          onClose={handleCloseVideoModal}
          isFavorite={favorites.includes(playingDoc.id)}
          onToggleFavorite={(doc) => handleToggleFavorite(null, doc)}
          onSelectVideo={setPlayingDoc}
          onShowToast={showToast}
        />
      )}

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={handleCloseFavorites}
        favoriteDocumentaries={favoriteDocs}
        onPlay={(doc) => {
          setPlayingDoc(doc);
          setIsFavoritesOpen(false);
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Quiz Game Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={handleCloseQuiz}
        knowledgeItems={knowledgeItems}
      />

      {/* Mobile Portrait Bottom Navigation Bar */}
      <BottomNav
        onGoHome={handleGoHome}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
        onOpenFavorites={handleOpenFavorites}
        onOpenQuiz={handleOpenQuiz}
        favoritesCount={favorites.length}
        activeTab={activeTab}
      />

    </div>
  );
}
