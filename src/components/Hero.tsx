import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setActiveCategory, openProductModal, products } = useStore();

  const featuredShoe = products[0] || null;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0A0B0D] border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Right column: Content in RTL */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 mb-6 font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
              <span>الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.25] mb-5">
              اكتشف أحدث تشكيلات الأحذية الفاخرة مع{' '}
              <span className="text-[#00FF66] drop-shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                BELLA SHOES
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-xl leading-relaxed">
              جودة وأناقة في كل خطوة تناسب جميع الأذواق والمناسبات. تصاميم حصرية مصنوعة من أجود أنواع الجلود الطبيعية مع ضمان الراحة التامة على مدار اليوم.
            </p>

            {/* Trust bullet highlights */}
            <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>جلود طبيعية مختارة 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>معاينة وقياس قبل الدفع عند الباب</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>توصيل سريع 24 ساعة بالمغرب</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>توصيل مجاني عند شراء زوجين+</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveCategory('all')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00FF66] text-black font-extrabold text-sm sm:text-base hover:bg-[#05ea5f] shadow-[0_0_25px_rgba(0,255,102,0.4)] hover:shadow-[0_0_35px_rgba(0,255,102,0.6)] transition-all cursor-pointer"
              >
                <span>تسوق مجموعتك المفضلة</span>
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {featuredShoe && (
                <button
                  onClick={() => openProductModal(featuredShoe)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#00FF66]" />
                  <span>تفاصيل الحذاء الملكي</span>
                </button>
              )}
            </div>
          </div>

          {/* Left column: Hero Showcase Card with High-Res Shoe image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#13161F] dark:to-[#0B0D12] border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-2xl group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40">
                <img
                  src="/src/assets/images/bella_womens_heels_1794318693049.jpg"
                  alt="BELLA SHOES Luxury Heels"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#00FF66]/40 text-[#00FF66] text-xs font-bold">
                  تشكيلة الموسم الفاخرة
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs">
                  <span className="text-slate-400">ابتداءً من: </span>
                  <span className="font-mono font-bold text-[#00FF66]">420 MAD</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Bella Royale Haute Couture
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أحذية تناسب جميع الأذواق والمناسبات الراقية
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
                  متوفر الآن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
