export type ProductCategory =
  | 'koper'
  | 'tas-kabin'
  | 'tas-paspor'
  | 'tas-selempang'
  | 'tas-sandal'
  | 'pouch'
  | 'bundling'
  | 'aksesori';

export interface ProductVariant {
  label: string;       // e.g. "20\"", "24\"", "28\""
  priceAdj?: number;   // tambahan harga dari base price (bisa negatif/0)
}

// Pilihan warna produk dengan swatch hex
export interface ColorOption {
  name: string;        // e.g. "Hijau Army"
  hex: string;         // e.g. "#4a5e3a"
  imageIndex?: number; // index ke images[] yang menampilkan warna ini (opsional)
}

// Grup warna terpisah, misal body vs aksesori
export interface ColorGroup {
  label: string;           // e.g. "Warna Body", "Warna Aksesori (One Color)"
  type: 'body' | 'accent'; // untuk styling swatch berbeda
  colors: ColorOption[];
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  shortDesc: string;
  description: string;
  price: number;           // harga dasar dalam Rupiah
  priceLabel?: string;     // override tampilan harga, e.g. "Mulai Rp 259.000"
  images: string[];        // array URL gambar, index 0 = thumbnail utama
  badge?: string;          // e.g. "TERLARIS", "BARU", "PROMO"
  variants?: ProductVariant[];
  colorGroups?: ColorGroup[]; // pilihan warna interaktif
  features?: string[];     // bullet point keunggulan produk
  weight?: string;         // e.g. "3.2 kg"
  material?: string;       // e.g. "PP Polypropylene"
  sizes?: string[];        // e.g. ["20\"", "24\"", "28\""]
  isBundle?: boolean;
  bundleItems?: string[];
  waMessage?: string;
  inStock: boolean;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'koper':         '🧳 Koper',
  'tas-kabin':     '🎒 Tas Kabin',
  'tas-paspor':    '👜 Tas Paspor',
  'tas-selempang': '👜 Tas Selempang',
  'tas-sandal':    '🎒 Tas Sandal',
  'pouch':         '🧴 Pouch',
  'bundling':      '📦 Paket Bundling',
  'aksesori':      '🛒 Aksesori',
};
