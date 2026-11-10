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
    <div className="group rounded-2xl bg-white dark:bg-[#111319] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#00FF66]/50 dark:hover:border-[#00FF66]/40 transition-all flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-black/60 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discount && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs">
              {product.discount}
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black shadow-xs">
              الأكثر طلباً
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00FF66] text-black shadow-xs">
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
          className="absolute top-2.5 left-2.5 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-rose-500 hover:bg-black/70 transition-all z-10"
          title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Eye icon overlay button for instant preview */}
        <button
          onClick={() => openProductModal(product)}
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
          title="مشاهدة التفاصيل"
        >
          <span className="p-3 rounded-full bg-[#00FF66] text-black shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-5 h-5 stroke-[2.5]" />
          </span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold text-[#00FF66] uppercase tracking-wider">
              {categoryNames[product.category]}
            </span>
            <div className="flex items-center gap-1 font-mono font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => openProductModal(product)}
            className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-[#00FF66] transition-colors cursor-pointer mb-2"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {product.price} <span className="text-xs font-sans text-[#00FF66]">MAD</span>
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {product.oldPrice} MAD
                </span>
              )}
            </div>

            {product.wholesaleMinQty && (
              <span className="text-[10px] text-slate-400 font-semibold">
                (سلسلة كرتون)
              </span>
            )}
          </div>

          {/* Action Row: Eye button + Add to Cart button */}
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => openProductModal(product)}
              className="col-span-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              title="مشاهدة تفاصيل الحذاء"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => openProductModal(product)}
              className="col-span-4 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-[#1C202B] dark:hover:bg-[#00FF66] text-white dark:hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group/btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              <span>إضافة إلى السلة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
