import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { resolvePublicImage } from '../lib/media';

export interface PromoCard {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface PromoContent {
  heading: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  cards: PromoCard[];
}

const PROMO_PATH = path.join(process.cwd(), 'content/settings/promo.yaml');

const FALLBACK: PromoContent = {
  heading: 'Koper PP Premium',
  description:
    'Anti pecah, lentur & kuat — tersedia 20", 24" & 28" dengan pilihan warna bebas.',
  primaryCtaLabel: 'Koper PP Premium →',
  primaryCtaHref: '/produk/koper-premium-polypropylane',
  secondaryCtaLabel: 'Semua Produk →',
  secondaryCtaHref: '/katalog',
  cards: [
    {
      image: '/images/koper-premium-polypropylane/images/0.jpg',
      alt: 'Koleksi koper Berkah Koper — warna & model lengkap Haji & Umrah',
      eyebrow: 'Koper PP Premium',
      title: 'Anti Pecah, Lentur & Kuat',
      subtitle: 'Lihat detail →',
      href: '/produk/koper-premium-polypropylane',
    },
    {
      image: '/images/koper-premium-polypropylane/images/1.jpg',
      alt: 'Koper PP Polypropylene anti pecah — lentur dan kuat',
      eyebrow: 'Bahan PP Polypropylene',
      title: 'Anti Pecah!',
      subtitle: 'Tersedia uk. 20", 24" & 28"',
      href: '/produk/koper-premium-polypropylane',
    },
  ],
};

function normalizeCard(
  raw: Partial<PromoCard> | undefined,
  fallback: PromoCard,
): PromoCard {
  const image = resolvePublicImage(raw?.image?.trim() || fallback.image);
  return {
    image: image || fallback.image,
    alt: raw?.alt?.trim() || fallback.alt,
    eyebrow: raw?.eyebrow?.trim() || fallback.eyebrow,
    title: raw?.title?.trim() || fallback.title,
    subtitle: raw?.subtitle?.trim() || fallback.subtitle,
    href: raw?.href?.trim() || fallback.href,
  };
}

export function getPromo(): PromoContent {
  if (!fs.existsSync(PROMO_PATH)) return FALLBACK;

  try {
    const data = loadYaml(fs.readFileSync(PROMO_PATH, 'utf8')) as Partial<
      PromoContent & { cards?: Partial<PromoCard>[] }
    >;
    const rawCards = Array.isArray(data.cards) ? data.cards : [];

    const cards = rawCards
      .slice(0, 4)
      .map((raw, i) =>
        normalizeCard(raw, FALLBACK.cards[i] ?? FALLBACK.cards[0]),
      );

    return {
      heading: data.heading?.trim() || FALLBACK.heading,
      description: data.description?.trim() || FALLBACK.description,
      primaryCtaLabel: data.primaryCtaLabel?.trim() || FALLBACK.primaryCtaLabel,
      primaryCtaHref: data.primaryCtaHref?.trim() || FALLBACK.primaryCtaHref,
      secondaryCtaLabel:
        data.secondaryCtaLabel?.trim() || FALLBACK.secondaryCtaLabel,
      secondaryCtaHref:
        data.secondaryCtaHref?.trim() || FALLBACK.secondaryCtaHref,
      cards: cards.length ? cards : FALLBACK.cards,
    };
  } catch {
    return FALLBACK;
  }
}
