import { Product } from '../types';
import { resolveImageUrl } from '../assets/shoeImages';

const VIDEO_EXT_REGEX = /\.(mp4|webm|mov|m4v|ogg|ogv)(\?|#|$)/i;

/**
 * Detects whether a media string/URL represents a video asset.
 * Compatible with existing `Product.images` string array without schema changes.
 */
export function isVideoMedia(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/^data:video\//i.test(trimmed)) return true;
  if (trimmed.includes('#video')) return true;
  if (VIDEO_EXT_REGEX.test(trimmed)) return true;
  return false;
}

export interface ProductMediaCollection {
  images: string[];
  videos: string[];
}

/**
 * Separates product colors & gallery media into crisp image URLs and video URLs
 * while preserving original ordering and never mutating the product schema.
 */
export function extractProductMedia(product: Product, activeColorImage?: string): ProductMediaCollection {
  const seenImages = new Set<string>();
  const images: string[] = [];
  const videos: string[] = [];

  const pushMedia = (raw?: string) => {
    if (!raw || !raw.trim()) return;
    if (isVideoMedia(raw)) {
      const clean = raw.trim();
      if (!videos.includes(clean)) videos.push(clean);
    } else {
      const resolved = resolveImageUrl(raw);
      if (resolved && !seenImages.has(resolved)) {
        seenImages.add(resolved);
        images.push(resolved);
      }
    }
  };

  if (activeColorImage) {
    pushMedia(activeColorImage);
  }
  for (const color of product.colors || []) {
    pushMedia(color.image);
  }
  for (const extra of product.images || []) {
    pushMedia(extra);
  }

  return { images, videos };
}
