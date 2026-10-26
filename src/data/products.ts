import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import type { ColorGroup, Product } from '../types/product';
import { getSiteWa } from './hero';
import { buildWaLink, resolvePublicImage } from '../lib/media';

const CONTENT_DIR = path.join(process.cwd(), 'content/products');

/** Pastikan hex valid untuk CSS / ColorPicker (#rrggbb) */
function normalizeHex(hex: string | undefined | null): string {
  if (!hex) return '#888888';
  const cleaned = String(hex).trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3,8}$/.test(cleaned)) return '#888888';
  return `#${cleaned}`;
}

function normalizeColorGroups(
  groups: ColorGroup[] | undefined,
  imageCount: number,
): ColorGroup[] | undefined {
  if (!groups?.length) return groups;
  return groups.map((g) => ({
    ...g,
    colors: (g.colors ?? []).map((c) => {
      let imageIndex = c.imageIndex;
      // CMS sering isi 1 untuk gambar pertama → anggap 1-based jika perlu
      if (typeof imageIndex === 'number' && imageIndex >= 1) {
        if (imageIndex > imageCount - 1 && imageIndex - 1 <= imageCount - 1) {
          imageIndex = imageIndex - 1;
        }
      }
      if (typeof imageIndex === 'number' && (imageIndex < 0 || imageIndex >= imageCount)) {
        imageIndex = undefined;
      }
      return {
        ...c,
        hex: normalizeHex(c.hex),
        imageIndex,
      };
    }),
  }));
}

function loadProducts(): Product[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => {
      const slug = file.replace(/\.ya?ml$/, '');
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      const data = loadYaml(raw) as Omit<Product, 'slug'>;
      const images = (data.images ?? [])
        .map((img) => resolvePublicImage(img))
        .filter(Boolean);
      const colorGroups = normalizeColorGroups(data.colorGroups, images.length);
      return { slug, ...data, images, colorGroups } satisfies Product;
    })
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export const products: Product[] = loadProducts();

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'semua') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  const badged = products.filter((p) => p.badge);
  const rest = products.filter((p) => !p.badge);
  return [...badged, ...rest].slice(0, limit);
}

export function getBundleProducts(): Product[] {
  return products.filter((p) => p.isBundle);
}

/** Teks pesan WA (belum di-encode) */
export function getWaMessageText(product: Product): string {
  if (product.waMessage?.trim()) return product.waMessage.trim();
  return `Assalamu'alaikum Berkah Koper, saya tertarik dengan *${product.name}*. Boleh info stok dan harganya?`;
}

/** Query string untuk ?text= (sudah di-encode) — kompatibel pemakaian lama */
export function buildWaMessage(product: Product): string {
  return encodeURIComponent(getWaMessageText(product));
}

/** URL WhatsApp lengkap — nomor dari Hero Beranda (Keystatic) */
export function buildWaUrl(product: Product, phone?: string): string {
  const { number } = getSiteWa();
  return buildWaLink(getWaMessageText(product), phone || number);
}
