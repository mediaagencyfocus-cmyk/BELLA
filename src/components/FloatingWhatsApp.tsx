import React from 'react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon } from './SocialIcons';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const greeting = encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.'
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 group select-none">
      {/* WhatsApp Button Circle with pulsing red dot badge */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2.5 p-1 rounded-full group-hover:scale-105 transition-transform"
        title="تواصل معنا عبر واتساب"
      >
        {/* Light Blue WhatsApp Circle with Official WhatsApp SVG Logo */}
        <div className="relative w-14 h-14 rounded-full bg-[#00C8FF] text-black flex items-center justify-center whatsapp-float-btn group-hover:scale-110 transition-all border-2 border-black/10 shadow-[0_0_20px_rgba(0,200,255,0.45)]">
          <WhatsAppIcon className="w-7 h-7 fill-black" />

          {/* Interactive Red Notification Dot on top right */}
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-[#08090C] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </span>
        </div>

        {/* Crisp Luxury Pill with text "تواصل معنا عبر واتساب" */}
        <div className="px-4 py-2 rounded-full bg-white dark:bg-[#12141C] border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold shadow-xl transition-all">
          تواصل معنا عبر واتساب
        </div>
      </a>
    </div>
  );
};
