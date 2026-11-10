import React from 'react';
import { Truck, Gift, ShieldCheck, RotateCcw } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'توصيل سريع 24 ساعة',
      desc: 'شحن فوري ومضمون لجميع مدن وقرى المملكة المغربية.'
    },
    {
      icon: Gift,
      title: 'توصيل مجاني عند شراء زوجين',
      desc: 'استفد من التوصيل المجاني بالكامل عند طلب زوجين أو أكثر.'
    },
    {
      icon: ShieldCheck,
      title: 'منتجات أصلية ومضمونة 100%',
      desc: 'أحذية وجلود طبيعية ممتازة ومصنعة بأعلى معايير الجودة.'
    },
    {
      icon: RotateCcw,
      title: 'الدفع عند الاستلام',
      desc: 'عاين حذاءك وقس مقاسك وتأكد من جودته ثم ادفع بأمان عند الباب.'
    }
  ];

  return (
    <section className="py-12 bg-white border-t-2 border-slate-200 dark:border-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-5 bg-white border-2 border-slate-200 dark:border-black shadow-xs hover:border-[#00C8FF] transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white border-2 border-slate-200 dark:border-black flex items-center justify-center shrink-0 text-[#00C8FF] group-hover:bg-[#00C8FF]/10 transition-colors">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-slate-950 dark:text-black mb-1 group-hover:text-[#00C8FF] transition-colors font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-700 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
