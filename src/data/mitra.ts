import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { resolvePublicImage } from '../lib/media';

export interface MitraPartner {
  src: string;
  name: string;
}

export interface MitraContent {
  eyebrow: string;
  heading: string;
  description: string;
  partners: MitraPartner[];
}

const MITRA_YAML = path.join(process.cwd(), 'content/settings/mitra.yaml');
const MITRA_DIR = path.join(process.cwd(), 'content/mitra');
const CLIENT_DIR = path.join(process.cwd(), 'public/images/client');
const CLIENT_PUBLIC = '/images/client/';

const FALLBACK: MitraContent = {
  eyebrow: 'Mitra Travel',
  heading: 'Dipercaya biro umroh & haji',
  description:
    'Logo partner tour yang sudah bekerja sama dengan Berkah Koper untuk perlengkapan jamaah Haji & Umrah.',
  partners: [],
};

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i;

type RawEntry = {
  name?: string;
  order?: number;
  image?: string | null;
};

function loadFromCollection(): MitraPartner[] {
  if (!fs.existsSync(MITRA_DIR)) return [];

  return fs
    .readdirSync(MITRA_DIR)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map((file) => {
      const slug = file.replace(/\.ya?ml$/, '');
      try {
        const data = loadYaml(
          fs.readFileSync(path.join(MITRA_DIR, file), 'utf8'),
        ) as RawEntry;
        if (!data.image) return null;
        // Keystatic + publicPath → "/images/client/{slug}/image.png"
        // Legacy flat → "mitra-001.png"
        const raw = String(data.image).replace(/\\/g, '/');
        const src = raw.startsWith('/')
          ? raw
          : raw.includes('/')
            ? resolvePublicImage(raw)
            : resolvePublicImage(raw, CLIENT_PUBLIC);
        return {
          src,
          name: data.name?.trim() || slug,
          order: data.order ?? 999,
        };
      } catch {
        return null;
      }
    })
    .filter((p): p is MitraPartner & { order: number } => Boolean(p))
    .sort((a, b) => a.order - b.order)
    .map(({ src, name }) => ({ src, name }));
}

/** Cadangan: scan folder jika collection masih kosong */
function scanClientFolder(): MitraPartner[] {
  if (!fs.existsSync(CLIENT_DIR)) return [];

  const partners: MitraPartner[] = [];

  for (const entry of fs.readdirSync(CLIENT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && /^mitra-\d+/i.test(entry.name)) {
      const dir = path.join(CLIENT_DIR, entry.name);
      const img = fs
        .readdirSync(dir)
        .find((f) => /^image\./i.test(f) && IMAGE_RE.test(f));
      if (img) {
        partners.push({
          src: `${CLIENT_PUBLIC}${entry.name}/${img}`,
          name: entry.name,
        });
      }
      continue;
    }
    if (
      entry.isFile() &&
      /^mitra-\d+\./i.test(entry.name) &&
      IMAGE_RE.test(entry.name)
    ) {
      partners.push({
        src: `${CLIENT_PUBLIC}${entry.name}`,
        name: entry.name.replace(/\.[^.]+$/, ''),
      });
    }
  }

  return partners.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}

export function getMitra(): MitraContent {
  const fromCollection = loadFromCollection();
  const partners = fromCollection.length ? fromCollection : scanClientFolder();

  if (!fs.existsSync(MITRA_YAML)) {
    return { ...FALLBACK, partners };
  }

  try {
    const raw = fs.readFileSync(MITRA_YAML, 'utf8');
    const data = loadYaml(raw) as Partial<MitraContent>;

    return {
      eyebrow: data.eyebrow?.trim() || FALLBACK.eyebrow,
      heading: data.heading?.trim() || FALLBACK.heading,
      description: data.description?.trim() || FALLBACK.description,
      partners,
    };
  } catch {
    return { ...FALLBACK, partners };
  }
}
