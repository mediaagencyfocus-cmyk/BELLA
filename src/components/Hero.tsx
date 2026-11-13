import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setActiveCategory, setShowWishlistOnly } = useStore();

  const handleShopNow = () => {
    setShowWishlistOnly(false);
    setActiveCategory('all');
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWholesale = () => {
    setShowWishlistOnly(false);
    setActiveCategory('wholesale');
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50/50 dark:bg-[#08090C] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-6 lg:gap-10">
          {/* Editorial Copy & Primary CTA (Right column in RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-right py-2 lg:py-4">
            <div className="space-y-4 sm:space-y-5">
              {/* Quiet unboxed editorial kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="text-[#0099CC] dark:text-[#00C8FF] font-bold">تشكيلة 2026</span>
                <span aria-hidden="true">·</span>
                <span>جلود طبيعية مختارة</span>
                <span aria-hidden="true">·</span>
                <span>المغرب</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-950 dark:text-white leading-[1.2] text-balance font-brand">
                الأناقة تبدأ من خطواتك الأولى
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                تشكيلة متكاملة من الأحذية النسائية والرجالية وأحذية الأطفال، مصممة بمعايير حرفية عالية تجمع بين راحة الارتداء وفخامة الحضور في كل مناسبة.
              </p>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleShopNow}
                  className="px-6 py-3 rounded-full bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(0,200,255,0.35)] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>تسوق التشكيلة الجديدة</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleWholesale}
                  className="px-5 py-3 rounded-full bg-white dark:bg-[#111319] hover:bg-slate-100 dark:hover:bg-[#181B24] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  عروض الجملة للتجار
                </button>
              </div>
            </div>

            {/* Clean Architectural Trust Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800/80">
              <div>
                <span className="block text-sm sm:text-base font-black text-slate-950 dark:text-white font-mono tabular-nums">
                  24 ساعة
                </span>
                <span className="block text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  توصيل سريع بالمغرب
                </span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-black text-slate-950 dark:text-white font-mono tabular-nums">
                  100%
                </span>
                <span className="block text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  جلود وخامات أصلية
                </span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-black text-slate-950 dark:text-white font-mono tabular-nums">
                  عند الباب
                </span>
                <span className="block text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  القياس قبل الدفع
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Footwear Studio Showcase (Left column in RTL) */}
          <div className="lg:col-span-7 flex">
            <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:min-h-[380px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg">
              <img
                src="/src/assets/images/bella_hero_editorial_1794577994863.jpg"
                alt="تشكيلة أحذية BELLA SHOES الفاخرة — كعب نسائي، أكسفورد رجالي، وسنيكرز فاخر"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Measured Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between text-white">
                <div className="text-right">
                  <p className="text-[11px] sm:text-xs text-white/80 font-medium">
                    الدار البيضاء · توصيل لجميع المدن
                  </p>
                  <p className="text-sm sm:text-base font-bold">
                    اختيارات الموسم — النسائي، الرجالي والأطفال
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-mono text-[#00C8FF] font-bold">
                  BELLA SHOES
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
