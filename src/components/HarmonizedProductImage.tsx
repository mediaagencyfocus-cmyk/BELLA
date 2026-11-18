import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useHarmonizedImage } from '../utils/imageHarmonyAgent';

interface HarmonizedProductImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  priority?: boolean;
}

/**
 * Luxury 1:1 square product image frame with subtle 8px radius,
 * automatic AI Image Harmony background integration, full product containment
 * (never crops/stretches), and low-resolution clarity protection.
 */
export const HarmonizedProductImage: React.FC<HarmonizedProductImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  onClick,
  priority = false,
}) => {
  const { result, displaySrc } = useHarmonizedImage(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Soft, unobtrusive ambient backdrop synced with Harmony Agent edge color when available
  const backdropStyle: React.CSSProperties | undefined =
    result?.status === 'processed'
      ? { background: result.ambientBackdropCss }
      : result?.dominantBgHex && result.dominantBgRgb
        ? {
            background:
              result.dominantBgRgb.r + result.dominantBgRgb.g + result.dominantBgRgb.b < 140
                ? result.dominantBgHex
                : result.ambientBackdropCss,
          }
        : undefined;

  const isLowRes = Boolean(result?.isLowResolution);

  return (
    <div
      onClick={onClick}
      style={backdropStyle}
      className={`relative aspect-square w-full rounded-[8px] overflow-hidden bg-[#F5F5F3] dark:bg-[#13151B] flex items-center justify-center transition-colors duration-300 ${className}`}
    >
      {!hasError && displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
          className={`${
            isLowRes
              ? 'max-w-full max-h-full w-auto h-auto object-contain'
              : 'w-full h-full object-contain'
          } transition-transform duration-500 ease-out select-none ${imgClassName}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F5F3] dark:bg-[#141720] text-slate-400 dark:text-slate-500 px-3 text-center">
          <ShoppingBag className="w-7 h-7 mb-1.5 text-slate-400 dark:text-slate-500" />
          <span className="text-[11px] font-bold font-brand tracking-wider text-slate-500 dark:text-slate-400">
            BELLA SHOES
          </span>
        </div>
      )}
    </div>
  );
};
