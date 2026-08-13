import React, { useEffect, useState, useMemo } from 'react';
import { Documentary, KnowledgeItem, ActiveTab, ToastMessage } from './types';
import { fetchDocumentaries, fetchKnowledgeData } from './services/dataService';
import { getDailyBackgroundImage } from './utils/csvParser';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoryBar } from './components/CategoryBar';
import { CategoryDrawer } from './components/CategoryDrawer';
import { VideoSliderSection } from './components/VideoSliderSection';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FavoritesModal } from './components/FavoritesModal';
import { QuizModal } from './components/QuizModal';
import { Toast } from './components/Toast';
import { RefreshCw, Search } from 'lucide-react';

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

  // Modal & Drawer & Navigation states
  const [playingDoc, setPlayingDoc] = useState<Documentary | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Prevent background scrolling when any modal is open
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

  // Mobile Back button support
  useEffect(() => {
    if (isAnyModalOpen) {
      if (!window.history.state?.modalActive) {
        window.history.pushState({ modalActive: true }, '');
      }
    }

    const handlePopState = () => {
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
    setActiveTab('favorites');
    setIsFavoritesOpen(true);
    setIsQuizOpen(false);
  };

  const handleOpenQuiz = () => {
    setActiveTab('quiz');
    setIsQuizOpen(true);
    setIsFavoritesOpen(false);
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans relative pb-20 selection:bg-emerald-500 selection:text-white bg-black">
      
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000 opacity-20"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black backdrop-blur-md" />
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
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="pt-24 sm:pt-28 pb-12 w-full">
        
        {/* Horizontal Category Bar */}
        {!isLoading && documentaries.length > 0 && (
          <CategoryBar
            categories={categoriesList}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSearchQuery('');
            }}
          />
        )}

        {/* Loading Spinner Skeleton */}
        {isLoading && documentaries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">กำลังโหลดข้อมูลสารคดี...</p>
          </div>
        )}

        {/* Main Content View logic */}
        {!isLoading && documentaries.length > 0 && (
          <>
            {/* If user is searching */}
            {searchQuery !== '' ? (
              <div className="px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2.5">
                  <h2 className="text-sm sm:text-lg font-bold text-white">
                    ผลการค้นหา: <span className="text-emerald-400">"{searchQuery}"</span>
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-emerald-400 font-semibold">
                    พบ {filteredDocs.length} รายการ
                  </span>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-white/50">
                    <Search className="w-10 h-10 text-emerald-400/40 mb-2" />
                    <p className="text-sm font-bold text-white mb-1">ไม่พบวิดีโอที่คุณค้นหา</p>
                    <p className="text-xs text-gray-400 font-light">ลองใช้คำค้นหาอื่น เช่น "เสือ", "ป่า", "ทะเล"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <div className="px-4 sm:px-8 py-4">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2.5">
                  <h2 className="text-sm sm:text-lg font-bold text-white">
                    หมวดหมู่: <span className="text-emerald-400">{selectedCategory}</span>
                  </h2>
                  <button
                    onClick={() => setSelectedCategory('ทั้งหมด')}
                    className="ml-auto text-xs px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-emerald-400 font-semibold cursor-pointer"
                  >
                    ← ดูทุกหมวดหมู่
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              /* Home View: Horizontal Sliders per Category */
              <>
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
                      />
                    );
                  })}
              </>
            )}
          </>
        )}

      </main>

      {/* Sidebar Category Drawer */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={handleCloseCategoryDrawer}
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* Video Player Modal */}
      {playingDoc && (
        <VideoPlayerModal
          documentary={playingDoc}
          playlist={documentaries}
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
        favorites={favoriteDocs}
        onPlay={(doc) => {
          setPlayingDoc(doc);
          setIsFavoritesOpen(false);
        }}
        onRemoveFavorite={(docId) => {
          const doc = documentaries.find((d) => d.id === docId);
          if (doc) handleToggleFavorite(null, doc);
        }}
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={handleCloseQuiz}
        knowledgeItems={knowledgeItems}
      />

      {/* Bottom Navigation */}
      <BottomNav
        onGoHome={handleGoHome}
        onOpenFavorites={handleOpenFavorites}
        onOpenQuiz={handleOpenQuiz}
        activeTab={activeTab}
      />

    </div>
  );
}
