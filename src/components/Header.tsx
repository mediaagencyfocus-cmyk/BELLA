import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  X,
  Layers,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoeCategory } from '../types';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    cartTotal,
    cartCount,
    setIsCartOpen,
    wishlist,
    showWishlistOnly,
    setShowWishlistOnly,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    user,
    logout,
    isAdminView,
    setIsAdminView,
    setIsAuthModalOpen,
    setAuthModalMode,
    settings
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const categories: { id: ShoeCategory | 'all'; label: string; shortLabel: string; count: string }[] = [
    { id: 'all', label: 'جميع الأحذية', shortLabel: 'الكل', count: 'التشكيلة الكاملة' },
    { id: 'womens', label: 'الأحذية النسائية', shortLabel: 'نسائية', count: 'كعب، صندل، سنيكرز' },
    { id: 'mens', label: 'الأحذية الرجالية', shortLabel: 'رجالية', count: 'أكسفورد، كلاسيك، كاجوال' },
    { id: 'kids', label: 'أحذية الأطفال', shortLabel: 'أطفال', count: 'مريحة ومتينة للصغار' },
    { id: 'wholesale', label: 'البيع بالجملة', shortLabel: 'الجملة', count: 'سلاسل وكراتين للتجار' }
  ];

  const popularSearches = [
    { label: 'كعب عالي ملكي', category: 'womens' as ShoeCategory },
    { label: 'حذاء أكسفورد كلاسيكي', category: 'mens' as ShoeCategory },
    { label: 'سنيكرز رجالي كاجوال', category: 'mens' as ShoeCategory },
    { label: 'سنيكرز نسائي راقي', category: 'womens' as ShoeCategory },
    { label: 'حذاء أطفال مريح', category: 'kids' as ShoeCategory },
    { label: 'كرتون سلسلة مشكلة', category: 'wholesale' as ShoeCategory }
  ];

  const quickSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isSearchOpen]);

  const scrollToCatalog = () => {
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const handleSelectCategory = (catId: ShoeCategory | 'all') => {
    setShowWishlistOnly(false);
    setActiveCategory(catId);
    setIsAdminView(false);
    setIsSearchOpen(false);
    scrollToCatalog();
  };

  const handleToggleWishlistView = () => {
    const next = !showWishlistOnly;
    setShowWishlistOnly(next);
    if (next) {
      setActiveCategory('all');
    }
    setIsAdminView(false);
    setIsSearchOpen(false);
    scrollToCatalog();
  };

  const handleSelectPopularSearch = (term: string, catId: ShoeCategory) => {
    setShowWishlistOnly(false);
    setSearchQuery(term);
    setActiveCategory(catId);
    setIsAdminView(false);
    setIsSearchOpen(false);
    scrollToCatalog();
  };

  const handleSelectQuickSize = (size: number) => {
    setShowWishlistOnly(false);
    setSearchQuery(size.toString());
    setIsAdminView(false);
    setIsSearchOpen(false);
    scrollToCatalog();
  };

  return (
    <header
      ref={searchContainerRef}
      className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-white/95 dark:bg-[#0A0B0E]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200"
    >
      {/* Primary Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6 min-w-0">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className="text-base sm:text-xl font-black tracking-wide sm:tracking-wider text-slate-950 dark:text-white font-brand whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span>{settings.storeName || 'BELLA SHOES'}</span>
        </button>

        {/* Zone 2: Clean Desktop Category Navigation */}
        <nav
          aria-label="أقسام المتجر"
          className="hidden lg:flex items-center gap-6 text-[13px] font-semibold"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id && !showWishlistOnly && !isAdminView;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#00C8FF] text-slate-950 dark:text-white font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Utility & Primary Cart Action */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isSearchOpen || searchQuery
                ? 'border-[#00C8FF] bg-[#00C8FF]/10 text-[#0099CC] dark:text-[#00C8FF]'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111319] text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            title="البحث في المتجر"
            aria-label="البحث في المتجر"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Day / Night Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111319] text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title={theme === 'dark' ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
            aria-label="تبديل المظهر النهاري والليلي"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C8FF]" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
            )}
          </button>

          {/* Wishlist Filter Toggle */}
          <button
            type="button"
            onClick={handleToggleWishlistView}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center relative transition-colors cursor-pointer ${
              showWishlistOnly
                ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111319] text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            title="المفضلة"
            aria-label="عرض المفضلة"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlist.length > 0 || showWishlistOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Admin Menu */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-8 sm:h-10 px-2 sm:px-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111319] text-slate-900 dark:text-white flex items-center gap-1 text-xs font-semibold hover:border-[#00C8FF] transition-colors cursor-pointer"
                  title="حسابي"
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C8FF]" />
                  <span className="max-w-[70px] truncate hidden md:inline">{user.name}</span>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#111319] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 text-[11px] font-bold text-[#0099CC] dark:text-[#00C8FF]">
                          حساب الإدارة · ADMIN
                        </span>
                      )}
                    </div>

                    {user.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminView(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-[#00C8FF]" />
                        <span>لوحة الإدارة</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111319] text-slate-700 dark:text-slate-200 hover:text-[#00C8FF] hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="تسجيل الدخول / حسابي"
                aria-label="تسجيل الدخول"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Primary Action: Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="h-8 sm:h-10 px-2.5 sm:px-4 rounded-full bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-xs flex items-center gap-1 sm:gap-1.5 shadow-[0_2px_14px_rgba(0,200,255,0.35)] transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.25]" />
            <span className="font-mono font-black tabular-nums">{cartCount}</span>
            <span className="hidden sm:inline opacity-60">·</span>
            <span className="hidden sm:inline font-mono font-bold tabular-nums">{cartTotal} MAD</span>
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Clean Horizontal Category Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0C0E13]">
        <nav
          aria-label="تصفح الأقسام"
          className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id && !showWishlistOnly && !isAdminView;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#00C8FF] text-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="sm:hidden">{cat.shortLabel}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Expandable Smart Search Drawer */}
      {isSearchOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1016] shadow-2xl">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5 space-y-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowWishlistOnly(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchOpen(false);
                    scrollToCatalog();
                  }
                }}
                placeholder="ابحث عن حذاء، مقاس (38..44)، لون، أو قسم..."
                className="w-full pl-11 pr-11 py-3 rounded-xl text-sm bg-slate-50 dark:bg-[#161922] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#00C8FF] transition-colors"
              />
              <Search className="w-4 h-4 text-[#00C8FF] absolute right-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery('');
                  } else {
                    setIsSearchOpen(false);
                  }
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title={searchQuery ? 'مسح البحث' : 'إغلاق'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories Quick Jump */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>تصفح الأقسام مباشرة</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-right transition-colors cursor-pointer ${
                      activeCategory === cat.id && !showWishlistOnly
                        ? 'bg-[#00C8FF]/10 border-[#00C8FF] text-slate-950 dark:text-white'
                        : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#00C8FF]'
                    }`}
                  >
                    <span className="block text-xs font-bold">{cat.label}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Models & Quick Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  الأكثر بحثاً
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPopularSearch(item.label, item.category)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-[#00C8FF]/15 dark:bg-[#161922] dark:hover:bg-[#00C8FF]/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-[#00C8FF] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-[#00C8FF]" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  تصفية سريعة حسب المقاس (EU)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSelectQuickSize(sz)}
                      className="w-9 h-9 rounded-lg font-mono font-bold text-xs tabular-nums bg-slate-100 hover:bg-[#00C8FF] hover:text-black dark:bg-[#161922] dark:hover:bg-[#00C8FF] dark:hover:text-black text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
