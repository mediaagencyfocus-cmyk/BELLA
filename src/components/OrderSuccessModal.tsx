import React from 'react';
import { CheckCircle2, X, PhoneCall, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppIcon } from './SocialIcons';
import { buildWhatsAppLink } from '../utils/phone';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, settings } = useStore();

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.productName} (اللون: ${item.colorName} - النمرة: ${item.size}) × ${item.quantity} = ${item.price * item.quantity} درهم`
    )
    .join('\n');

  const rawMessage = `السلام عليكم ورحمة الله،\nلقد قمت بطلب حذاء من متجر BELLA SHOES رقم الطلب: ${order.orderNumber}\nالاسم: ${order.customerName}\nالهاتف: ${order.phone}\nالمدينة: ${order.city}\nالعنوان: ${order.address}\n\nتفاصيل الأحذية:\n${itemsText}\n\nالمجموع النهائي: ${order.total} درهم (الدفع عند الاستلام مع إمكانية القياس).\nشكراً لكم.`;
  const waUrl = buildWhatsAppLink(settings.whatsapp, rawMessage);

  return (
    <div className="fixed inset-0 z-60 bg-black/75 luxury-modal-backdrop flex items-center justify-center p-4 overflow-y-auto text-right">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111319] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white">
        <button
          type="button"
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#00C8FF]/15 border border-[#00C8FF]/40 text-[#00C8FF] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,200,255,0.28)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.25]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white mb-1 font-brand">
            تم استلام طلبك بنجاح
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
            رقم الطلبية:{' '}
            <span className="font-bold text-[#0099CC] dark:text-[#00C8FF] bg-[#00C8FF]/10 px-2.5 py-0.5 rounded-lg border border-[#00C8FF]/30">
              {order.orderNumber}
            </span>
          </p>
        </div>

        {/* Reassurance cards */}
        <div className="space-y-2 mb-5 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>سيتصل بك فريقنا هاتفياً خلال 24 ساعة لتأكيد موعد التوصيل ومقاس الحذاء.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>الدفع عند الاستلام نقداً بعد فحص ومعاينة الحذاء وتجربة قياسه.</span>
          </div>
        </div>

        {/* Order Details Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-xs mb-6">
          <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
            <span>ملخص الطلبية:</span>
            <span className="font-mono text-[#0099CC] dark:text-[#00C8FF] text-sm font-black tabular-nums">
              {order.total} MAD
            </span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto text-slate-600 dark:text-slate-300 text-[11px]">
            {order.items.map((it, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-2 py-1 border-b border-slate-200/70 dark:border-slate-800 last:border-0"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {it.productName} ({it.colorName} · نمرة {it.size}) × {it.quantity}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0 tabular-nums">
                  {it.price * it.quantity} MAD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 px-4 rounded-2xl bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(0,200,255,0.3)] transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 fill-black" />
            <span>إرسال وتأكيد الطلبية فوراً عبر واتساب</span>
          </a>

          <button
            type="button"
            onClick={() => setLastPlacedOrder(null)}
            className="w-full h-10 rounded-xl text-xs font-semibold text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            العودة لمتابعة التسوق
          </button>
        </div>
      </div>
    </div>
  );
};
