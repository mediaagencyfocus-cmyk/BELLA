import React, { useState } from 'react';
import { Truck, Gift, ShieldCheck, RotateCcw } from 'lucide-react';
import { SHOE_IMAGES } from '../assets/shoeImages';

export const FeatureCards: React.FC = () => {
  const [atelierImgError, setAtelierImgError] = useState(false);

  const features = [
    {
      icon: Truck,
      title: 'توصيل سريع 24 ساعة',
      desc: 'شحن فوري ومضمون لجميع مدن وقرى المملكة المغربية.',
    },
    {
      icon: Gift,
      title: 'توصيل مجاني عند شراء زوجين',
      desc: 'استفد من التوصيل المجاني بالكامل عند طلب زوجين أو أكثر.',
    },
    {
      icon: ShieldCheck,
      title: 'منتجات أصلية ومضمونة 100%',
      desc: 'أحذية وجلود طبيعية ممتازة ومصنعة بأعلى معايير الجودة.',
    },
    {
      icon: RotateCcw,
      title: 'الدفع عند الاستلام',
      desc: 'عاين حذاءك وقس مقاسك وتأكد من جودته ثم ادفع بأمان عند الباب.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-[#0A0B0E] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch min-w-0">
          {/* Editorial Craftsmanship Card (5 cols on desktop) */}
          <div className="lg:col-span-5 min-w-0 flex">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {!atelierImgError ? (
                <img
                  src={SHOE_IMAGES.atelierCraft}
                  alt="حرفية صناعة الجلود والأحذية الفاخرة في مشغل BELLA SHOES"
                  referrerPolicy="no-referrer"
                  onError={() => setAtelierImgError(true)}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[#00C8FF] font-brand font-bold text-lg">
                  BELLA ATELIER
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 text-right text-white">
                <p className="text-[11px] font-bold text-[#00C8FF] mb-1">
                  التزام الجودة · BELLA ATELIER
                </p>
                <h3 className="text-base sm:text-lg font-black leading-snug text-balance">
                  جودة عالمية من المشغل إلى باب منزلك
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  ننتقي خامات الجلد بعناية ونضمن لك معاينة المقاس قبل الأداء.
                </p>
              </div>
            </div>
          </div>

          {/* Four Store Guarantees Grid (7 cols on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white dark:bg-[#111319] border border-slate-200/80 dark:border-slate-800 hover:border-[#00C8FF] dark:hover:border-[#00C8FF] transition-colors flex flex-col justify-between gap-4 text-right"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-[#181B24] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-[#0099CC] dark:text-[#00C8FF]">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-1 font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
