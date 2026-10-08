import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';

export interface TentangItem {
  icon: string;
  title: string;
  desc: string;
}

export interface TentangContent {
  heading: string;
  description: string;
  items: TentangItem[];
}

const TENTANG_PATH = path.join(process.cwd(), 'content/settings/tentang.yaml');

const FALLBACK: TentangContent = {
  heading: 'Mengapa Memilih Berkah Koper?',
  description:
    'Fokus pada kekhusyukan ibadah — biarkan kami menjaga keamanan barang bawaan Anda.',
  items: [
    {
      icon: '🏆',
      title: 'Kualitas Premium',
      desc: 'ABS, Polycarbonate, dan Polypropylene anti pecah — kuat untuk perjalanan jauh.',
    },
    {
      icon: '🎨',
      title: 'Custom Warna & Logo',
      desc: 'Warna body & aksesori bebas. Logo & nama jamaah gratis untuk order grup.',
    },
    {
      icon: '🔒',
      title: 'Perlindungan Maksimal',
      desc: 'Kunci kombinasi 3-digit dan konstruksi kokoh untuk barang berharga.',
    },
    {
      icon: '🚚',
      title: 'Free Ongkir Jakarta',
      desc: 'Gratis area Kalideres & sekitarnya. Kirim ke seluruh Indonesia.',
    },
  ],
};

function normalizeItems(raw: Partial<TentangItem>[] | undefined): TentangItem[] {
  if (!raw?.length) return FALLBACK.items;
  const items = raw
    .map((item) => {
      if (!item?.title || !item?.desc) return null;
      return {
        icon: item.icon?.trim() || '•',
        title: item.title.trim(),
        desc: item.desc.trim(),
      };
    })
    .filter((item): item is TentangItem => Boolean(item));
  return items.length ? items : FALLBACK.items;
}

export function getTentang(): TentangContent {
  if (!fs.existsSync(TENTANG_PATH)) return FALLBACK;

  try {
    const raw = fs.readFileSync(TENTANG_PATH, 'utf8');
    const data = loadYaml(raw) as Partial<TentangContent>;

    return {
      heading: data.heading?.trim() || FALLBACK.heading,
      description: data.description?.trim() || FALLBACK.description,
      items: normalizeItems(data.items),
    };
  } catch {
    return FALLBACK;
  }
}
