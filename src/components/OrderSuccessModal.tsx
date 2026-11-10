import React from 'react';
import { CheckCircle2, MessageCircle, X, PhoneCall, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, settings } = useStore();

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  // Format WhatsApp message
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.productName} (اللون: ${item.colorName} - النمرة: ${item.size}) × ${item.quantity} = ${item.price * item.quantity} درهم`
    )
    .join('\n');

  const waMessage = encodeURIComponent(
    `السلام عليكم ورحمة الله،\nلقد قمت بطلب حذاء من متجر BELLA SHOES رقم الطلب: ${order.orderNumber}\nالاسم: ${order.customerName}\nالهاتف: ${order.phone}\nالمدينة: ${order.city}\nالعنوان: ${order.address}\n\nتفاصيل الأحذية:\n${itemsText}\n\nالمجموع النهائي: ${order.total} درهم (الدفع عند الاستلام مع إمكانية القياس).\nشكراً لكم.`
  );

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto text-right">
      <div className="relative w-full max-w-lg bg-white dark:bg-white border-2 border-slate-200 dark:border-black rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-black">
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 left-4 p-2 rounded-full text-slate-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#00C8FF]/15 border-2 border-[#00C8FF]/40 text-[#00C8FF] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,200,255,0.35)]">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-black mb-1">
            تم استلام طلبك بنجاح!
          </h3>
          <p className="text-xs text-slate-600 dark:text-black font-mono">
            رقم الطلبية:{' '}
            <span className="font-bold text-[#0088CC] dark:text-[#0077B5] bg-[#00C8FF]/15 px-2 py-0.5 rounded border border-[#00C8FF]/30">
              {order.orderNumber}
            </span>
          </p>
        </div>

        {/* Reassurance cards */}
        <div className="space-y-2 mb-6 text-xs text-slate-700 dark:text-black">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-50 border-2 border-slate-200 dark:border-black flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>سيتصل بك فريقنا هاتفياً خلال 24 ساعة لتأكيد موعد التوصيل ومقاس الحذاء.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-50 border-2 border-slate-200 dark:border-black flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>الدفع عند الاستلام نقداً بعد فحص ومعاينة الحذاء وتجربة قياسه.</span>
          </div>
        </div>

        {/* Order Details Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-50 border-2 border-slate-200 dark:border-black text-xs mb-6">
          <div className="font-bold text-slate-900 dark:text-black mb-2 flex items-center justify-between">
            <span>ملخص الطلبية:</span>
            <span className="font-mono text-[#00C8FF] text-sm font-black">{order.total} MAD</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto text-slate-600 dark:text-black text-[11px]">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-300 last:border-0">
                <span className="font-medium text-slate-800 dark:text-black truncate max-w-[200px]">
                  {it.productName} ({it.colorName} - نمرة {it.size}) × {it.quantity}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-black">{it.price * it.quantity} MAD</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: WhatsApp Send & Continue Shopping */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#00C8FF] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,200,255,0.35)] hover:bg-[#00B4E6] transition-all"
          >
            <MessageCircle className="w-4 h-4 stroke-[2.5]" />
            <span>إرسال وتأكيد الطلبية فوراً عبر واتساب</span>
          </a>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-black dark:text-slate-700 dark:hover:text-black transition-colors"
          >
            العودة لمتابعة التسوق
          </button>
        </div>
      </div>
    </div>
  );
};
