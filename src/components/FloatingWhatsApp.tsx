import React from 'react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon } from './SocialIcons';
import { buildWhatsAppLink } from '../utils/phone';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  const greeting = 'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.';
  const waUrl = buildWhatsAppLink(settings.whatsapp, greeting);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 group select-none">
      {/* WhatsApp Button Circle with pulsing red dot badge */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 p-1 rounded-full group-hover:scale-105 transition-transform"
        title="تواصل معنا عبر واتساب مباشرة"
      >
        {/* Responsive WhatsApp Circle (w-12 h-12 on mobile, w-14 h-14 on tablet/PC) */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00C8FF] text-black flex items-center justify-center whatsapp-float-btn group-hover:scale-110 transition-all border-2 border-black/10 shadow-[0_0_20px_rgba(0,200,255,0.45)]">
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-black" />

          {/* Interactive Red Notification Dot on top right */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 border-2 border-white dark:border-[#08090C] flex items-center justify-center">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
          </span>
        </div>

        {/* Crisp Luxury Pill: Responsive text, fits mobile and desktop */}
        <div className="hidden xs:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white dark:bg-[#12141C] border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px] sm:text-xs font-bold shadow-xl transition-all">
          تواصل معنا عبر واتساب
        </div>
      </a>
    </div>
  );
};
