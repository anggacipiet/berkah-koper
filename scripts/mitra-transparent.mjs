import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public/images/client');
const files = fs
  .readdirSync(dir)
  .filter((f) => /^mitra-\d+\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

let converted = 0;

for (const file of files) {
  const src = path.join(dir, file);
  const base = file.replace(/\.(jpe?g|png|webp)$/i, '');
  const dest = path.join(dir, `${base}.png`);

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Near-white / off-white → transparent (keep colored pixels)
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const isNearWhite = min >= 232 && max - min <= 28;

    if (isNearWhite) {
      // Soft edge: whiter = more transparent
      const t = Math.min(1, (min - 232) / (255 - 232));
      data[i + 3] = Math.round(255 * (1 - t));
      if (min >= 248) data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  if (path.resolve(src) !== path.resolve(dest)) {
    fs.unlinkSync(src);
  }
  converted += 1;
  process.stdout.write(`\r${converted}/${files.length}`);
}

console.log(`\nDone: ${converted} logos → PNG transparan`);
