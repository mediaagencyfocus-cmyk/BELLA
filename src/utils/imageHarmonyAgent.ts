import { useState, useEffect } from 'react';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export type HarmonyStatus = 'processed' | 'fallback-original';

export interface ImageHarmonyResult {
  originalSrc: string;
  displaySrc: string;
  status: HarmonyStatus;
  confidence: number;
  dominantBgRgb: RgbColor;
  paleEdgeRgb: RgbColor;
  dominantBgHex: string;
  paleEdgeHex: string;
  ambientBackdropCss: string;
  naturalWidth: number;
  naturalHeight: number;
  isLowResolution: boolean;
  reason?: string;
}

const MAX_CACHE_ENTRIES = 80;
const MAX_PROCESSING_DIM = 760;
const harmonyCache = new Map<string, ImageHarmonyResult>();
const inFlightRequests = new Map<string, Promise<ImageHarmonyResult>>();

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return (
    '#' +
    [clampByte(r), clampByte(g), clampByte(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  if (s === 0) {
    const val = clampByte(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: clampByte(hue2rgb(p, q, h + 1 / 3) * 255),
    g: clampByte(hue2rgb(p, q, h) * 255),
    b: clampByte(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Generates a refined, pale edge color harmonious with the extracted background color:
 * - Blue -> pale soft sky blue
 * - Red -> pale soft blush pink
 * - Green -> pale soft mint green
 * - Dark studio -> gentle softened charcoal-slate
 */
export function deriveHarmonizedPalette(bg: RgbColor): {
  innerTint: RgbColor;
  paleEdge: RgbColor;
} {
  const { h, s, l } = rgbToHsl(bg.r, bg.g, bg.b);

  // Neutral vs Chromatic handling
  const isChromatic = s >= 0.1;

  if (l < 0.24) {
    // Deep studio background: gently soften toward elevated slate without harsh contrast
    const edgeL = Math.min(0.3, l + 0.1);
    const innerL = Math.min(0.24, l + 0.04);
    const targetS = isChromatic ? Math.min(0.28, s * 0.65) : s * 0.5;
    return {
      innerTint: hslToRgb(h, targetS, innerL),
      paleEdge: hslToRgb(h, targetS * 0.85, edgeL),
    };
  }

  // Standard / Bright / Chromatic backgrounds -> fade into pale airy pastel/ivory at outer edges
  const innerS = isChromatic ? Math.max(0.12, Math.min(0.55, s * 0.72)) : s * 0.65;
  const innerL = Math.min(0.95, Math.max(l, l + (0.95 - l) * 0.25));

  const edgeS = isChromatic ? Math.max(0.14, Math.min(0.42, s * 0.48)) : s * 0.45;
  const edgeL = Math.min(0.96, Math.max(0.87, l + (0.96 - l) * 0.74));

  return {
    innerTint: hslToRgb(h, innerS, innerL),
    paleEdge: hslToRgb(h, edgeS, edgeL),
  };
}

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  // Weighted perceptual RGB distance
  const rmean = (r1 + r2) * 0.5;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    ((2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db) / 9
  );
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface CoreHarmonyOutput {
  applied: boolean;
  confidence: number;
  reason?: string;
  dominantBg: RgbColor;
  paleEdge: RgbColor;
  outputPixels: Uint8ClampedArray;
}

/**
 * Pure pixel-level AI Image Harmony Agent algorithm.
 * Strictly guarantees:
 * 1. Background extraction & edge-aware border flood-fill segmentation.
 * 2. Foreground (product) pixels are copied 100% verbatim without any tint, filter, or shape shift.
 * 3. Low-confidence or complex/inseparable backgrounds fall back cleanly to original untouched pixels.
 */
export function processPixelsWithHarmonyAgent(
  orig: Uint8ClampedArray,
  width: number,
  height: number
): CoreHarmonyOutput {
  const total = width * height;
  const defaultBg: RgbColor = { r: 245, g: 245, b: 244 };

  if (width < 24 || height < 24 || orig.length < total * 4) {
    return {
      applied: false,
      confidence: 0,
      reason: 'image-too-small',
      dominantBg: defaultBg,
      paleEdge: defaultBg,
      outputPixels: orig,
    };
  }

  // 1. Sample upper & side perimeter bands to identify dominant background color
  const borderDepth = Math.max(3, Math.min(12, Math.round(Math.min(width, height) * 0.04)));
  const bucketMap = new Map<string, { count: number; rSum: number; gSum: number; bSum: number }>();
  let perimeterSamples = 0;

  const samplePixel = (x: number, y: number, weight: number) => {
    const idx = (y * width + x) * 4;
    if (orig[idx + 3] < 20) return;
    const r = orig[idx];
    const g = orig[idx + 1];
    const b = orig[idx + 2];
    const key = `${Math.floor(r / 14)},${Math.floor(g / 14)},${Math.floor(b / 14)}`;
    const entry = bucketMap.get(key) || { count: 0, rSum: 0, gSum: 0, bSum: 0 };
    entry.count += weight;
    entry.rSum += r * weight;
    entry.gSum += g * weight;
    entry.bSum += b * weight;
    bucketMap.set(key, entry);
    perimeterSamples += weight;
  };

  for (let y = 0; y < borderDepth; y++) {
    for (let x = 0; x < width; x++) samplePixel(x, y, 2); // Top band weighted higher (floor/pedestal at bottom)
  }
  for (let y = borderDepth; y < Math.floor(height * 0.72); y++) {
    for (let x = 0; x < borderDepth; x++) {
      samplePixel(x, y, 1);
      samplePixel(width - 1 - x, y, 1);
    }
  }

  let bestBucket = { count: 0, rSum: 245, gSum: 245, bSum: 244 };
  for (const bucket of bucketMap.values()) {
    if (bucket.count > bestBucket.count) {
      bestBucket = bucket;
    }
  }

  const dominantBg: RgbColor =
    bestBucket.count > 0
      ? {
          r: Math.round(bestBucket.rSum / bestBucket.count),
          g: Math.round(bestBucket.gSum / bestBucket.count),
          b: Math.round(bestBucket.bSum / bestBucket.count),
        }
      : defaultBg;

  const { innerTint, paleEdge } = deriveHarmonizedPalette(dominantBg);

  // Measure uniformity across upper & side border pixels
  let consistentPerimeter = 0;
  let totalCheckedPerimeter = 0;
  for (let y = 0; y < Math.floor(height * 0.7); y++) {
    for (const x of [1, 3, width - 4, width - 2]) {
      const idx = (y * width + x) * 4;
      totalCheckedPerimeter++;
      if (colorDist(orig[idx], orig[idx + 1], orig[idx + 2], dominantBg.r, dominantBg.g, dominantBg.b) <= 32) {
        consistentPerimeter++;
      }
    }
  }
  for (let x = 0; x < width; x += 2) {
    const idx = (2 * width + x) * 4;
    totalCheckedPerimeter++;
    if (colorDist(orig[idx], orig[idx + 1], orig[idx + 2], dominantBg.r, dominantBg.g, dominantBg.b) <= 32) {
      consistentPerimeter++;
    }
  }

  const borderUniformity = totalCheckedPerimeter > 0 ? consistentPerimeter / totalCheckedPerimeter : 0;

  // Reject complex/multi-object backgrounds immediately so the product & scene stay 100% authentic
  if (borderUniformity < 0.7) {
    return {
      applied: false,
      confidence: Number(borderUniformity.toFixed(2)),
      reason: 'non-uniform-background',
      dominantBg,
      paleEdge,
      outputPixels: orig,
    };
  }

  // 2. Compute grayscale & Sobel edge magnitude barrier
  const gray = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    gray[i] = 0.299 * orig[p] + 0.587 * orig[p + 1] + 0.114 * orig[p + 2];
  }

  const edgeMag = new Float32Array(total);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const gx =
        -gray[i - width - 1] +
        gray[i - width + 1] -
        2 * gray[i - 1] +
        2 * gray[i + 1] -
        gray[i + width - 1] +
        gray[i + width + 1];
      const gy =
        -gray[i - width - 1] -
        2 * gray[i - width] -
        gray[i - width + 1] +
        gray[i + width - 1] +
        2 * gray[i + width] +
        gray[i + width + 1];
      edgeMag[i] = Math.sqrt(gx * gx + gy * gy) * 0.25;
    }
  }

  // Stricter thresholds on dark studio backgrounds to prevent dark-on-dark shoe bleed
  const bgLum = luminance(dominantBg.r, dominantBg.g, dominantBg.b);
  const isDarkBg = bgLum < 45;
  const maxBgDist = isDarkBg ? 20 : 30;
  const maxStepDist = isDarkBg ? 10 : 14;
  const edgeWallThresh = isDarkBg ? 12 : 18;

  // 3. Border-connected flood fill (never touches enclosed product details)
  const bgMask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const trySeed = (x: number, y: number) => {
    const i = y * width + x;
    if (bgMask[i]) return;
    const p = i * 4;
    const dist = colorDist(orig[p], orig[p + 1], orig[p + 2], dominantBg.r, dominantBg.g, dominantBg.b);
    if (dist <= maxBgDist * 0.85 && edgeMag[i] < edgeWallThresh) {
      bgMask[i] = 1;
      queue[tail++] = i;
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = (curr - cx) / width;
    const cp = curr * 4;

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (let k = 0; k < 4; k++) {
      const ni = neighbors[k];
      if (ni < 0 || bgMask[ni]) continue;
      if (edgeMag[ni] >= edgeWallThresh) continue;

      const np = ni * 4;
      const distToBg = colorDist(
        orig[np],
        orig[np + 1],
        orig[np + 2],
        dominantBg.r,
        dominantBg.g,
        dominantBg.b
      );
      if (distToBg > maxBgDist) continue;

      const stepDiff = colorDist(
        orig[np],
        orig[np + 1],
        orig[np + 2],
        orig[cp],
        orig[cp + 1],
        orig[cp + 2]
      );
      if (stepDiff > maxStepDist) continue;

      bgMask[ni] = 1;
      queue[tail++] = ni;
    }
  }

  const bgFraction = tail / total;

  // Check center box (where product sits) to detect flood leakage into the subject
  let centerBgCount = 0;
  let centerTotal = 0;
  const cxStart = Math.floor(width * 0.35);
  const cxEnd = Math.floor(width * 0.65);
  const cyStart = Math.floor(height * 0.35);
  const cyEnd = Math.floor(height * 0.65);
  for (let y = cyStart; y < cyEnd; y++) {
    for (let x = cxStart; x < cxEnd; x++) {
      centerTotal++;
      if (bgMask[y * width + x]) centerBgCount++;
    }
  }
  const centerBgRatio = centerTotal > 0 ? centerBgCount / centerTotal : 0;

  // High confidence check: reject if background too sparse, too huge (bleed), or ate the center subject
  if (bgFraction < 0.14 || bgFraction > 0.86 || (isDarkBg && centerBgRatio > 0.45) || centerBgRatio > 0.7) {
    return {
      applied: false,
      confidence: Number((borderUniformity * 0.5).toFixed(2)),
      reason: bgFraction > 0.86 || centerBgRatio > 0.7 ? 'foreground-bleed-risk' : 'insufficient-background',
      dominantBg,
      paleEdge,
      outputPixels: orig,
    };
  }

  // 4. Safety Erosion (2px outward from product): guarantee product edge anti-aliasing is NEVER touched
  const safeBg = new Uint8Array(bgMask);
  for (let pass = 0; pass < 2; pass++) {
    const prev = new Uint8Array(safeBg);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        if (!prev[i]) continue;
        if (!prev[i - 1] || !prev[i + 1] || !prev[i - width] || !prev[i + width]) {
          safeBg[i] = 0;
        }
      }
    }
  }

  // 5. Compute smooth outward distance feather (0 = adjacent to product -> 1 = deep background)
  const featherRadius = 6;
  const bgDistMap = new Uint8Array(total);
  bgDistMap.fill(255);
  const distQueue = new Int32Array(total);
  let dHead = 0;
  let dTail = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      if (safeBg[i] === 0) {
        bgDistMap[i] = 0;
        if (safeBg[i - 1] || safeBg[i + 1] || safeBg[i - width] || safeBg[i + width]) {
          distQueue[dTail++] = i;
        }
      }
    }
  }

  while (dHead < dTail) {
    const curr = distQueue[dHead++];
    const nextDist = bgDistMap[curr] + 1;
    if (nextDist > featherRadius) continue;
    const cx = curr % width;
    const cy = (curr - cx) / width;

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];
    for (let k = 0; k < 4; k++) {
      const ni = neighbors[k];
      if (ni >= 0 && safeBg[ni] && bgDistMap[ni] > nextDist) {
        bgDistMap[ni] = nextDist;
        distQueue[dTail++] = ni;
      }
    }
  }

  // 6. Compose harmonized studio radial gradient ONLY on safe background pixels
  const out = new Uint8ClampedArray(orig);
  const centerX = width * 0.5;
  const centerY = height * 0.48;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!safeBg[i]) {
        // STRICT GUARANTEE: 100% original product pixels preserved verbatim
        continue;
      }

      const d = bgDistMap[i] >= featherRadius ? 1 : bgDistMap[i] / featherRadius;
      // Smoothstep curve for invisible, silky transition at product perimeter
      const feather = d * d * (3 - 2 * d);

      const dx = x - centerX;
      const dy = y - centerY;
      const radialT = Math.min(1, Math.sqrt(dx * dx + dy * dy) / maxRadius);
      // Center stays closer to dominant tone; outer corners fade softly toward pale edge tint
      const gradT = Math.pow(radialT, 1.2);

      const gradR = innerTint.r + (paleEdge.r - innerTint.r) * gradT;
      const gradG = innerTint.g + (paleEdge.g - innerTint.g) * gradT;
      const gradB = innerTint.b + (paleEdge.b - innerTint.b) * gradT;

      const p = i * 4;
      // Preserve subtle original shadow depth near foreground while harmonizing outer edges cleanly
      const alpha = feather * (0.45 + 0.52 * gradT);
      out[p] = clampByte(orig[p] * (1 - alpha) + gradR * alpha);
      out[p + 1] = clampByte(orig[p + 1] * (1 - alpha) + gradG * alpha);
      out[p + 2] = clampByte(orig[p + 2] * (1 - alpha) + gradB * alpha);
      out[p + 3] = orig[p + 3];
    }
  }

  const confidence = Number(
    Math.min(0.99, borderUniformity * 0.7 + (1 - centerBgRatio) * 0.3).toFixed(2)
  );

  return {
    applied: true,
    confidence,
    dominantBg,
    paleEdge,
    outputPixels: out,
  };
}

