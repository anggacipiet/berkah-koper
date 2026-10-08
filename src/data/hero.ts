import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { buildWaLink, resolvePublicImage } from '../lib/media';

export interface HeroSlide {
  src: string;
  alt: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  paragraphs: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  /** Link jadi (sudah di-encode) untuk tombol kedua */
  secondaryCtaHref: string;
  waNumber: string;
  waMessage: string;
  trustItems: string[];
  slides: HeroSlide[];
}

const HERO_PATH = path.join(process.cwd(), 'content/settings/hero.yaml');

const DEFAULT_WA_NUMBER = '6285282400061';
const DEFAULT_WA_MESSAGE =
  "Assalamu'alaikum Berkah Koper, saya ingin tanya produk untuk Haji/Umrah.";

const FALLBACK: HeroContent = {
  eyebrow: '✦ Supplier Koper & Tas Haji & Umrah',
  headline: 'Persiapkan perjalanan Umroh Anda',
  headlineAccent: ' dengan perlengkapan terbaik.',
  paragraphs: [
    'Hadirkan kenyamanan dan ketenangan dalam setiap langkah ibadah Anda dengan koleksi koper dan tas travel berkualitas kami.',
    'Perjalanan suci Umroh membutuhkan persiapan yang matang, termasuk pemilihan koper dan tas yang handal.',
    'Koleksi kami dirancang khusus untuk memenuhi kebutuhan jamaah, memastikan barang bawaan Anda aman, terorganisir, dan mudah dibawa selama di Tanah Suci.',
  ],
  primaryCtaLabel: 'Lihat Semua Produk →',
  primaryCtaHref: '/katalog',
  secondaryCtaLabel: 'Konsultasi Gratis',
  secondaryCtaHref: buildWaLink(DEFAULT_WA_MESSAGE, DEFAULT_WA_NUMBER),
  waNumber: DEFAULT_WA_NUMBER,
  waMessage: DEFAULT_WA_MESSAGE,
  trustItems: ['Harga Pabrik', 'Pengiriman Tepat Waktu', 'Banyak Model & Warna'],
  slides: [
    {
      src: '/images/slides/0/image.jpg',
      alt: 'Promo Travel Umroh — Paket Hemat koper cream merah set lengkap',
    },
    {
      src: '/images/slides/1/image.jpg',
      alt: 'Promo Travel Umroh — Paket Hemat koper hijau set lengkap',
    },
    {
      src: '/images/slides/2/image.jpg',
      alt: 'Koleksi Koper Premium Berkah Koper — berbagai warna pilihan',
    },
  ],
};

type RawSlide = {
  image?: string | null;
  src?: string | null;
  alt?: string | null;
};

function normalizeSlides(raw: RawSlide[] | undefined): HeroSlide[] {
  if (!raw?.length) return FALLBACK.slides;
  const slides = raw
    .map((s, i) => {
      const fallback = FALLBACK.slides[i];
      const file = s.image ?? s.src;
      const src = file ? resolvePublicImage(file) : fallback?.src;
      if (!src) return null;
      return {
        src,
        alt: s.alt || fallback?.alt || 'Foto hero Berkah Koper',
      };
    })
    .filter((s): s is HeroSlide => Boolean(s));
  return slides.length ? slides : FALLBACK.slides;
}

export function getHero(): HeroContent {
  if (!fs.existsSync(HERO_PATH)) return FALLBACK;

  try {
    const raw = fs.readFileSync(HERO_PATH, 'utf8');
    const data = loadYaml(raw) as Partial<HeroContent> & {
      slides?: RawSlide[];
      secondaryCtaHref?: string;
    };

    const waNumber = data.waNumber || FALLBACK.waNumber;
    const waMessage = data.waMessage || FALLBACK.waMessage;

    return {
      ...FALLBACK,
      ...data,
      paragraphs: data.paragraphs?.length ? data.paragraphs : FALLBACK.paragraphs,
      trustItems: data.trustItems?.length ? data.trustItems : FALLBACK.trustItems,
      waNumber,
      waMessage,
      secondaryCtaHref: buildWaLink(waMessage, waNumber),
      slides: normalizeSlides(data.slides),
    };
  } catch {
    return FALLBACK;
  }
}
