import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleShopNow = () => {
    setActiveCategory('all');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-6 sm:py-8 border-b border-slate-200 dark:border-black transition-colors">
      {/* Subtle luxury ambient glow in light blue */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-28 bg-[#00C8FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Centered Luxury Action Box: "تسوق مجموعتك المفضلة" */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-white border-2 border-slate-200 dark:border-black shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1 text-xs text-slate-800 dark:text-black font-semibold">
            <Sparkles className="w-4 h-4 text-[#00C8FF]" />
            <span className="font-sans">أحدث صيحات الأحذية الفاخرة لعام 2026</span>
          </div>

          <button
            onClick={handleShopNow}
            className="flex items-center gap-2.5 px-7 py-3 rounded-xl sm:rounded-full bg-[#00C8FF] text-black font-black text-sm hover:bg-[#20d0ff] shadow-[0_0_25px_rgba(0,200,255,0.4)] hover:shadow-[0_0_35px_rgba(0,200,255,0.6)] transition-all cursor-pointer transform hover:scale-[1.02] border border-[#00C8FF] dark:border-black"
          >
            <span>تسوق مجموعتك المفضلة</span>
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </section>
  );
};
