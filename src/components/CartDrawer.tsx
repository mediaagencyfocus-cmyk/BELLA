import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Send, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const MOROCCAN_CITIES = [
  'الدار البيضاء',
  'الرباط',
  'مراكش',
  'طنجة',
  'فاس',
  'أكادير',
  'مكناس',
  'وجدة',
  'القنيطرة',
  'تطوان',
  'تمارة',
  'سلا',
  'الجديدة',
  'بني ملال',
  'المحمدية',
  'الناظور',
  'خريبكة',
  'سطات',
  'العيون',
  'الداخلة',
  'مدينة أخرى بالمغرب'
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    settings
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الدار البيضاء');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const isFreeShipping = cartCount >= settings.freeShippingPairThreshold;
  const shippingFee = isFreeShipping ? 0 : (cartCount > 0 ? settings.deliveryFee : 0);
  const orderFinalTotal = cartTotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError('يرجى إدخال رقم هاتف صحيح لنتصل بك لتأكيد الطلب');
      return;
    }
    if (!address.trim()) {
      setFormError('يرجى إدخال عنوان التوصيل أو الحي');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        notes: notes.trim()
      });
      setIsSubmitting(false);
      setIsCheckingOut(false);
      // Reset form
      setCustomerName('');
      setPhone('');
      setAddress('');
      setNotes('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-right">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-white border-r-2 border-slate-200 dark:border-black shadow-2xl flex flex-col justify-between text-slate-900 dark:text-black">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00C8FF]" />
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-black">
                سلة المشتريات ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Alert Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-100 border-b-2 border-slate-200 dark:border-black text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-[#0099DD] dark:text-[#0088CC] font-bold">
                <Sparkles className="w-4 h-4 text-[#00C8FF]" />
                <span>مبروك! لقد حصلت على توصيل مجاني لكافة مدن المغرب.</span>
              </div>
            ) : (
              <div className="text-slate-700 dark:text-black">
                <span>أضف </span>
                <span className="font-bold text-[#00C8FF]">
                  {settings.freeShippingPairThreshold - cartCount} حذاء آخر
                </span>
                <span> للاستفادة من </span>
                <span className="font-bold text-[#00C8FF]">التوصيل المجاني</span>
              </div>
            )}
          </div>

          {/* Scrollable Body: Cart Items or Checkout Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-black text-base mb-1">
                  سلة المشتريات فارغة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-600 max-w-xs mb-6">
                  استكشف تشكيلات BELLA SHOES واختر مقاسك ولونك المفضل.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#00C8FF] text-black font-extrabold text-xs shadow-md hover:bg-[#00B4E6] transition-all cursor-pointer"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : !isCheckingOut ? (
              /* Items List */
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white dark:bg-white border-2 border-slate-200 dark:border-black flex gap-3 items-center"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-black">
                      <img
                        src={item.selectedColor.image || item.product.colors[0]?.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-black truncate">
                        {item.product.name}
                      </h4>

                      {/* Color & Size display */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 dark:text-black">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-black">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/30"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </span>
                        <span>·</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-black">
                          نمرة: {item.selectedSize}
                        </span>
                      </div>

                      {/* Price and Stepper */}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-mono font-bold text-sm text-[#00C8FF]">
                          {item.product.price * item.quantity} MAD
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg border-2 border-slate-200 dark:border-black bg-white dark:bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-[#00C8FF] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-[#00C8FF] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="حذف الحذاء من السلة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:underline pt-2 block mr-auto"
                >
                  إفراغ السلة
                </button>
              </div>
            ) : (
              /* Fast Cash on Delivery Form */
              <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#00C8FF]/10 border-2 border-[#00C8FF]/40 text-[#0088CC] dark:text-[#0077B5] text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00C8FF] shrink-0" />
                  <span>الدفع نقداً عند استلام ومعاينة الحذاء عند باب منزلك</span>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-black mb-1">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: محمد العلوي"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-100 border-2 border-slate-200 dark:border-black text-slate-900 dark:text-black focus:border-[#00C8FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-black mb-1">
                    رقم الهاتف (واتساب / اتصال) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 0612345678"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-100 border-2 border-slate-200 dark:border-black text-slate-900 dark:text-black focus:border-[#00C8FF] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    سنتصل بك لتأكيد المقاس وتوقيت التوصيل المناسب لك.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-black mb-1">
                    المدينة بالمغرب <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-100 border-2 border-slate-200 dark:border-black text-slate-900 dark:text-black focus:border-[#00C8FF] focus:outline-none"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-black mb-1">
                    عنوان التوصيل أو الحي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: حي المعاريف، زنقة 14، قرب مسجد..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-100 border-2 border-slate-200 dark:border-black text-slate-900 dark:text-black focus:border-[#00C8FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-black mb-1">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: يرجى الاتصال بعد الساعة 3 زوالاً"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-100 border-2 border-slate-200 dark:border-black text-slate-900 dark:text-black focus:border-[#00C8FF] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#00C8FF] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,200,255,0.35)] hover:bg-[#00B4E6] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب الآن (الدفع عند الاستلام)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full mt-2 py-2 text-xs text-slate-600 hover:text-black dark:text-slate-700 dark:hover:text-black font-semibold"
                  >
                    الرجوع لمراجعة السلة
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Subtotal & Checkout Trigger */}
          {cart.length > 0 && !isCheckingOut && (
            <div className="p-4 sm:p-5 border-t-2 border-slate-200 dark:border-black bg-slate-50 dark:bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-black">
                  <span>المجموع الفرعي ({cartCount} حذاء):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-black">{cartTotal} MAD</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-black">
                  <span>مصاريف التوصيل:</span>
                  <span className={`font-mono font-bold ${shippingFee === 0 ? 'text-[#00C8FF]' : 'text-slate-900 dark:text-black'}`}>
                    {shippingFee === 0 ? 'مجاني بالكامل (0 MAD)' : `${shippingFee} MAD`}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-slate-200 dark:border-black flex items-center justify-between text-sm sm:text-base font-extrabold text-slate-900 dark:text-black">
                  <span>المبلغ الإجمالي عند الاستلام:</span>
                  <span className="font-mono text-[#00C8FF] text-lg font-black">{orderFinalTotal} MAD</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#00C8FF] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,200,255,0.35)] hover:bg-[#00B4E6] transition-all cursor-pointer"
              >
                <span>متابعة تأكيد الطلب</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
