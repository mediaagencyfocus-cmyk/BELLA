import React, { useState } from 'react';
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
  X
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

  const categories: { id: ShoeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'جميع الأحذية' },
    { id: 'womens', label: 'الأحذية النسائية' },
    { id: 'mens', label: 'الأحذية الرجالية' },
    { id: 'kids', label: 'أحذية الأطفال' },
    { id: 'wholesale', label: 'البيع بالجملة' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0A0B0D]/95 backdrop-blur-md">
      {/* 
        ROW 1:
        - Right: BELLA SHOES brand name
        - Center: Calm animated ticker flowing inside this space
        - Left: Exactly uniform icons (🇲🇦 MAD, Theme Switcher, Wishlist, Cart, Login)
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-6 border-b border-slate-100 dark:border-slate-800/60">
        
        {/* RIGHT (in RTL): BELLA SHOES Brand */}
        <div 
          onClick={() => { setActiveCategory('all'); setIsAdminView(false); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-black dark:bg-[#12141A] border border-[#00FF66]/50 flex items-center justify-center shadow-[0_0_12px_rgba(0,255,102,0.25)] group-hover:shadow-[0_0_18px_rgba(0,255,102,0.4)] transition-all">
            <span className="text-[#00FF66] font-black text-lg tracking-tight font-brand">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-wider text-slate-900 dark:text-white font-brand leading-none">
              BELLA <span className="text-[#00FF66]">SHOES</span>
            </span>
            <span className="text-[9px] text-slate-400 font-sans tracking-widest mt-0.5 uppercase">
              Luxury Footwear
            </span>
          </div>
        </div>

        {/* CENTER: Delivery Ticker flowing smoothly in this space between brand and left icons */}
        <div className="flex-1 mx-2 sm:mx-4 overflow-hidden relative select-none hidden md:block">
          {/* Subtle gradient edge masks for luxury fade effect */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0A0B0D] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0A0B0D] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 ساعة</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>الدفع عند الاستلام مع إمكانية القياس قبل الدفع</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>توصيل مجاني 100% عند طلب زوجين أو أكثر</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-[#00FF66] font-semibold">
              الأناقة تبدأ من خطواتك · BELLA SHOES
            </span>

            {/* Repeat loop */}
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 ساعة</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>الدفع عند الاستلام مع إمكانية القياس قبل الدفع</span>
            </span>
          </div>
        </div>

        {/* LEFT (in RTL): Exactly Uniform Luxury Utility Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* 1. Currency Icon / Badge: 🇲🇦 MAD */}
          <div 
            className="h-9 px-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141720] flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold select-none shadow-2xs"
            title="العملة المعتمدة: الدرهم المغربي"
          >
            <span className="text-sm">🇲🇦</span>
            <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">MAD</span>
          </div>

          {/* 2. Day / Night Mode Switcher Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-[#141720] dark:hover:bg-[#1C212D] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* 3. Wishlist Icon Button */}
          <button 
            onClick={() => setActiveCategory('all')}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-[#141720] dark:hover:bg-[#1C212D] text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center relative transition-colors cursor-pointer shadow-2xs"
            title="المفضلة"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 4. Cart Icon Button (Matching Size, Glowing neon green, item counter & total) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-9 px-3 rounded-full bg-[#00FF66] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.35)] hover:bg-[#05ea5f] hover:shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-all cursor-pointer shrink-0"
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="font-mono text-[11px] font-black">{cartCount}</span>
            <span className="text-[10px] opacity-70">|</span>
            <span className="font-mono text-[11px] font-black">{cartTotal} M</span>
          </button>

          {/* 5. User Account / Login Button */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-9 px-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141720] text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs font-semibold hover:border-[#00FF66] transition-colors cursor-pointer shadow-2xs"
                  title="حسابي"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span className="max-w-[60px] truncate hidden sm:inline text-[11px]">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#12141A] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF66]/20 text-[#00FF66]">
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
                        className="w-full text-right px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#00FF66]" />
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
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-[#141720] dark:hover:bg-[#1C212D] text-slate-700 dark:text-slate-300 hover:text-[#00FF66] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="تسجيل الدخول / حسابي"
              >
                <UserIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 
        ROW 2 & 3:
        - Centered elongated Search Bar
        - Centered Categories Bar directly underneath with the EXACT same length
      */}
      <div className="py-3 px-4">
        <div className="max-w-3xl w-full mx-auto flex flex-col items-center gap-2.5">
          
          {/* Centered Long Search Bar */}
          <div className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن حذاء، مقاس، لون، أو تشكيلة في BELLA SHOES..."
              className="w-full pl-10 pr-11 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100 dark:bg-[#12141A] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all placeholder:text-slate-400 shadow-2xs font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Centered Categories Bar matching the EXACT same width of the search bar */}
          <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id && !isAdminView;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setIsAdminView(false); }}
                  className={`py-2 px-1 text-center truncate text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)] scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#13161F] dark:hover:bg-[#1A1E2B] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/80'
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
