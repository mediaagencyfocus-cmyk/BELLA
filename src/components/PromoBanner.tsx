import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromoBanner: React.FC = () => {
  const { setActiveCategory } = useStore();
  const [copied, setCopied] = useState(false);

  const couponCode = 'BELLA20';

  const copyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#10131A] to-black text-white border border-slate-800 shadow-2xl overflow-hidden text-right">
        {/* Subtle grid pattern background and glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF66]/15 border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-[#00FF66]" />
              <span>عرض حصري ومحدود</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 leading-tight">
              تخفيضات فلاش بيلا شوز: خصم إضافي 20% مع كود{' '}
              <span className="text-[#00FF66]">"{couponCode}"</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              استفد الآن من تخفيضات استثنائية على تشكيلات الأحذية الرجالية والنسائية وأحذية الأطفال مع التوصيل السريع خلال 24 ساعة والدفع عند الاستلام.
            </p>
          </div>

          {/* Action and Coupon Box */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Copyable coupon button */}
            <button
              onClick={copyCoupon}
              className="px-4 py-2.5 rounded-2xl border-2 border-dashed border-[#00FF66]/60 bg-black/60 text-white text-xs font-bold flex items-center gap-2 hover:bg-[#00FF66]/10 transition-colors cursor-pointer"
              title="انقر لنسخ كود الخصم"
            >
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-normal">كود التخفيض:</span>
                <span className="font-mono font-black text-[#00FF66] text-sm tracking-wider">{couponCode}</span>
              </div>
              {copied ? (
                <Check className="w-4 h-4 text-[#00FF66]" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Shop now CTA */}
            <button
              onClick={() => setActiveCategory('all')}
              className="px-5 py-3 rounded-2xl bg-[#00FF66] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.35)] hover:bg-[#05ea5f] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>تسوق العروض الآن</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
