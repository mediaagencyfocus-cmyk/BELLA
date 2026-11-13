import heroEditorialImg from './images/bella_hero_editorial_1794577994863.jpg';
import atelierCraftImg from './images/bella_atelier_craft_1794577996182.jpg';
import womensHeelsImg from './images/bella_womens_heels_1794318693049.jpg';
import luxurySneakerImg from './images/bella_luxury_sneaker_1794318695413.jpg';
import mensOxfordImg from './images/bella_mens_oxford_1794318693998.jpg';
import kidsSneakerImg from './images/bella_kids_sneaker_1794318694569.jpg';

export const SHOE_IMAGES = {
  heroEditorial: heroEditorialImg,
  atelierCraft: atelierCraftImg,
  womensHeels: womensHeelsImg,
  luxurySneaker: luxurySneakerImg,
  mensOxford: mensOxfordImg,
  kidsSneaker: kidsSneakerImg,
} as const;

const LEGACY_IMAGE_MAP: Record<string, string> = {
  '/src/assets/images/bella_hero_editorial_1794577994863.jpg': heroEditorialImg,
  '/src/assets/images/bella_atelier_craft_1794577996182.jpg': atelierCraftImg,
  '/src/assets/images/bella_womens_heels_1794318693049.jpg': womensHeelsImg,
  '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg': luxurySneakerImg,
  '/src/assets/images/bella_mens_oxford_1794318693998.jpg': mensOxfordImg,
  '/src/assets/images/bella_kids_sneaker_1794318694569.jpg': kidsSneakerImg,
};

/**
 * Resolves any stored product/editorial image path (including legacy
 * `/src/assets/images/...` strings saved in Firestore, Supabase, or localStorage)
 * into the production-bundled Vite asset URL so images never break in production.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return womensHeelsImg;
  const trimmed = url.trim();
  if (LEGACY_IMAGE_MAP[trimmed]) {
    return LEGACY_IMAGE_MAP[trimmed];
  }
  // Match by filename even if prefixed differently
  for (const [legacyPath, bundledUrl] of Object.entries(LEGACY_IMAGE_MAP)) {
    const filename = legacyPath.split('/').pop();
    if (filename && trimmed.endsWith(filename)) {
      return bundledUrl;
    }
  }
  return trimmed;
}
