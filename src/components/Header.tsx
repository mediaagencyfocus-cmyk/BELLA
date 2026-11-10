import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User as UserIcon, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Truck, 
  LogOut, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles
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
    setAuthModalMode,
    settings
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categories: { id: ShoeCategory; label: string }[] = [
    { id: 'womens', label: 'الأحذية النسائية' },
    { id: 'mens', label: 'الأحذية الرجالية' },
    { id: 'kids', label: 'أحذية الأطفال' },
    { id: 'wholesale', label: 'البيع بالجملة' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0A0B0D]/95 backdrop-blur-md">
      {/* 1. Calm Delivery Ticker (شريط التوصيل الترويجي الهادئ) */}
      <div className="bg-slate-900 dark:bg-black text-slate-200 border-b border-slate-800 text-xs py-1.5 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 font-medium">
          <span className="flex items-center gap-1.5 text-white">
            <Truck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 إلى 48 ساعة</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>الدفع عند الاستلام مع إمكانية القياس والمعاينة قبل الدفع</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>توصيل مجاني 100% عند طلب زوجين من الأحذية أو أكثر</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-[#00FF66]">
            <span>BELLA SHOES · الأناقة تبدأ من خطواتك وفخامة لا تضاهى</span>
          </span>
          {/* Duplicate set for continuous marquee loop */}
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <Truck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>التوصيل السريع لجميع أنحاء المغرب خلال 24 إلى 48 ساعة</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>الدفع عند الاستلام مع إمكانية القياس والمعاينة قبل الدفع</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>توصيل مجاني 100% عند طلب زوجين من الأحذية أو أكثر</span>
          </span>
        </div>
      </div>

      {/* 2. Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <span>🇲🇦</span>
            <span>المغرب (MAD درهم)</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline-block">خدمة الزبائن: {settings.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Day & Night Mode Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs"
            title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>الوضع النهاري</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>الوضع الليلي</span>
              </>
            )}
          </button>

          {/* Admin shortcut if logged in */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/40 font-bold hover:bg-[#00FF66]/25 transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{isAdminView ? 'العودة للمتجر' : 'لوحة الإدارة'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Brand & Search & Cart row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveCategory('all'); setIsAdminView(false); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-[#111318] border border-[#00FF66]/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.25)] group-hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all">
            <span className="text-[#00FF66] font-black text-xl tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                BELLA <span className="text-[#00FF66]">SHOES</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider">
              LUXURY FOOTWEAR · MAROC
            </span>
          </div>
        </div>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن حذاء، مقاس، أو لون مفضل..."
              className="w-full pl-4 pr-11 py-2.5 rounded-full text-sm bg-slate-100 dark:bg-[#12141A] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons: Cart, Wishlist, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Button (Matching the iconic green pill: MAD 0 + bag) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#00FF66] text-black font-bold text-sm shadow-[0_0_15px_rgba(0,255,102,0.35)] hover:bg-[#05ea5f] hover:shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-[#00FF66] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-[#00FF66]/50">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-mono font-black">{cartTotal} MAD</span>
          </button>

          {/* Wishlist count */}
          <button 
            onClick={() => setActiveCategory('all')}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors relative"
            title="المفضلة"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-[#00FF66] transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span className="max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#12141A] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF66]/20 text-[#00FF66]">
                          مسؤول النظام ADMIN
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
                        <span>لوحة تحكم الإدارة</span>
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
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دخول / حسابي</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Four Main Categories Navigation Bar (Strictly 4 categories as required + All) */}
      <nav className="border-t border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-[#0C0E12]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
            {/* All Shoes button */}
            <button
              onClick={() => { setActiveCategory('all'); setIsAdminView(false); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all' && !isAdminView
                  ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
              }`}
            >
              جميع الأحذية
            </button>

            {/* Exactly 4 Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setIsAdminView(false); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id && !isAdminView
                    ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
