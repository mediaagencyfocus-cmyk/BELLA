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
    <section className="py-8 bg-slate-50 dark:bg-[#0E1015] border-b border-slate-200 dark:border-slate-800/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-5 bg-white dark:bg-[#141720] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-[#00FF66]/50 dark:hover:border-[#00FF66]/40 transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 text-[#00FF66] group-hover:bg-[#00FF66]/10 transition-colors">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#00FF66] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
