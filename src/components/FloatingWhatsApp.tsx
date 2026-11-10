import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
        {/* Glowing Green WhatsApp Circle */}
        <div className="relative w-14 h-14 rounded-full bg-[#00FF66] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.5)] group-hover:shadow-[0_0_30px_rgba(0,255,102,0.7)] transition-all">
          <MessageCircle className="w-7 h-7 fill-black stroke-black" />

          {/* Interactive Red Notification Dot on top right */}
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-black flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </span>
        </div>

        {/* Black Pill with text "تواصل معنا عبر واتساب" */}
        <div className="px-4 py-2 rounded-full bg-black/90 dark:bg-[#12141C]/95 backdrop-blur-md border border-slate-700/80 text-white text-xs font-bold shadow-xl transition-all">
          تواصل معنا عبر واتساب
        </div>
      </a>
    </div>
  );
};
