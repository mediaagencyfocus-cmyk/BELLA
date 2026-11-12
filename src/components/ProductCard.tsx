import React from 'react';
import { Eye, ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal, wishlist, toggleWishlist } = useStore();

  const isFavorite = wishlist.includes(product.id);
  const mainImage = product.colors[0]?.image || '/src/assets/images/bella_womens_heels_1794318693049.jpg';

  const categoryNames = {
    womens: 'أحذية نسائية',
    mens: 'أحذية رجالية',
    kids: 'أحذية أطفال',
    wholesale: 'البيع بالجملة'
  };

  return (
    <div className="group rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12141C] border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#00C8FF] dark:hover:border-[#00C8FF] transition-all flex flex-col justify-between luxury-product-card">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-50 dark:bg-[#0B0D12] overflow-hidden border-b-2 border-slate-100 dark:border-slate-800 product-image-container">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 z-10">
          {product.discount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-rose-500 text-white shadow-xs">
              {product.discount}
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-400 text-black shadow-xs">
              الأكثر طلباً
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#00C8FF] text-black shadow-xs">
              جديد
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-rose-500 transition-all z-10 shadow-xs cursor-pointer"
          title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Eye icon overlay button for instant preview on hover */}
        <button
          onClick={() => openProductModal(product)}
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer hidden sm:flex"
          title="مشاهدة التفاصيل"
        >
          <span className="p-3 rounded-full bg-[#00C8FF] text-black shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-black">
            <Eye className="w-5 h-5 stroke-[2.5]" />
          </span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#12141C]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-bold text-[#00a8dc] dark:text-[#00C8FF] uppercase tracking-wider font-sans truncate max-w-[85px] sm:max-w-none">
              {categoryNames[product.category]}
            </span>
            <div className="flex items-center gap-1 font-mono font-medium text-slate-800 dark:text-slate-200 shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => openProductModal(product)}
            className="font-bold text-xs sm:text-sm text-slate-950 dark:text-white line-clamp-2 hover:text-[#00C8FF] dark:hover:text-[#00C8FF] transition-colors cursor-pointer mb-2 leading-snug font-sans h-8 sm:h-10"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-2 sm:mb-3">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-slate-950 dark:text-white font-mono">
                {product.price} <span className="text-[10px] sm:text-xs font-sans text-[#00a8dc] dark:text-[#00C8FF] font-bold">MAD</span>
              </span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                  {product.oldPrice}
                </span>
              )}
            </div>

            {product.wholesaleMinQty && (
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                (سلسلة)
              </span>
            )}
          </div>

          {/* Action Row: Eye button + Add to Cart button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => openProductModal(product)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#181B24] dark:hover:bg-[#202531] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="مشاهدة تفاصيل الحذاء"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => openProductModal(product)}
              className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl bg-slate-900 hover:bg-[#00C8FF] dark:bg-[#181B24] dark:hover:bg-[#00C8FF] text-white hover:text-black dark:text-slate-200 dark:hover:text-black border border-slate-900 dark:border-slate-700 hover:border-[#00C8FF] dark:hover:border-[#00C8FF] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer group/btn truncate"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 group-hover/btn:scale-110 transition-transform" />
              <span className="truncate">طلب الحذاء</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
