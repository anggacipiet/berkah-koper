/**
 * Otomatis di npm run build/dev — user Keystatic cukup upload JPG/PNG.
 * Convert ke WebP (kualitas tinggi) untuk hero, produk, promo, mitra, hubungi.
 * Skip folder Katalog (scan PDF, jarang di halaman utama).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'public', 'images');
const SKIP_DIR = /katalog/i;
const force = process.argv.includes('--force');

/** Preset per folder (relatif ke public/images) */
function presetFor(relPosix) {
  if (relPosix.startsWith('slides/')) {
    return { maxW: 1920, maxH: 1920, quality: 85 };
  }
  if (relPosix.startsWith('cards/') || relPosix.startsWith('promo/')) {
    return { maxW: 1400, maxH: 1800, quality: 88 };
  }
  if (relPosix.startsWith('client/')) {
    return { maxW: 480, maxH: 480, quality: 82 };
  }
  if (relPosix.startsWith('hubungi/') || relPosix.startsWith('berkah-koper-group/')) {
    return { maxW: 1000, maxH: 1000, quality: 85 };
  }
  // produk & lainnya
  return { maxW: 1400, maxH: 1400, quality: 86 };
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIR.test(name.name)) continue;
      walk(full, out);
    } else if (/\.(jpe?g|png)$/i.test(name.name)) {
      out.push(full);
    }
  }
  return out;
}

const sources = walk(ROOT);
let done = 0;
let skipped = 0;

console.log(`[optimize:images] ${sources.length} file jpg/png (skip Katalog)`);

for (const src of sources) {
  const out = src.replace(/\.(jpe?g|png)$/i, '.webp');
  const srcStat = fs.statSync(src);
  if (
    !force &&
    fs.existsSync(out) &&
    fs.statSync(out).mtimeMs >= srcStat.mtimeMs
  ) {
    skipped++;
    continue;
  }

  const rel = path.relative(ROOT, src).split(path.sep).join('/');
  const { maxW, maxH, quality } = presetFor(rel);

  await sharp(src)
    .rotate()
    .resize({
      width: maxW,
      height: maxH,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({
      quality,
      alphaQuality: 90,
      effort: 5,
      smartSubsample: true,
    })
    .toFile(out);

  done++;
  console.log(
    `  ${rel} -> ${(fs.statSync(out).size / 1024).toFixed(0)}KB (q${quality}, ≤${maxW}px)`,
  );
}

console.log(
  `[optimize:images] selesai: ${done} dibuat, ${skipped} sudah up-to-date`,
);
