import React from 'react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon } from './SocialIcons';

export const FloatingWhatsApp: React.FC = () => {
  const { whatsappNumber, getWhatsAppUrl } = useStore();

  const greeting = 'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.';
  const waUrl = getWhatsAppUrl(greeting);

  if (!whatsappNumber || waUrl === '#') return null;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 flex items-center select-none max-w-[calc(100vw-2rem)]">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 rounded-full transition-transform hover:scale-[1.03]"
        title="تواصل معنا عبر واتساب مباشرة"
        aria-label="تواصل معنا عبر واتساب مباشرة"
      >
        <span className="hidden sm:inline-flex px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#111319]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold shadow-lg whitespace-nowrap">
          محتاج مساعدة؟ تواصل معنا
        </span>

        <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center border-2 border-white dark:border-[#0A0B0E] shadow-[0_6px_22px_rgba(37,211,102,0.45)]">
          <WhatsAppIcon className="w-6 h-6 fill-white" />
        </div>
      </a>
    </div>
  );
};
