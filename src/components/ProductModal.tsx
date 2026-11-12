import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ZoomIn, 
  Star, 
  Heart,
  Plus,
  Minus,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ColorVariant } from '../types';

export const ProductModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    closeProductModal, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    setIsCartOpen 
  } = useStore();

  const product = selectedProductForModal;

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (product) {
      const defaultColor = product.colors.find(c => c.inStock) || product.colors[0];
      setSelectedColor(defaultColor);
      setActiveImage(defaultColor?.image || '');
      setSelectedSize(null); // Must explicitly pick their size
      setQuantity(1);
      setErrorMessage('');
    }
  }, [product]);

  if (!product) return null;

  const isFavorite = wishlist.includes(product.id);

  const handleColorChange = (color: ColorVariant) => {
    if (!color.inStock) return;
    setSelectedColor(color);
    if (color.image) {
      setActiveImage(color.image);
    }
  };

  const handleAddToCart = (openDrawer = true) => {
    if (!selectedSize) {
      setErrorMessage('يرجى اختيار النمرة / المقاس أولاً لإتمام طلب الحذاء');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('يرجى اختيار اللون المطلوب');
      return;
    }
    setErrorMessage('');
    addToCart(product, selectedColor, selectedSize, quantity);
    if (openDrawer) {
      closeProductModal();
      setIsCartOpen(true);
    }
  };

  const handleFastOrder = () => {
    if (!selectedSize) {
      setErrorMessage('يرجى اختيار النمرة / المقاس أولاً للمتابعة والدفع عند الاستلام');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('يرجى اختيار اللون المطلوب');
      return;
    }
    setErrorMessage('');
    addToCart(product, selectedColor, selectedSize, quantity);
    closeProductModal();
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm luxury-modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={closeProductModal}
      >
        {/* Modal Dialog */}
        <div 
          className="relative w-full max-w-4xl bg-white dark:bg-[#12141C] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-right text-slate-900 dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeProductModal}
            className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1E29] dark:hover:bg-[#252B3B] text-slate-700 dark:text-slate-300 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Right: Images and Gallery (6 cols on desktop) */}
            <div className="md:col-span-6 bg-slate-50 dark:bg-[#0B0D12] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-l-2 border-slate-200 dark:border-slate-800">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#161922] border border-slate-200 dark:border-slate-800 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Zoom In Lightbox Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-black transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>تكبير الصورة</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {product.discount && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
                    {product.discount} تخفيض
                  </span>
                )}
              </div>

              {/* Color thumbnails / previews */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">
                  معاينة صور الألوان المتوفرة:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleColorChange(c)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedColor?.id === c.id
                          ? 'border-[#00C8FF] shadow-[0_0_10px_rgba(0,200,255,0.4)]'
                          : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                <div className="p-2 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#00C8FF]" />
                  <span>توصيل 24 ساعة</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#00C8FF]" />
                  <span>جلد طبيعي 100%</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#00C8FF]" />
                  <span>قياس عند الباب</span>
                </div>
              </div>
            </div>

            {/* Left: Product Purchasing Module & Selectors (6 cols) */}
            <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#12141C] text-slate-900 dark:text-white">
              <div>
                {/* Header info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00C8FF]/15 text-[#0099DD] dark:text-[#00C8FF] border border-[#00C8FF]/30">
                    BELLA SHOES LUXURY
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{product.rating}</span>
                    <span>({product.reviewsCount} تقييم)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 leading-snug">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#00C8FF] font-mono">
                    {product.price} <span className="text-sm font-sans">MAD</span>
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono">
                      {product.oldPrice} MAD
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    (شامل الضريبة والمعاينة)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Error Banner if user forgot to pick a size */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-500 text-xs font-bold flex items-center gap-2 animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. COLOR SELECTION */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      اللون المختار:{' '}
                      <span className="text-[#00C8FF]">{selectedColor?.name || 'اختر اللون'}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (انقر لتغيير صورة الحذاء)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => handleColorChange(c)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-[#1E2330] border-[#00C8FF] shadow-[0_0_12px_rgba(0,200,255,0.35)] text-slate-900 dark:text-white'
                              : 'bg-white dark:bg-[#161922] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00C8FF]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SIZE SELECTION */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>النمرة / المقاس المتوفر:</span>
                      {selectedSize ? (
                        <span className="text-[#00C8FF] font-mono text-sm font-black">{selectedSize}</span>
                      ) : (
                        <span className="text-rose-500 font-bold">* إلزامي</span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      المقاسات المعتمدة بالمغرب (EU)
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setErrorMessage('');
                          }}
                          className={`py-2.5 rounded-xl font-mono text-sm font-bold border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-[#00C8FF] text-black border-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.4)] scale-105'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#161922] dark:hover:bg-[#1E2330] text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-[#00C8FF]/50'
                          }`}
                        >
                          <span>{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. QUANTITY SELECTOR */}
                <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-[#161922] border-2 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    الكمية المطلوبة:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-[#12141C] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:border-[#00C8FF] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-base w-6 text-center text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-[#12141C] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:border-[#00C8FF] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleFastOrder}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#00C8FF] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,200,255,0.35)] hover:bg-[#00B4E6] transition-all cursor-pointer border-2 border-transparent"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>اطلب الآن - الدفع عند الاستلام</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161922] dark:hover:bg-[#1E2330] text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#00C8FF]" />
                  <span>إضافة إلى سلة المشتريات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full-Screen Image Zoom */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border-2 border-white/20"
            />
            <p className="text-center text-white text-sm font-bold mt-4 font-sans">
              {product.name} - {selectedColor?.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
