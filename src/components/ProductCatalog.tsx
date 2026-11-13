import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, Flame, Percent, Star, Layers, SearchX, Tag, Heart, X } from 'lucide-react';
import { ShoeCategory } from '../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    activeCategory,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    wishlist,
    showWishlistOnly,
    setShowWishlistOnly,
  } = useStore();

  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Reset subcategory when changing top-level category so users always see matching items
  useEffect(() => {
    setActiveSubcategory('all');
  }, [activeCategory]);

  const categoryTitles = {
    all: 'تشكيلات وموديلات الأحذية الفاخرة',
    womens: 'الأحذية النسائية الفاخرة',
    mens: 'الأحذية الرجالية الراقية',
    kids: 'أحذية الأطفال المريحة والمتينة',
    wholesale: 'عروض وسلاسل البيع بالجملة للتجار',
  };

  const categoryDescriptions = {
    all: 'أرقى الموديلات المصنوعة من جلود مختارة مع إمكانية القياس عند الباب والدفع عند الاستلام.',
    womens: 'كعب عالي ملكي، صنادل أنيقة، وسنيكرز نسائي يمنحك الراحة والفخامة في كل مناسبة.',
    mens: 'أحذية أكسفورد كلاسيكية، لوفر، وسنيكرز كاجوال للرجل الباحث عن التميز.',
    kids: 'تصاميم خفيفة ومريحة تدعم حركة الطفل طوال اليوم بكل أمان.',
    wholesale: 'سلاسل وكراتين مشكلة بأسعار تفضيلية للمحلات التجارية وبائعي التجزئة بالمغرب.',
  };

  const subcategoryMap: Record<ShoeCategory, { id: string; label: string }[]> = {
    womens: [
      { id: 'all', label: 'جميع النسائي' },
      { id: 'كعب', label: 'كعب عالي ملكي' },
      { id: 'سنيكرز', label: 'سنيكرز نسائي راقي' },
    ],
    mens: [
      { id: 'all', label: 'جميع الرجالي' },
      { id: 'أكسفورد', label: 'أكسفورد كلاسيكي' },
      { id: 'سنيكرز', label: 'سنيكرز كاجوال فخم' },
    ],
    kids: [
      { id: 'all', label: 'جميع أحذية الأطفال' },
      { id: 'مريح', label: 'أحذية مريحة ومرنة' },
      { id: 'رياضي', label: 'تصاميم رياضية ملونة' },
    ],
    wholesale: [
      { id: 'all', label: 'عروض الجملة الكاملة' },
      { id: 'سلسلة', label: 'سلاسل كراتين مشكلة' },
    ],
  };

  // Filter products by wishlist, category, subcategory, sub-tab, and search query
  const filteredProducts = products.filter((prod) => {
    if (showWishlistOnly && !wishlist.includes(prod.id)) {
      return false;
    }

    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    if (activeCategory !== 'all' && activeSubcategory !== 'all') {
      const matchSub =
        prod.name.includes(activeSubcategory) || prod.description.includes(activeSubcategory);
      if (!matchSub) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchColor = prod.colors.some((c) => c.name.toLowerCase().includes(q));
      const matchSize = prod.sizes.some((s) => s.toString() === q);
      if (!matchName && !matchDesc && !matchColor && !matchSize) {
        return false;
      }
    }

    if (activeCategory === 'all' && !showWishlistOnly) {
      if (activeTab === 'bestseller') return prod.isBestseller || prod.rating >= 4.9;
      if (activeTab === 'new') return prod.isNew;
      if (activeTab === 'offers')
        return !!prod.discount || (prod.oldPrice && prod.oldPrice > prod.price);
      if (activeTab === 'recommended') return prod.rating >= 4.8;
    }

    return true;
  });

  const handleResetFilters = () => {
    setShowWishlistOnly(false);
    setActiveCategory('all');
    setActiveSubcategory('all');
    setActiveTab('all');
    setSearchQuery('');
  };

  return (
    <section
      id="catalog-section"
      className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right scroll-mt-24"
    >
      {/* Catalog Header & Segmented Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7 sm:mb-9">
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#0099CC] dark:text-[#00C8FF] tracking-wider mb-1.5 font-sans">
            {showWishlistOnly ? 'قائمة المفضلة المختارة' : 'BELLA SHOES · التشكيلة المعتمدة'}
          </p>

          <h2 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white font-brand text-balance">
            {showWishlistOnly ? 'أحذيتي المفضلة' : categoryTitles[activeCategory]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl font-sans leading-relaxed">
            {showWishlistOnly
              ? 'الأحذية التي قمت بحفظها للمراجعة والطلب السريع في أي وقت.'
              : categoryDescriptions[activeCategory]}
          </p>
        </div>

        {/* Dynamic Category / Sub-category Segmented Controls */}
        {!showWishlistOnly && activeCategory !== 'all' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100/80 dark:bg-[#111319] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-full">
            {subcategoryMap[activeCategory].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubcategory(sub.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeSubcategory === sub.id
                    ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            ))}
          </div>
        ) : !showWishlistOnly ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100/80 dark:bg-[#111319] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'all'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'bestseller'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>الأكثر مبيعاً</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'new'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0099CC] dark:text-[#00C8FF]" />
              <span>جديدنا</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'offers'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-rose-500" />
              <span>التخفيضات</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'recommended'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#181B24]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>المقترحة لك</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowWishlistOnly(false)}
            className="self-start lg:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#111319] dark:hover:bg-[#181B24] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>العودة لجميع التشكيلات</span>
          </button>
        )}
      </div>

      {/* Active Search Banner */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111319] border border-slate-200/80 dark:border-slate-800 text-xs">
          <span className="text-slate-800 dark:text-slate-200 tabular-nums">
            نتائج البحث عن:{' '}
            <strong className="text-[#0099CC] dark:text-[#00C8FF]">"{searchQuery}"</strong> (
            {filteredProducts.length} حذاء متوفر)
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-rose-500 hover:underline font-bold cursor-pointer shrink-0"
          >
            إلغاء البحث
          </button>
        </div>
      )}

      {/* Responsive Product Grid: 2 cols Mobile, 3 cols Tablet, 4 cols Desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-14 text-center rounded-2xl bg-slate-50/70 dark:bg-[#111319] border border-slate-200/80 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-[#181B24] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-400">
            {showWishlistOnly ? (
              <Heart className="w-7 h-7 text-rose-400" />
            ) : (
              <SearchX className="w-7 h-7" />
            )}
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
            {showWishlistOnly
              ? 'قائمة المفضلة فارغة حالياً'
              : 'لم نجد أحذية تطابق هذا القسم أو المعيار'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            {showWishlistOnly
              ? 'اضغط على أيقونة القلب في أي حذاء لحفظه هنا والرجوع إليه بسهولة.'
              : 'جرب اختيار قسم آخر أو إلغاء التصفية للاطلاع على كافة الموديلات المتوفرة بالمخزون.'}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-xs shadow-sm transition-colors cursor-pointer"
          >
            عرض جميع الأحذية
          </button>
        </div>
      )}
    </section>
  );
};
