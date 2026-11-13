import React from 'react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon } from './SocialIcons';
import { buildWhatsAppLink } from '../utils/phone';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  const greeting = 'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.';
  const waUrl = buildWhatsAppLink(settings.whatsapp, greeting);

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 flex items-center select-none">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 rounded-full transition-transform hover:scale-[1.03]"
        title="تواصل معنا عبر واتساب مباشرة"
        aria-label="تواصل معنا عبر واتساب مباشرة"
      >
        <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#00C8FF] text-black flex items-center justify-center whatsapp-float-btn border border-black/15 shadow-[0_6px_22px_rgba(0,200,255,0.4)]">
          <WhatsAppIcon className="w-6 h-6 fill-black" />
        </div>

        <span className="hidden md:inline-flex px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#111319]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold shadow-lg">
          تواصل معنا عبر واتساب
        </span>
      </a>
    </div>
  );
};
