import React, { useState } from 'react';
import { Eye, ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal, wishlist, toggleWishlist } = useStore();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isFavorite = wishlist.includes(product.id);
  const activeColor = product.colors[selectedVariantIdx] || product.colors[0];
  const mainImage =
    activeColor?.image || '/src/assets/images/bella_womens_heels_1794318693049.jpg';

  const categoryNames = {
    womens: 'أحذية نسائية',
    mens: 'أحذية رجالية',
    kids: 'أحذية أطفال',
    wholesale: 'البيع بالجملة',
  };

  // Max 1 quiet corner tag per card for clean international editorial hierarchy
  const cornerTag = product.discount
    ? { label: product.discount, className: 'bg-rose-600 text-white' }
    : product.isBestseller
      ? { label: 'الأكثر طلباً', className: 'bg-slate-950/85 text-white dark:bg-white dark:text-black' }
      : product.isNew
        ? { label: 'جديد', className: 'bg-[#00C8FF] text-black' }
        : null;

  return (
    <article className="group h-full rounded-2xl bg-white dark:bg-[#111319] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-[#00C8FF] dark:hover:border-[#00C8FF] flex flex-col justify-between luxury-product-card">
      {/* Top Image Container */}
      <div
        onClick={() => openProductModal(product)}
        className="relative aspect-[4/3] bg-slate-50 dark:bg-[#0B0D12] overflow-hidden border-b border-slate-100 dark:border-slate-800/80 product-image-container cursor-pointer"
      >
        {!imageError ? (
          <img
            src={mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-[#141720] text-slate-400 dark:text-slate-500 px-3 text-center">
            <ShoppingBag className="w-7 h-7 mb-1.5 text-[#00C8FF]/70" />
            <span className="text-[11px] font-bold font-brand tracking-wider text-slate-600 dark:text-slate-300">
              BELLA SHOES
            </span>
          </div>
        )}

        {/* Single Quiet Corner Tag */}
        {cornerTag && (
          <span
            className={`absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-xs tabular-nums ${cornerTag.className}`}
          >
            {cornerTag.label}
          </span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 left-2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-[#111319]/90 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Subtle Desktop Quick View Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#111319]/95 text-slate-950 dark:text-white text-xs font-bold shadow-lg flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700">
            <Eye className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>معاينة سريعة</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#111319] text-right">
        <div>
          {/* Unboxed Single-Line Category & Rating Metadata */}
          <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs mb-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-[#0099CC] dark:text-[#00C8FF] truncate">
              {categoryNames[product.category]}
            </span>
            <div className="flex items-center gap-1 font-mono font-semibold text-slate-700 dark:text-slate-200 shrink-0 tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductModal(product)}
            className="font-bold text-xs sm:text-sm text-slate-950 dark:text-white line-clamp-2 hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer mb-2.5 leading-snug font-sans min-h-[2.25rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </h3>

          {/* Color Swatches Preview */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <button
                  key={color.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageError(false);
                    setSelectedVariantIdx(idx);
                  }}
                  title={color.name}
                  aria-label={`اختيار لون ${color.name}`}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                    selectedVariantIdx === idx
                      ? 'ring-2 ring-[#00C8FF] ring-offset-1 ring-offset-white dark:ring-offset-[#111319] border-black/30 dark:border-white/40 scale-110'
                      : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between gap-2 mb-2.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white font-mono tabular-nums">
                {product.price}{' '}
                <span className="text-[10px] sm:text-xs font-sans text-[#0099CC] dark:text-[#00C8FF] font-bold">
                  MAD
                </span>
              </span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                  {product.oldPrice}
                </span>
              )}
            </div>

            {product.wholesaleMinQty && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                سلسلة
              </span>
            )}
          </div>

          {/* Action Row: Touch-safe min 40px buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => openProductModal(product)}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181B24] dark:hover:bg-[#202531] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="مشاهدة تفاصيل الحذاء"
              aria-label="مشاهدة تفاصيل الحذاء"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openProductModal(product)}
              className="flex-1 h-10 px-2.5 sm:px-3 rounded-xl bg-slate-950 hover:bg-[#00C8FF] dark:bg-[#181B24] dark:hover:bg-[#00C8FF] text-white hover:text-black dark:text-slate-100 dark:hover:text-black border border-slate-950 dark:border-slate-700 hover:border-[#00C8FF] dark:hover:border-[#00C8FF] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">طلب الحذاء</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
