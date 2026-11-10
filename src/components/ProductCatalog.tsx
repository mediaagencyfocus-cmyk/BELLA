import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, Flame, Percent, Star, Layers, SearchX } from 'lucide-react';

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

  // Filter products by category, sub-tab, and search query
  const filteredProducts = products.filter((prod) => {
    // 1. Category filter
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    // 2. Search query filter
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

    // 3. Sub-tab filter
    if (activeTab === 'bestseller') return prod.isBestseller || prod.rating >= 4.9;
    if (activeTab === 'new') return prod.isNew;
    if (activeTab === 'offers') return !!prod.discount || (prod.oldPrice && prod.oldPrice > prod.price);
    if (activeTab === 'recommended') return prod.rating >= 4.8;

    return true;
  });

  return (
    <section id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right scroll-mt-24">
      {/* Catalog Header & Sub-Tabs Row (Matching Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#00FF66] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
            <span>المعدات والمنتجات</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {categoryTitles[activeCategory]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {categoryDescriptions[activeCategory]}
          </p>
        </div>

        {/* Filter Tabs matching the screenshot (الكل، الأكثر مبيعاً، المنتجات الجديدة، التخفيضات والعروض، المقترحة لك) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-slate-100 dark:bg-[#12141C] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#00FF66] text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الكل</span>
          </button>

          <button
            onClick={() => setActiveTab('bestseller')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bestseller'
                ? 'bg-[#00FF66] text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>الأكثر مبيعاً</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-[#00FF66] text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>المنتجات الجديدة</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#00FF66] text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-rose-500" />
            <span>التخفيضات والعروض</span>
          </button>

          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'recommended'
                ? 'bg-[#00FF66] text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>المقترحة لك</span>
          </button>
        </div>
      </div>

      {/* Active Search Notification */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs">
          <span>
            نتائج البحث عن:{' '}
            <strong className="text-[#00FF66]">"{searchQuery}"</strong> ({filteredProducts.length} حذاء)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-rose-500 hover:underline font-bold"
          >
            إلغاء البحث
          </button>
        </div>
      )}

      {/* Grid of Shoe Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-1">
            لم نجد أحذية تطابق اختيارك
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            جرب اختيار قسم آخر أو مسح كلمات البحث للاطلاع على كافة الموديلات.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveTab('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-full bg-[#00FF66] text-black font-bold text-xs shadow-md hover:bg-[#05ea5f]"
          >
            عرض جميع الأحذية
          </button>
        </div>
      )}
    </section>
  );
};
