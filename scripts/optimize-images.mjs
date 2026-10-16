/**
 * Otomatis di npm run build/dev — user Keystatic cukup upload JPG/PNG.
 * Convert ke WebP + varian .w800.webp (mobile srcset).
 * Skip folder Katalog (scan PDF, jarang di halaman utama).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'public', 'images');
const SKIP_DIR = /katalog/i;
const force = process.argv.includes('--force');
const MOBILE_W = 800;

/** Preset per folder (relatif ke public/images) */
function presetFor(relPosix) {
  // Logo: jangan agresif — pixel hitam (Kaaba) mudah hilang jadi transparan
  if (/^logo\.(png|jpe?g)$/i.test(relPosix)) {
    return {
      maxW: 512,
      maxH: 512,
      quality: 95,
      mobile: false,
      alphaQuality: 100,
      smartSubsample: false,
    };
  }
  if (relPosix.startsWith('slides/')) {
    return { maxW: 1400, maxH: 1400, quality: 84, mobile: true };
  }
  if (relPosix.startsWith('cards/') || relPosix.startsWith('promo/')) {
    return { maxW: 1200, maxH: 1600, quality: 86, mobile: true };
  }
  if (relPosix.startsWith('client/')) {
    return { maxW: 480, maxH: 480, quality: 82, mobile: false };
  }
  if (relPosix.startsWith('hubungi/') || relPosix.startsWith('berkah-koper-group/')) {
    return { maxW: 1000, maxH: 1000, quality: 85, mobile: true };
  }
  // produk, bundling, banner root, dll
  return { maxW: 1200, maxH: 1200, quality: 84, mobile: true };
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIR.test(name.name)) continue;
      walk(full, out);
    } else if (/\.(jpe?g|png)$/i.test(name.name)) {
      // skip generated logo-96 source loops; logo.png is fine
      if (/\.w\d+\.(jpe?g|png)$/i.test(name.name)) continue;
      out.push(full);
    }
  }
  return out;
}

async function writeWebp(
  src,
  out,
  { maxW, maxH, quality, alphaQuality = 90, smartSubsample = true },
) {
  const srcStat = fs.statSync(src);
  if (
    !force &&
    fs.existsSync(out) &&
    fs.statSync(out).mtimeMs >= srcStat.mtimeMs
  ) {
    return 'skip';
  }

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
      alphaQuality,
      effort: 6,
      smartSubsample,
    })
    .toFile(out);

  return 'ok';
}

const sources = walk(ROOT);
let done = 0;
let skipped = 0;

console.log(`[optimize:images] ${sources.length} file jpg/png (skip Katalog)`);

for (const src of sources) {
  const rel = path.relative(ROOT, src).split(path.sep).join('/');
  const { maxW, maxH, quality, mobile } = presetFor(rel);
  const out = src.replace(/\.(jpe?g|png)$/i, '.webp');

  const main = await writeWebp(src, out, { maxW, maxH, quality });
  if (main === 'ok') {
    done++;
    console.log(
      `  ${rel} -> ${(fs.statSync(out).size / 1024).toFixed(0)}KB (q${quality}, ≤${maxW}px)`,
    );
  } else {
    skipped++;
  }

  if (mobile && maxW > MOBILE_W) {
    const outSm = src.replace(/\.(jpe?g|png)$/i, `.w${MOBILE_W}.webp`);
    const sm = await writeWebp(src, outSm, {
      maxW: MOBILE_W,
      maxH: MOBILE_W,
      quality: Math.min(quality, 80),
    });
    if (sm === 'ok') {
      done++;
      console.log(
        `  ${rel} .w${MOBILE_W} -> ${(fs.statSync(outSm).size / 1024).toFixed(0)}KB`,
      );
    } else {
      skipped++;
    }
  }
}

// Logo kecil untuk header/footer (tampil 30–48px) — jaga hitam Kaaba
const logoSrc = path.join(ROOT, 'logo.png');
const logo96 = path.join(ROOT, 'logo-96.webp');
if (fs.existsSync(logoSrc)) {
  const r = await writeWebp(logoSrc, logo96, {
    maxW: 96,
    maxH: 96,
    quality: 92,
    alphaQuality: 100,
    smartSubsample: false,
  });
  if (r === 'ok') {
    done++;
    console.log(
      `  logo.png -> logo-96.webp ${(fs.statSync(logo96).size / 1024).toFixed(0)}KB`,
    );
  } else {
    skipped++;
  }
}

console.log(
  `[optimize:images] selesai: ${done} dibuat, ${skipped} sudah up-to-date`,
);
