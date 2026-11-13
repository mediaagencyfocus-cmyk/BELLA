import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './SocialIcons';
import { buildWhatsAppLink, formatDisplayPhone } from '../utils/phone';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory, setShowWishlistOnly } = useStore();
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const directWaLink = buildWhatsAppLink(settings.whatsapp);

  const handleCategoryJump = (category: 'all' | 'womens' | 'mens' | 'kids' | 'wholesale') => {
    setShowWishlistOnly(false);
    setActiveCategory(category);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    const message = `رسالة من موقع BELLA SHOES:\nالاسم: ${contactName || 'زبون'}\nالرسالة: ${contactMessage}`;
    const url = buildWhatsAppLink(settings.whatsapp, message);
    window.open(url, '_blank');
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <footer className="bg-white dark:bg-[#060709] text-slate-800 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 text-right pt-12 pb-24 sm:pb-8 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80 dark:border-slate-800/80 min-w-0">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black dark:bg-[#111319] border border-[#00C8FF]/60 flex items-center justify-center text-[#00C8FF] font-black text-lg shadow-[0_0_12px_rgba(0,200,255,0.25)]">
                B
              </div>
              <span className="text-lg font-black text-slate-950 dark:text-white font-brand">
                BELLA <span className="text-[#00C8FF]">SHOES</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              المتجر الرائد في المغرب المتخصص في تزويد الزبائن بأرقى الأحذية الفاخرة، المصنوعة بأعلى درجات الإتقان والجلود الطبيعية الحقيقية.
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>توصيل 24 ساعة بالمغرب</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>100% أصلي ومضمون</span>
              </span>
            </div>

            {/* Social Badges */}
            <div className="pt-1">
              <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                قنواتنا الرسمية المعتمدة:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={directWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#25D366]/15 dark:bg-[#111319] dark:hover:bg-[#25D366]/20 border border-slate-200 dark:border-slate-800 hover:border-[#25D366] text-slate-700 dark:text-slate-300 hover:text-[#25D366] flex items-center justify-center transition-colors"
                  title="واتساب مباشر: تواصل مع الإدارة"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>

                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#E1306C]/15 dark:bg-[#111319] dark:hover:bg-[#E1306C]/20 border border-slate-200 dark:border-slate-800 hover:border-[#E1306C] text-slate-700 dark:text-slate-300 hover:text-[#E1306C] flex items-center justify-center transition-colors"
                  title="إنستغرام: @bellashoes.ma"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#1877F2]/15 dark:bg-[#111319] dark:hover:bg-[#1877F2]/20 border border-slate-200 dark:border-slate-800 hover:border-[#1877F2] text-slate-700 dark:text-slate-300 hover:text-[#1877F2] flex items-center justify-center transition-colors"
                  title="فيسبوك: BELLA SHOES"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#FE2C55]/15 dark:bg-[#111319] dark:hover:bg-[#FE2C55]/20 border border-slate-200 dark:border-slate-800 hover:border-[#FE2C55] text-slate-700 dark:text-slate-300 hover:text-[#FE2C55] flex items-center justify-center transition-colors"
                  title="تيك توك: @bellashoes.ma"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Store Categories */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
              الأقسام المعتمدة
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryJump('womens')}
                  className="hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer text-right"
                >
                  الأحذية النسائية (كعب عالي، صندل، سنيكرز)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryJump('mens')}
                  className="hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer text-right"
                >
                  الأحذية الرجالية (أكسفورد، كلاسيك، كاجوال)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryJump('kids')}
                  className="hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer text-right"
                >
                  أحذية الأطفال (مريحة ومتينة للصغار)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryJump('wholesale')}
                  className="hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer text-right"
                >
                  البيع بالجملة (سلاسل وعروض للتجار)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryJump('all')}
                  className="text-[#0099CC] dark:text-[#00C8FF] font-bold hover:underline cursor-pointer text-right"
                >
                  جميع تشكيلات الأحذية
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Contact Info */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
              خدمة الزبائن والدعم
            </h4>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li>
                <a
                  href={directWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#25D366] transition-colors group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span className="font-mono font-semibold tabular-nums" dir="ltr">
                    {formatDisplayPhone(settings.whatsapp)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">(واتساب)</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 hover:text-[#00C8FF] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#00C8FF] shrink-0" />
                  <span className="font-mono tabular-nums" dir="ltr">
                    {settings.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-[#00C8FF] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#00C8FF] shrink-0" />
                  <span className="font-mono truncate">{settings.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-[#00C8FF] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Direct Contact Form */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
              تواصل معنا مباشرة
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              أرسل لنا استفسارك أو طلبك الخاص وسيجيبك فريق الدعم فوراً عبر واتساب:
            </p>

            {contactSent ? (
              <div className="p-3 rounded-xl bg-[#00C8FF]/15 text-[#0099CC] dark:text-[#00C8FF] text-xs font-bold flex items-center gap-2 border border-[#00C8FF]/30">
                <CheckCircle2 className="w-4 h-4 text-[#00C8FF] shrink-0" />
                <span>تم فتح محادثة واتساب برسالتك!</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="اسمك الكريم"
                  className="w-full h-10 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#111319] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00C8FF]"
                />
                <input
                  type="text"
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="نص الرسالة أو الاستفسار..."
                  className="w-full h-10 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#111319] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00C8FF]"
                />
                <button
                  type="submit"
                  className="w-full h-10 px-3 rounded-xl bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال للإدارة</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Verified Social Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <div className="text-center sm:text-right">
            © BELLA SHOES 2026. جميع الحقوق محفوظة لمتجر بيلا شوز للأحذية الفاخرة بالمغرب.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:inline">
              تابعنا على شبكاتنا:
            </span>

            <a
              href={directWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#25D366]/15 dark:bg-[#111319] dark:hover:bg-[#25D366]/20 border border-slate-200 dark:border-slate-800 hover:border-[#25D366] text-slate-700 dark:text-slate-300 hover:text-[#25D366] transition-colors flex items-center gap-1.5"
              title="تواصل معنا عبر واتساب"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden md:inline">WhatsApp</span>
            </a>

            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#E1306C]/15 dark:bg-[#111319] dark:hover:bg-[#E1306C]/20 border border-slate-200 dark:border-slate-800 hover:border-[#E1306C] text-slate-700 dark:text-slate-300 hover:text-[#E1306C] transition-colors flex items-center gap-1.5"
              title="صفحة Instagram الرسمية"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden md:inline">Instagram</span>
            </a>

            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#1877F2]/15 dark:bg-[#111319] dark:hover:bg-[#1877F2]/20 border border-slate-200 dark:border-slate-800 hover:border-[#1877F2] text-slate-700 dark:text-slate-300 hover:text-[#1877F2] transition-colors flex items-center gap-1.5"
              title="صفحة Facebook الرسمية"
            >
              <FacebookIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden md:inline">Facebook</span>
            </a>

            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#FE2C55]/15 dark:bg-[#111319] dark:hover:bg-[#FE2C55]/20 border border-slate-200 dark:border-slate-800 hover:border-[#FE2C55] text-slate-700 dark:text-slate-300 hover:text-[#FE2C55] transition-colors flex items-center gap-1.5"
              title="حساب TikTok الرسمي"
            >
              <TikTokIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden md:inline">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
