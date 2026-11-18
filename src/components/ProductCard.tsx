import React, { useState } from 'react';
import { Eye, ShoppingBag, Heart, Star, Play, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { resolveImageUrl } from '../assets/shoeImages';
import { extractProductMedia } from '../utils/media';
import { HarmonizedProductImage } from './HarmonizedProductImage';
import { ProductVideoPlayer } from './ProductVideoPlayer';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal, wishlist, toggleWishlist } = useStore();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeMediaMode, setActiveMediaMode] = useState<'image' | 'video'>('image');

  const isFavorite = wishlist.includes(product.id);
  const activeColor = product.colors[selectedVariantIdx] || product.colors[0];
  const mainImage = resolveImageUrl(activeColor?.image);
  const { videos } = extractProductMedia(product, activeColor?.image);
  const primaryVideo = videos[0] || null;

  const categoryNames = {
    womens: 'أحذية نسائية',
    mens: 'أحذية رجالية',
    kids: 'أحذية أطفال',
    wholesale: 'البيع بالجملة',
  };

  // Quiet unboxed status text without distracting pills or stickers over the shoe
  const quietStatusText = product.discount
    ? `تخفيض ${product.discount}`
    : product.isBestseller
      ? 'الأكثر طلباً'
      : product.isNew
        ? 'جديد'
        : null;

  return (
    <article className="group w-full min-w-0 h-full rounded-[8px] bg-white dark:bg-[#111319] border border-slate-200/60 dark:border-slate-800/70 overflow-hidden flex flex-col justify-between luxury-product-card">
      {/* Top 1:1 Media Area (or True-Aspect Video Player when toggled) */}
      <div className="p-2.5 sm:p-3 pb-0">
        <div className="relative product-image-container rounded-[8px] overflow-hidden">
          {activeMediaMode === 'video' && primaryVideo ? (
            <div className="w-full min-h-[260px] flex items-center justify-center bg-[#F5F5F3] dark:bg-[#13151B] rounded-[8px]">
              <ProductVideoPlayer
                src={primaryVideo}
                poster={mainImage}
                title={product.name}
                compact
              />
            </div>
          ) : (
            <HarmonizedProductImage
              src={mainImage}
              alt={product.name}
              onClick={() => openProductModal(product)}
              className="cursor-pointer"
            />
          )}

          {/* Minimalist Wishlist Heart (Top-Left, no visual clutter) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full bg-white/85 dark:bg-[#111319]/85 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Clean Inline Media Switcher if Product Includes a Video */}
          {primaryVideo && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-0.5 p-0.5 rounded-[8px] bg-white/90 dark:bg-[#111319]/90 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70"
            >
              <button
                type="button"
                onClick={() => setActiveMediaMode('image')}
                className={`px-2 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  activeMediaMode === 'image'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>صورة</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaMode('video')}
                className={`px-2 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  activeMediaMode === 'video'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>فيديو</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Details (Calm Minimalist Hierarchy) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#111319] text-right">
        <div>
          {/* Clean Unboxed Metadata Line */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="font-medium text-slate-600 dark:text-slate-300 truncate">
                {categoryNames[product.category]}
              </span>
              {quietStatusText && (
                <>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`font-semibold shrink-0 tabular-nums ${
                      product.discount
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-[#0099CC] dark:text-[#00C8FF]'
                    }`}
                  >
                    {quietStatusText}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-300 shrink-0 tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductModal(product)}
            className="font-semibold text-[15px] sm:text-base text-slate-950 dark:text-white line-clamp-2 hover:text-[#0099CC] dark:hover:text-[#00C8FF] transition-colors cursor-pointer mb-3 leading-snug font-sans min-h-[2.75rem]"
          >
            {product.name}
          </h3>

          {/* Subtle Color Swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {product.colors.slice(0, 5).map((color, idx) => (
                <button
                  key={color.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIdx(idx);
                    setActiveMediaMode('image');
                  }}
                  title={color.name}
                  aria-label={`اختيار لون ${color.name}`}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                    selectedVariantIdx === idx
                      ? 'ring-2 ring-slate-900 dark:ring-[#00C8FF] ring-offset-2 ring-offset-white dark:ring-offset-[#111319] border-transparent scale-105'
                      : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price Baseline & Clean Action Row */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/70">
          <div className="flex items-baseline justify-between gap-2 mb-3.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums">
                {product.price}{' '}
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-semibold">
                  MAD
                </span>
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                  {product.oldPrice} MAD
                </span>
              )}
            </div>

            {!product.inStock ? (
              <span className="text-[11px] text-rose-500 font-semibold shrink-0">نفذ المخزون</span>
            ) : product.wholesaleMinQty ? (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                سلسلة جملة
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openProductModal(product)}
              className="w-10 h-10 rounded-[8px] bg-slate-50 hover:bg-slate-100 dark:bg-[#171A23] dark:hover:bg-[#1E222E] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="معاينة التفاصيل"
              aria-label="معاينة التفاصيل"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openProductModal(product)}
              className="flex-1 h-10 px-4 rounded-[8px] bg-slate-950 hover:bg-[#00C8FF] dark:bg-white dark:hover:bg-[#00C8FF] text-white hover:text-black dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer truncate"
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
