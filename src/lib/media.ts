import fs from 'node:fs';
import path from 'node:path';

const MOBILE_W = 800;

function publicDiskPath(publicUrl: string): string {
  return path.join(process.cwd(), 'public', publicUrl.replace(/^\//, ''));
}

/** ?v= size agar CDN/browser tidak menahan WebP lama setelah ganti JPG di Keystatic */
function withCacheBust(publicUrl: string): string {
  try {
    const st = fs.statSync(publicDiskPath(publicUrl));
    const sep = publicUrl.includes('?') ? '&' : '?';
    return `${publicUrl}${sep}v=${st.size}`;
  } catch {
    return publicUrl;
  }
}

/**
 * Jika ada .webp hasil build optimize (di samping jpg/png), pakai itu.
 * User CMS cukup upload JPG/PNG — tanpa langkah manual.
 */
export function preferOptimizedImage(publicUrl: string): string {
  if (!publicUrl || !/\.(jpe?g|png|webp)$/i.test(publicUrl)) return publicUrl;
  if (publicUrl.startsWith('http://') || publicUrl.startsWith('https://')) {
    return publicUrl;
  }
  let url = publicUrl;
  if (/\.(jpe?g|png)$/i.test(publicUrl)) {
    const webpUrl = publicUrl.replace(/\.(jpe?g|png)$/i, '.webp');
    url = fs.existsSync(publicDiskPath(webpUrl)) ? webpUrl : publicUrl;
  }
  return withCacheBust(url);
}

/** Resolve nilai gambar Keystatic / path lama menjadi URL publik (+ WebP otomatis) */
export function resolvePublicImage(
  value: string | null | undefined,
  publicPath = '/images/',
): string {
  if (!value) return '';
  let resolved: string;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    resolved = value;
  } else {
    const base = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;
    resolved = `${base}${value.replace(/^\//, '')}`;
  }
  return preferOptimizedImage(resolved);
}

export type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
};

/**
 * srcset mobile (.w800.webp) + penuh. src = versi kecil agar default hemat.
 */
export function responsiveImage(
  publicUrl: string,
  sizes = '(max-width: 768px) 100vw, 50vw',
): ResponsiveImage {
  if (!publicUrl) return { src: '' };
  if (publicUrl.startsWith('http://') || publicUrl.startsWith('https://')) {
    return { src: publicUrl };
  }

  const full = preferOptimizedImage(publicUrl);
  const fullPath = full.split('?')[0] ?? full;
  if (!/\.webp$/i.test(fullPath)) return { src: full };

  const smPath = fullPath.replace(/\.webp$/i, `.w${MOBILE_W}.webp`);
  if (!fs.existsSync(publicDiskPath(smPath))) return { src: full };

  const sm = withCacheBust(smPath);
  return {
    src: sm,
    srcset: `${sm} ${MOBILE_W}w, ${full} 1400w`,
    sizes,
  };
}

export function buildWaLink(
  message: string,
  phone = '6285282400061',
): string {
  const digits = normalizeWaDigits(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Normalisasi ke format internasional 62… */
export function normalizeWaDigits(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('0')) d = `62${d.slice(1)}`;
  if (!d.startsWith('62') && d.length >= 9) d = `62${d}`;
  return d;
}

/** 6285282400061 → 0852-8240-0061 */
export function formatWaDisplay(phone: string): string {
  const d = normalizeWaDigits(phone);
  if (d.startsWith('62') && d.length >= 10) {
    const local = `0${d.slice(2)}`;
    if (local.length >= 11) {
      return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
    }
    return local;
  }
  return phone;
}
