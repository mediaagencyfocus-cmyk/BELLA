import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  ShieldCheck, 
  Truck, 
  MessageCircle,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoeCategory } from '../types';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory } = useStore();
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    const text = encodeURIComponent(
      `رسالة من موقع BELLA SHOES:\nالاسم: ${contactName || 'زبون'}\nالرسالة: ${contactMessage}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <footer className="bg-white dark:bg-[#08090C] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 transition-colors text-right pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-[#12141C] border border-[#00FF66]/50 flex items-center justify-center text-[#00FF66] font-black text-xl shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                B
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                BELLA <span className="text-[#00FF66]">SHOES</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              المتجر الرائد في المغرب المتخصص في تزويد الزبائن بأرقى الأحذية الفاخرة، المصنوعة بأعلى درجات الإتقان والجلود الطبيعية الحقيقية.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#00FF66]" />
                <span>توصيل 24 ساعة بالمغرب</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
                <span>100% أصلي ومضمون</span>
              </span>
            </div>
          </div>

          {/* Col 2: Four Categories Only */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              الأقسام المعتمدة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveCategory('womens')}
                  className="hover:text-[#00FF66] transition-colors"
                >
                  الأحذية النسائية (كعب عالي، صندل، سنيكرز)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('mens')}
                  className="hover:text-[#00FF66] transition-colors"
                >
                  الأحذية الرجالية (أكسفورد، كلاسيك، كاجوال)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('kids')}
                  className="hover:text-[#00FF66] transition-colors"
                >
                  أحذية الأطفال (مريحة ومتينة للصغار)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('wholesale')}
                  className="hover:text-[#00FF66] transition-colors"
                >
                  البيع بالجملة (سلاسل وعروض للتجار)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-[#00FF66] font-bold hover:underline"
                >
                  جميع تشكيلات الأحذية
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              خدمة الزبائن والدعم
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-mono" dir="ltr">{settings.whatsapp}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-mono" dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-mono">{settings.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Direct Contact Form */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              تواصل معنا مباشرة
            </h4>
            <p className="text-[11px] text-slate-500">
              أرسل لنا استفسارك أو طلبك الخاص وسيجيبك فريق الدعم فوراً:
            </p>

            {contactSent ? (
              <div className="p-3 rounded-xl bg-[#00FF66]/15 text-[#00FF66] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم إرسال رسالتك عبر واتساب!</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="اسمك الكريم"
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-[#12141A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00FF66]"
                />
                <input
                  type="text"
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="نص الرسالة أو الاستفسار..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-[#12141A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00FF66]"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 dark:bg-[#1A1E29] hover:bg-black dark:hover:bg-[#00FF66] text-white dark:hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال للإدارة</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & social links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © BELLA SHOES 2026. جميع الحقوق محفوظة لمتجر بيلا شوز للأحذية الفاخرة بالمغرب.
          </div>

          <div className="flex items-center gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:text-[#00FF66] transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:text-[#00FF66] transition-colors"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:text-[#00FF66] transition-colors text-xs font-bold"
              title="TikTok"
            >
              TT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
