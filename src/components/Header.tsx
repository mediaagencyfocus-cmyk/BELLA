import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  SlidersHorizontal,
  ChevronDown,
  X,
  Layers,
  Sparkle,
  Tag,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoeCategory } from '../types';

export const Header: React.FC = () => {
  const {
    theme,
    themeMode,
    toggleTheme,
    resetToAutoTheme,
    cartTotal,
    cartCount,
    setIsCartOpen,
    wishlist,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    user,
    logout,
    isAdminView,
    setIsAdminView,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories: { id: ShoeCategory | 'all'; label: string; count: string }[] = [
    { id: 'all', label: 'جميع الأحذية', count: 'الكل' },
    { id: 'womens', label: 'الأحذية النسائية', count: 'كعب، صندل، سنيكرز' },
    { id: 'mens', label: 'الأحذية الرجالية', count: 'أكسفورد، كلاسيك، كاجوال' },
    { id: 'kids', label: 'أحذية الأطفال', count: 'مريحة ومتينة للصغار' },
    { id: 'wholesale', label: 'البيع بالجملة', count: 'سلاسل وكراتين للتجار' }
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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (catId: ShoeCategory | 'all') => {
    setActiveCategory(catId);
    setIsAdminView(false);
    setIsSearchOpen(false);
    // Smooth scroll down to the catalog section
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPopularSearch = (term: string, catId: ShoeCategory) => {
    setSearchQuery(term);
    setActiveCategory(catId);
    setIsAdminView(false);
    setIsSearchOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectQuickSize = (size: number) => {
    setSearchQuery(size.toString());
    setIsSearchOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0B0E] shadow-xs">
      {/* 
        ROW 1:
        - Right: BELLA SHOES brand name
        - Center: Delivery ticker flowing in the inline space
        - Left: Exactly uniform icons (🇲🇦 MAD, Theme Switcher, Wishlist, Cart, Login)
      */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-6 border-b border-slate-100 dark:border-slate-800/80">
        
        {/* RIGHT: BELLA SHOES Brand */}
        <div 
          onClick={() => handleSelectCategory('all')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black dark:bg-[#12141C] border-2 border-[#00C8FF] flex items-center justify-center shadow-[0_0_12px_rgba(0,200,255,0.35)] group-hover:shadow-[0_0_18px_rgba(0,200,255,0.5)] transition-all">
            <span className="text-[#00C8FF] font-black text-base sm:text-lg tracking-tight font-brand">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-black tracking-wider text-slate-950 dark:text-white font-brand leading-none">
              BELLA <span className="text-[#00C8FF]">SHOES</span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-sans tracking-widest mt-0.5 uppercase">
              Luxury Footwear
            </span>
          </div>
        </div>

        {/* CENTER: Calm animated ticker flowing between brand and left icons */}
        <div className="flex-1 mx-2 sm:mx-4 overflow-hidden relative select-none hidden lg:block">
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0A0B0E] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0A0B0E] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Truck className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 ساعة</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>الدفع عند الاستلام مع إمكانية القياس قبل الدفع</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>توصيل مجاني 100% عند طلب زوجين أو أكثر</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[#00C8FF] font-bold">
              الأناقة تبدأ من خطواتك · BELLA SHOES
            </span>

            {/* Continuous loop */}
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Truck className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 ساعة</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>الدفع عند الاستلام مع إمكانية القياس قبل الدفع</span>
            </span>
          </div>
        </div>

        {/* LEFT: Uniform Luxury Utility Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* 1. Currency Icon / Badge: 🇲🇦 MAD */}
          <div 
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12141C] flex items-center gap-1 sm:gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold select-none shadow-2xs"
            title="العملة المعتمدة: الدرهم المغربي"
          >
            <span className="text-xs sm:text-sm">🇲🇦</span>
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-950 dark:text-white">MAD</span>
          </div>

          {/* 2. Day / Night Mode Switcher Button (Auto by Time + Manual Toggle) */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-[#12141C] dark:hover:bg-[#1A1E29] text-slate-800 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs relative group"
            title={theme === 'dark' ? 'الوضع الليلي نشط (انقر للتبديل للوضع النهاري)' : 'الوضع النهاري نشط (انقر للتبديل للوضع الليلي)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C8FF] animate-spin-slow" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
            )}

            {/* Micro Mode Tag */}
            <span className="sr-only">{theme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
          </button>

          {/* 3. Wishlist Icon Button */}
          <button 
            onClick={() => handleSelectCategory('all')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-[#12141C] dark:hover:bg-[#1A1E29] text-slate-800 dark:text-slate-200 hover:text-rose-500 flex items-center justify-center relative transition-colors cursor-pointer shadow-2xs"
            title="المفضلة"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 4. Cart Icon Button: Electric Light Blue (#00C8FF) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-8 sm:h-9 px-2 sm:px-3 rounded-full bg-[#00C8FF] text-black font-extrabold text-xs flex items-center gap-1 sm:gap-1.5 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:bg-[#20d0ff] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)] transition-all cursor-pointer shrink-0 border border-[#00C8FF]"
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="font-mono text-[10px] sm:text-[11px] font-black">{cartCount}</span>
            <span className="text-[10px] opacity-70 hidden sm:inline">|</span>
            <span className="font-mono text-[10px] sm:text-[11px] font-black hidden sm:inline">{cartTotal} M</span>
          </button>

          {/* 5. User Account / Login Button */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12141C] text-slate-900 dark:text-white flex items-center gap-1 text-xs font-semibold hover:border-[#00C8FF] transition-colors cursor-pointer shadow-2xs"
                  title="حسابي"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#00C8FF]" />
                  <span className="max-w-[50px] sm:max-w-[70px] truncate hidden md:inline text-[11px]">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C8FF]/15 text-[#0090c0] dark:text-[#00C8FF]">
                          مسؤول ADMIN
                        </span>
                      )}
                    </div>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsAdminView(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#00C8FF]" />
                        <span>لوحة الإدارة</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-[#12141C] dark:hover:bg-[#1A1E29] text-slate-800 dark:text-slate-200 hover:text-[#00C8FF] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="تسجيل الدخول / حسابي"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 
        ROW 2 & 3:
        - Centered elongated Search Bar with INSTANT DROPDOWN for Categories & Sections
        - Centered Categories Bar directly underneath with the EXACT same length
      */}
      <div className="py-3 px-3 sm:px-4">
        <div ref={searchContainerRef} className="max-w-3xl w-full mx-auto flex flex-col items-center gap-2.5 relative">
          
          {/* Centered Long Search Bar */}
          <div className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="ابحث عن حذاء، مقاس، قسم، أو تشكيلة في BELLA SHOES..."
              className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm bg-white dark:bg-[#12141C] text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs font-sans"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C8FF] absolute right-4 top-1/2 -translate-y-1/2" />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 
              INSTANT POPUP DROPDOWN (تظهر فور الضغط على خانة البحث)
              Allows immediate click-to-browse for categories, models, and sizes!
            */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-[#12141C] border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 text-right animate-in fade-in duration-200">
                
                {/* 1. الأقسام الرئيسية المباشرة */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white mb-2.5">
                    <Layers className="w-4 h-4 text-[#00C8FF]" />
                    <span>تصفح الأقسام الرئيسية مباشرة:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          activeCategory === cat.id
                            ? 'bg-[#00C8FF]/15 border-[#00C8FF] text-[#00C8FF] font-bold shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#181B24] dark:hover:bg-[#202531] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#00C8FF]'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-950 dark:text-white">{cat.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. الأصناف الأكثر طلباً وبحثاً */}
                <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white mb-2">
                    <Sparkle className="w-3.5 h-3.5 text-[#00C8FF]" />
                    <span>الأصناف والموديلات الأكثر بحثاً:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPopularSearch(item.label, item.category)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-50 hover:bg-[#00C8FF]/20 dark:bg-[#181B24] dark:hover:bg-[#00C8FF]/20 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#00C8FF] transition-all flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-[#00C8FF]" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. اختيار النمرة السريعة */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      البحث السريع حسب المقاس / النمرة:
                    </span>
                    <span className="text-[10px] text-slate-400">EU Size</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handleSelectQuickSize(sz)}
                        className="w-8 h-8 rounded-lg font-mono font-bold text-xs bg-slate-100 hover:bg-[#00C8FF] hover:text-black dark:bg-[#181B24] dark:hover:bg-[#00C8FF] dark:hover:text-black text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Centered Categories Bar matching the EXACT same width of the search bar */}
          <div className="w-full flex sm:grid sm:grid-cols-5 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id && !isAdminView;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`py-2 px-3 sm:px-1 text-center whitespace-nowrap sm:truncate text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-full transition-all cursor-pointer shrink-0 sm:shrink ${
                    isActive
                      ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,200,255,0.4)] scale-[1.02] border border-[#00C8FF] font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#161922] dark:hover:bg-[#1E2330] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
};