function setBoundedCache(key: string, value: ImageHarmonyResult) {
  if (harmonyCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = harmonyCache.keys().next().value;
    if (oldestKey) harmonyCache.delete(oldestKey);
  }
  harmonyCache.set(key, value);
}

function buildFallbackResult(
  src: string,
  reason: string,
  dominantBg: RgbColor = { r: 244, g: 244, b: 242 },
  naturalWidth = 0,
  naturalHeight = 0
): ImageHarmonyResult {
  const { paleEdge } = deriveHarmonizedPalette(dominantBg);
  const dominantBgHex = rgbToHex(dominantBg);
  const paleEdgeHex = rgbToHex(paleEdge);
  const isLowResolution =
    naturalWidth > 0 &&
    naturalHeight > 0 &&
    (Math.max(naturalWidth, naturalHeight) < 360 || Math.min(naturalWidth, naturalHeight) < 220);

  return {
    originalSrc: src,
    displaySrc: src,
    status: 'fallback-original',
    confidence: 0,
    dominantBgRgb: dominantBg,
    paleEdgeRgb: paleEdge,
    dominantBgHex,
    paleEdgeHex,
    ambientBackdropCss: `radial-gradient(circle at 50% 45%, ${dominantBgHex} 0%, ${paleEdgeHex} 100%)`,
    naturalWidth,
    naturalHeight,
    isLowResolution,
    reason,
  };
}

