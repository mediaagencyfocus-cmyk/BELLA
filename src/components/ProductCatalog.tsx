import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, Flame, Percent, Star, Layers, SearchX, Tag } from 'lucide-react';
import { ShoeCategory } from '../types';

export const ProductCatalog: React.FC = () => {
  const { 
    products, 
    activeCategory, 
    activeTab, 
    setActiveTab, 
    searchQuery,
    setSearchQuery,
    setActiveCategory
  } = useStore();

  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  const categoryTitles = {
    all: 'أفضل تشكيلات وموديلات الأحذية الفاخرة',
    womens: 'الأحذية النسائية الفاخرة',
    mens: 'الأحذية الرجالية الراقية',
    kids: 'أحذية الأطفال المريحة والمتينة',
    wholesale: 'عروض وسلاسل البيع بالجملة للتجار'
  };

  const categoryDescriptions = {
    all: 'أرقى الموديلات المصنوعة يدوياً من جلود طبيعية 100% مع ضمان القياس عند التوصيل والدفع عند الاستلام.',
    womens: 'كعب عالي ملكي، صنادل أنيقة، وسنيكرز نسائي راقي يمنحك الراحة والفخامة في كل مناسبة.',
    mens: 'أحذية أكسفورد كلاسيكية، أحذية لوفر، وسنيكرز كاجوال عصري للرجل الباحث عن التميز.',
    kids: 'تصاميم مرحة، خفيفة، ومريحة تدعم حركة الطفل وحماية قدميه بكل أمان.',
    wholesale: 'سلاسل كراتين مشكلة بأسعار تفضيلية للمحلات التجارية وبائعي التجزئة في المغرب.'
  };

  // Subcategory filters corresponding to each category
  const subcategoryMap: Record<ShoeCategory, { id: string; label: string }[]> = {
    womens: [
      { id: 'all', label: 'جميع النسائي' },
      { id: 'كعب', label: 'كعب عالي ملكي' },
      { id: 'سنيكرز', label: 'سنيكرز نسائي راقي' }
    ],
    mens: [
      { id: 'all', label: 'جميع الرجالي' },
      { id: 'أكسفورد', label: 'أكسفورد كلاسيكي' },
      { id: 'سنيكرز', label: 'سنيكرز كاجوال فخم' }
    ],
    kids: [
      { id: 'all', label: 'جميع أحذية الأطفال' },
      { id: 'مريح', label: 'أحذية مريحة ومرنة' },
      { id: 'رياضي', label: 'تصاميم رياضية ملونة' }
    ],
    wholesale: [
      { id: 'all', label: 'عروض الجملة الكاملة' },
      { id: 'سلسلة', label: 'سلاسل كراتين مشكلة' }
    ]
  };

  // Filter products by category, subcategory, sub-tab, and search query
  const filteredProducts = products.filter((prod) => {
    // 1. Category filter
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    // 2. Subcategory / model filter
    if (activeCategory !== 'all' && activeSubcategory !== 'all') {
      const matchSub = prod.name.includes(activeSubcategory) || prod.description.includes(activeSubcategory);
      if (!matchSub) return false;
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchColor = prod.colors.some(c => c.name.toLowerCase().includes(q));
      const matchSize = prod.sizes.some(s => s.toString() === q);
      if (!matchName && !matchDesc && !matchColor && !matchSize) {
        return false;
      }
    }

    // 4. Sub-tab filter (for 'all' category)
    if (activeCategory === 'all') {
      if (activeTab === 'bestseller') return prod.isBestseller || prod.rating >= 4.9;
      if (activeTab === 'new') return prod.isNew;
      if (activeTab === 'offers') return !!prod.discount || (prod.oldPrice && prod.oldPrice > prod.price);
      if (activeTab === 'recommended') return prod.rating >= 4.8;
    }

    return true;
  });

  return (
    <section id="catalog-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right scroll-mt-24">
      {/* Catalog Header & Sub-Tabs Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#00C8FF] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00C8FF]" />
            <span className="font-sans">المعدات والتشكيلات المعتمدة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-brand">
            {categoryTitles[activeCategory]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-sans">
            {categoryDescriptions[activeCategory]}
          </p>
        </div>

        {/* Dynamic Category / Sub-category Tabs */}
        {activeCategory !== 'all' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-white dark:bg-[#12141C] p-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xs">
            {subcategoryMap[activeCategory].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeSubcategory === sub.id
                    ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-white dark:bg-[#12141C] p-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل</span>
            </button>

            <button
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'bestseller'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>الأكثر مبيعاً</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>المنتجات الجديدة</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'offers'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-rose-500" />
              <span>التخفيضات والعروض</span>
            </button>

            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'recommended'
                  ? 'bg-[#00C8FF] text-black shadow-xs font-black border border-[#00C8FF]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1E29]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>المقترحة لك</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Search Notification */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#12141C] border-2 border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
          <span className="text-slate-800 dark:text-slate-200">
            نتائج البحث عن:{' '}
            <strong className="text-[#00C8FF]">"{searchQuery}"</strong> ({filteredProducts.length} حذاء متوفر)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-rose-500 hover:underline font-bold cursor-pointer"
          >
            إلغاء البحث
          </button>
        </div>
      )}

      {/* Responsive Grid of Shoe Cards (2 col mobile, 3 col tablet, 4 col desktop) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#12141C] border-2 border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
            لم نجد أحذية تطابق هذا القسم أو المعيار
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            جرب اختيار قسم آخر أو إلغاء التصفية للاطلاع على كافة الموديلات المتوفرة بالمخزون.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveSubcategory('all');
              setActiveTab('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full bg-[#00C8FF] text-black font-extrabold text-xs shadow-md hover:bg-[#20d0ff] border border-[#00C8FF] cursor-pointer"
          >
            عرض جميع الأحذية
          </button>
        </div>
      )}
    </section>
  );
};