/**
 * Loads an image in the browser, extracts background dominant color, runs high-confidence
 * foreground-safe Harmony Agent, and caches an independent processed display asset.
 * Always keeps `originalSrc` intact.
 */
export async function analyzeAndHarmonizeImage(src: string): Promise<ImageHarmonyResult> {
  if (!src || typeof window === 'undefined' || typeof document === 'undefined') {
    return buildFallbackResult(src, 'no-browser-context');
  }

  const cached = harmonyCache.get(src);
  if (cached) return cached;

  const existingPromise = inFlightRequests.get(src);
  if (existingPromise) return existingPromise;

  const promise = (async (): Promise<ImageHarmonyResult> => {
    // Skip SVG vector graphics
    if (/\.svg(\?|$)|^data:image\/svg/i.test(src)) {
      const res = buildFallbackResult(src, 'vector-svg');
      setBoundedCache(src, res);
      return res;
    }

    const loadImage = (withCors: boolean) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        if (withCors) img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = src;
      });

    try {
      const isExternalHttp = /^https?:\/\//i.test(src) && !src.startsWith(window.location.origin);
      const img = await loadImage(isExternalHttp);
      const nw = img.naturalWidth || 0;
      const nh = img.naturalHeight || 0;

      if (nw === 0 || nh === 0) {
        const res = buildFallbackResult(src, 'empty-dimensions');
        setBoundedCache(src, res);
        return res;
      }

      const isLowResolution = Math.max(nw, nh) < 360 || Math.min(nw, nh) < 220;

      // Never upscale low-res photos during processing
      const scale = Math.min(1, MAX_PROCESSING_DIM / Math.max(nw, nh));
      const procW = Math.max(24, Math.round(nw * scale));
      const procH = Math.max(24, Math.round(nh * scale));

      const canvas = document.createElement('canvas');
      canvas.width = procW;
      canvas.height = procH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        const res = buildFallbackResult(src, 'no-2d-context', undefined, nw, nh);
        setBoundedCache(src, res);
        return res;
      }

      ctx.drawImage(img, 0, 0, procW, procH);

      let imgData: ImageData;
      try {
        imgData = ctx.getImageData(0, 0, procW, procH);
      } catch {
        // Cross-origin tainted canvas: safely render original without distortion
        const res = buildFallbackResult(src, 'cors-protected-original', undefined, nw, nh);
        setBoundedCache(src, res);
        return res;
      }

      const core = processPixelsWithHarmonyAgent(imgData.data, procW, procH);
      const dominantBgHex = rgbToHex(core.dominantBg);
      const paleEdgeHex = rgbToHex(core.paleEdge);
      const ambientBackdropCss = `radial-gradient(circle at 50% 45%, ${dominantBgHex} 0%, ${paleEdgeHex} 100%)`;

      if (!core.applied) {
        const fallbackRes: ImageHarmonyResult = {
          originalSrc: src,
          displaySrc: src,
          status: 'fallback-original',
          confidence: core.confidence,
          dominantBgRgb: core.dominantBg,
          paleEdgeRgb: core.paleEdge,
          dominantBgHex,
          paleEdgeHex,
          ambientBackdropCss,
          naturalWidth: nw,
          naturalHeight: nh,
          isLowResolution,
          reason: core.reason,
        };
        setBoundedCache(src, fallbackRes);
        return fallbackRes;
      }

      const outImageData = new ImageData(new Uint8ClampedArray(core.outputPixels), procW, procH);
      ctx.putImageData(outImageData, 0, 0);
      const processedDataUrl = canvas.toDataURL('image/webp', 0.92);

      const finalResult: ImageHarmonyResult = {
        originalSrc: src,
        displaySrc: processedDataUrl,
        status: 'processed',
        confidence: core.confidence,
        dominantBgRgb: core.dominantBg,
        paleEdgeRgb: core.paleEdge,
        dominantBgHex,
        paleEdgeHex,
        ambientBackdropCss,
        naturalWidth: nw,
        naturalHeight: nh,
        isLowResolution,
      };
      setBoundedCache(src, finalResult);
      return finalResult;
    } catch {
      const res = buildFallbackResult(src, 'processing-skipped');
      setBoundedCache(src, res);
      return res;
    } finally {
      inFlightRequests.delete(src);
    }
  })();

  inFlightRequests.set(src, promise);
  return promise;
}

/**
 * React hook returning the live harmonized display asset while keeping `originalSrc` intact.
 */
export function useHarmonizedImage(src?: string | null): {
  result: ImageHarmonyResult | null;
  displaySrc: string;
  isProcessing: boolean;
} {
  const cleanSrc = (src || '').trim();
  const [result, setResult] = useState<ImageHarmonyResult | null>(() =>
    cleanSrc ? harmonyCache.get(cleanSrc) || null : null
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(() =>
    Boolean(cleanSrc && !harmonyCache.has(cleanSrc))
  );

  useEffect(() => {
    if (!cleanSrc) {
      setResult(null);
      setIsProcessing(false);
      return;
    }

    const hit = harmonyCache.get(cleanSrc);
    if (hit) {
      setResult(hit);
      setIsProcessing(false);
      return;
    }

    let cancelled = false;
    setIsProcessing(true);

    analyzeAndHarmonizeImage(cleanSrc).then((res) => {
      if (!cancelled) {
        setResult(res);
        setIsProcessing(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cleanSrc]);

  return {
    result,
    displaySrc: result?.displaySrc || cleanSrc,
    isProcessing,
  };
}
