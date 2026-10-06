import type { Product, ColorOption, ColorGroup } from '../types/product';

// ─────────────────────────────────────────────────────────────────────────────
// Path foto dari katalog asli (sudah ada di public/images/)
// ─────────────────────────────────────────────────────────────────────────────
const K26  = '/images/Katalog 2026';
const BK26 = '/images/Katalog Berkah Koper 2026';

const IMG = {
  // ── Katalog 2026 ──────────────────────────────────────────────────────────
  cover:          `${K26}/Katalog 2026_page-0001.jpg`, // lifestyle koper warna-warni
  koperTeal:      `${K26}/Katalog 2026_page-0002.jpg`, // koper teal 20"+24" + tas
  antiPecah:      `${K26}/Katalog 2026_page-0003.jpg`, // koper diinjak — ANTI PECAH
  pp9901:         `${K26}/Katalog 2026_page-0004.jpg`, // Series 9901 PP 12 warna
  absOrange:      `${K26}/Katalog 2026_page-0005.jpg`, // spek ABS putih+orange
  kuning:         `${K26}/Katalog 2026_page-0006.jpg`, // koper+tas kuning spesifikasi
  pcMewah:        `${K26}/Katalog 2026_page-0007.jpg`, // koper PC hitam+kuning mewah

  // ── Katalog Berkah Koper 2026 ─────────────────────────────────────────────
  abs_stripe5:    `${BK26}/Katalog Berkah Koper 2026_page-0004.jpg`, // stripe 5 warna siku besi
  abs_diamond7:   `${BK26}/Katalog Berkah Koper 2026_page-0005.jpg`, // diamond 7 warna one color
  abs_stripeH7:   `${BK26}/Katalog Berkah Koper 2026_page-0006.jpg`, // stripe horiz 7 warna
  abs_diamond8:   `${BK26}/Katalog Berkah Koper 2026_page-0007.jpg`, // diamond mini 8 warna
  abs_tactical:   `${BK26}/Katalog Berkah Koper 2026_page-0008.jpg`, // tactical silver tengah
  abs_diagonal:   `${BK26}/Katalog Berkah Koper 2026_page-0009.jpg`, // diagonal biru depan
  abs_stripeBulat:`${BK26}/Katalog Berkah Koper 2026_page-0010.jpg`, // stripe bulat abu tengah
  abs_stripeKotak:`${BK26}/Katalog Berkah Koper 2026_page-0011.jpg`, // stripe kotak hijau tua
  abs_set3:       `${BK26}/Katalog Berkah Koper 2026_page-0012.jpg`, // set 20+24+28 6 warna

  // ── Banner existing ───────────────────────────────────────────────────────
  bannerPP:       '/images/banner-koper-pp-premium.jpg',
  bannerAntiPecah:'/images/banner-anti-pecah-pp.jpg',
  koperLifestyle: '/images/koper-pp-lifestyle-masjid.jpg',
  koperUkuran:    '/images/koper-ukuran-20-24-inch.jpg',

  // ── Non-koper — foto dari katalog Berkah Koper ───────────────────────────
  tasKabin:    `${K26}/Katalog 2026_page-0002.jpg`,
  tasPaspor:   `${BK26}/Katalog Berkah Koper 2026_page-0021.jpg`,
  tasSelempang:`${BK26}/Katalog Berkah Koper 2026_page-0021.jpg`,
  tasSandal:   `${BK26}/Katalog Berkah Koper 2026_page-0021.jpg`,
  pouch:       `${K26}/Katalog 2026_page-0006.jpg`, // foto tas & aksesori perjalanan
  bundling:    `${K26}/Katalog 2026_page-0001.jpg`, // cover katalog — semua produk
  aksesori:    `${BK26}/Katalog Berkah Koper 2026_page-0004.jpg`, // detail produk koper
};

// ─────────────────────────────────────────────────────────────────────────────
// Warna dari katalog
// ─────────────────────────────────────────────────────────────────────────────

/** 10 warna body Koper PP dari katalog */
const WARNA_PP: ColorOption[] = [
  { name: 'Putih',         hex: '#f0ead6' },
  { name: 'Abu-Abu',       hex: '#4a4a4a' },
  { name: 'Hijau Army',    hex: '#3d5233' },
  { name: 'Biru',          hex: '#1a9bdc' },
  { name: 'Hijau Mint',    hex: '#a8d5b0' },
  { name: 'Ungu Muda',     hex: '#c3aee0' },
  { name: 'Hitam',         hex: '#1a1a1a' },
  { name: 'Pink',          hex: '#e8917a' },
  { name: 'Hijau Alpukat', hex: '#7a8c4e' },
  { name: 'Biru Navy',     hex: '#1e2d5a' },
];

/** 13 warna Koper PP Stripe dari katalog */
const WARNA_PP_STRIPE: ColorOption[] = [
  { name: 'Hijau Mint',    hex: '#a8d5b0' },
  { name: 'Rosegold',      hex: '#c4956a' },
  { name: 'Hitam',         hex: '#1a1a1a' },
  { name: 'Merah Maroon',  hex: '#6e1a2a' },
  { name: 'Hijau Army',    hex: '#3d5233' },
  { name: 'Orange',        hex: '#e05c1a' },
  { name: 'Silver',        hex: '#b0b0b0' },
  { name: 'Abu-Abu',       hex: '#4a4a4a' },
  { name: 'Hijau Tosca',   hex: '#1a8c6e' },
  { name: 'Putih',         hex: '#f0ead6' },
  { name: 'Sky Blue',      hex: '#87ceeb' },
  { name: 'Biru Navy',     hex: '#1e2d5a' },
  { name: 'Kuning Kunyit', hex: '#d4a017' },
];

/** 12 warna aksesori One Color (roda, handle, trim) */
const WARNA_ONE_COLOR: ColorOption[] = [
  { name: 'Hijau Army',    hex: '#3d5233' },
  { name: 'Biru BCA',      hex: '#0a5fb4' },
  { name: 'Hijau Stabilo', hex: '#7aed0a' },
  { name: 'Gold',          hex: '#d4a017' },
  { name: 'Kuning Kunyit', hex: '#c8960a' },
  { name: 'Orange',        hex: '#e05c1a' },
  { name: 'Merah Cabe',    hex: '#c0141e' },
  { name: 'Rosegold',      hex: '#c4956a' },
  { name: 'Abu-Abu',       hex: '#6a6a6a' },
  { name: 'Silver',        hex: '#b0b0b0' },
  { name: 'Hijau Mint',    hex: '#a8d5b0' },
  { name: 'Coklat',        hex: '#7a4a2a' },
];

/** Warna ABS/PC Series 9901 dari katalog */
const WARNA_9901: ColorOption[] = [
  { name: 'Ungu',     hex: '#9b59b6' },
  { name: 'B.Danau',  hex: '#1a6b8a' },
  { name: 'Army',     hex: '#3d5233' },
  { name: 'Putih',    hex: '#f5f5f5' },
  { name: 'Navy',     hex: '#1e2d5a' },
  { name: 'Apple',    hex: '#8db600' },
  { name: 'R.Gold',   hex: '#c4956a' },
  { name: 'Abu Tua',  hex: '#4a4a4a' },
  { name: 'Abu Muda', hex: '#9a9a9a' },
  { name: 'Hitam',    hex: '#1a1a1a' },
  { name: 'Marom',    hex: '#8b0000' },
  { name: 'G.Blue',   hex: '#87ceeb' },
];

/** Warna umum ABS/PC (7-8 warna) */
const WARNA_ABS_UMUM: ColorOption[] = [
  { name: 'Pink',      hex: '#e8917a' },
  { name: 'Orange',    hex: '#e05c1a' },
  { name: 'Hijau',     hex: '#7aed0a' },
  { name: 'Hitam',     hex: '#1a1a1a' },
  { name: 'Merah',     hex: '#c0141e' },
  { name: 'Biru Navy', hex: '#1e2d5a' },
  { name: 'Kuning',    hex: '#d4a017' },
];

/** Warna ABS stripe 5 (siku besi) */
const WARNA_ABS_STRIPE5: ColorOption[] = [
  { name: 'Hitam',    hex: '#1a1a1a' },
  { name: 'Biru',     hex: '#1a4fa0' },
  { name: 'Merah',    hex: '#c0141e' },
  { name: 'Orange',   hex: '#e05c1a' },
  { name: 'Hijau',    hex: '#7aed0a' },
];

// Helper color groups
const cgPP: ColorGroup[] = [
  { label: 'Warna Body',                       type: 'body',   colors: WARNA_PP },
  { label: 'Warna Aksesori (One Color System)', type: 'accent', colors: WARNA_ONE_COLOR },
];
const cgPPStripe: ColorGroup[] = [
  { label: 'Warna Koper',                       type: 'body',   colors: WARNA_PP_STRIPE },
  { label: 'Warna Aksesori (One Color System)', type: 'accent', colors: WARNA_ONE_COLOR },
];
const cg9901: ColorGroup[] = [
  { label: 'Pilihan Warna', type: 'body', colors: WARNA_9901 },
];
const cgABSumum: ColorGroup[] = [
  { label: 'Pilihan Warna', type: 'body', colors: WARNA_ABS_UMUM },
];
const cgABSstripe5: ColorGroup[] = [
  { label: 'Pilihan Warna',                     type: 'body',   colors: WARNA_ABS_STRIPE5 },
  { label: 'Warna Aksesori (One Color System)', type: 'accent', colors: WARNA_ONE_COLOR },
];

// ─────────────────────────────────────────────────────────────────────────────
// Produk
// ─────────────────────────────────────────────────────────────────────────────
export const products: Product[] = [

  // ── KOPER PP ──────────────────────────────────────────────────────────────

  {
    slug: 'koper-pp-premium-haji-umrah',
    name: 'Koper PP Premium Haji & Umrah',
    category: 'koper',
    badge: 'TERLARIS',
    shortDesc: 'Koper Polypropylene anti pecah, lentur & kuat — 10 warna, tersedia 20", 24" & 28".',
    description:
      'Koper berbahan Polypropylene (PP) premium — anti pecah, lentur, dan sangat ringan. Tekstur motif anyaman elegan. Tersedia dalam 10 pilihan warna body dan 12 pilihan warna aksesori One Color System (roda, handle, corner guard). Cocok untuk perjalanan Haji & Umrah dengan kloter besar karena bisa dikustomisasi warna per jamaah.',
    price: 750000,
    priceLabel: 'Mulai Rp 750.000',
    images: [
      IMG.bannerPP,
      IMG.koperLifestyle,
      IMG.koperUkuran,
      IMG.antiPecah,
      IMG.pp9901,
      IMG.pp9901,
      IMG.bannerPP,
    ],
    sizes: ['20"', '24"', '28"'],
    variants: [
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 150000 },
      { label: '28"', priceAdj: 300000 },
    ],
    colorGroups: cgPP,
    features: [
      'Bahan PP (Polypropylene) anti pecah & lentur',
      'Motif anyaman premium — tidak mudah tergores',
      '10 pilihan warna body koper',
      '12 pilihan warna aksesori One Color System',
      'Custom logo & nama jamaah (free)',
      'Roda double spinner silent 360°',
      'Kunci TSA terintegrasi',
      'Handle teleskopik aluminium multi-level',
      'Interior divider + strap pengikat',
      'Free ongkir area Jakarta',
    ],
    weight: '3.2 kg (24")',
    material: 'Polypropylene (PP) Premium',
    inStock: true,
  },

  {
    slug: 'koper-pp-series-9901',
    name: 'Koper PP Series 9901',
    category: 'koper',
    badge: 'BARU',
    shortDesc: 'Koper PP Series 9901 — 12 warna kombinasi khaki, anti pecah & fleksibel terbukti.',
    description:
      'Koper PP Series 9901 dengan kombinasi warna khaki yang elegan. Telah lulus tes kekuatan: drop test, tes beban, dan flex test. Tersedia 12 pilihan warna. Roda putar 360° silent, kunci kombinasi 3 digit.',
    price: 800000,
    priceLabel: 'Mulai Rp 800.000',
    images: [
      IMG.pp9901,
      IMG.koperLifestyle,
      IMG.koperUkuran,
      IMG.antiPecah,
      IMG.bannerPP,
    ],
    sizes: ['20"', '24"', '28"'],
    variants: [
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 150000 },
      { label: '28"', priceAdj: 300000 },
    ],
    colorGroups: cg9901,
    features: [
      'Series 9901 — kombinasi khaki premium',
      '12 pilihan warna tersedia',
      'PP anti pecah & flexible — terbukti tes kekuatan',
      'Drop test ✓ Tes beban ✓ Flex test ✓',
      'Roda putar 360° silent wheels',
      'Kunci kombinasi 3 digit',
      'Custom logo & nama jamaah (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '3.0 kg (24")',
    material: 'Polypropylene (PP)',
    inStock: true,
  },

  {
    slug: 'koper-stripe-pp-haji-umrah',
    name: 'Koper Stripe PP Haji & Umrah',
    category: 'koper',
    shortDesc: 'Koper PP model garis horizontal — 13 pilihan warna cerah, tersedia 20", 24" & 28".',
    description:
      'Koper Polypropylene model stripe (garis horizontal) dengan 13 pilihan warna. Aksen rose gold di sudut dan handle. Aksesori bisa dikustomisasi dengan One Color System 12 warna.',
    price: 850000,
    priceLabel: 'Mulai Rp 850.000',
    images: [
      IMG.abs_stripeH7,
      IMG.koperLifestyle,
      IMG.koperUkuran,
      IMG.abs_stripe5,
      IMG.pp9901,
    ],
    sizes: ['20"', '24"', '28"'],
    variants: [
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 150000 },
      { label: '28"', priceAdj: 300000 },
    ],
    colorGroups: cgPPStripe,
    features: [
      'Bahan PP anti pecah & lentur',
      'Desain stripe horizontal modern',
      'Aksen rose gold di sudut & handle',
      '13 pilihan warna body',
      '12 pilihan warna aksesori One Color',
      'Custom logo & nama jamaah (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '3.4 kg (24")',
    material: 'Polypropylene (PP) Premium',
    inStock: true,
  },

  // ── KOPER ABS/PC ──────────────────────────────────────────────────────────

  {
    slug: 'koper-abs-stripe-siku-besi',
    name: 'Koper ABS Stripe Siku Besi',
    category: 'koper',
    shortDesc: 'Koper ABS/PC stripe dengan penguat siku besi — 5 warna, uk 18", 20" & 24".',
    description:
      'Koper bahan ABS & Polycarbonate (PC) dengan desain stripe vertikal dan penguat siku besi di setiap sudut untuk perlindungan ekstra. Tersedia 5 pilihan warna. Roda putar 360° silent, kunci kombinasi 3 angka.',
    price: 450000,
    priceLabel: 'Mulai Rp 450.000',
    images: [
      IMG.abs_stripe5,
      IMG.absOrange,
      IMG.abs_set3,
    ],
    sizes: ['18"', '20"', '24"'],
    variants: [
      { label: '18"', priceAdj: -50000 },
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 100000 },
    ],
    colorGroups: cgABSstripe5,
    features: [
      'Bahan ABS & Polycarbonate (PC)',
      'Penguat siku besi di setiap sudut',
      '5 pilihan warna: Hitam, Biru, Merah, Orange, Hijau',
      'Roda putar 360° silent wheels',
      'Kunci kombinasi 3 angka',
      'Harga pabrik — jahitan rapi',
      'Custom logo & nama (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '2.8 kg (20")',
    material: 'ABS + Polycarbonate (PC)',
    inStock: true,
  },

  {
    slug: 'koper-abs-diamond-one-color',
    name: 'Koper ABS Diamond One Color',
    category: 'koper',
    badge: 'BARU',
    shortDesc: 'Koper ABS/PC motif diamond dengan sistem One Color — 7 warna cerah, uk 18", 20" & 24".',
    description:
      'Koper dengan motif emboss diamond yang eye-catching. Sistem One Color: roda, handle, dan trim berwarna senada dengan body koper. Tersedia 7 warna cerah. Bahan ABS & PC, roda 360° silent.',
    price: 500000,
    priceLabel: 'Mulai Rp 500.000',
    images: [
      IMG.abs_diamond7,
      IMG.abs_diamond8,
      IMG.pp9901,
    ],
    sizes: ['18"', '20"', '24"'],
    variants: [
      { label: '18"', priceAdj: -50000 },
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 100000 },
    ],
    colorGroups: cgABSumum,
    features: [
      'Motif emboss diamond premium',
      'One Color System — roda & trim senada',
      '7 pilihan warna cerah',
      'Bahan ABS & Polycarbonate (PC)',
      'Roda putar 360° silent',
      'Kunci kombinasi 3 angka',
      'Custom logo & nama (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '2.7 kg (20")',
    material: 'ABS + Polycarbonate (PC)',
    inStock: true,
  },

  {
    slug: 'koper-abs-stripe-horizontal',
    name: 'Koper ABS Stripe Horizontal',
    category: 'koper',
    shortDesc: 'Koper ABS/PC stripe horizontal klasik — 7 warna, uk 18", 20" & 24".',
    description:
      'Desain stripe horizontal klasik yang elegan. Bahan ABS & PC berkualitas tinggi. Tersedia 7 pilihan warna termasuk pink, orange, hijau stabilo, hitam, merah, navy, dan kuning.',
    price: 450000,
    priceLabel: 'Mulai Rp 450.000',
    images: [
      IMG.abs_stripeH7,
      IMG.abs_stripeBulat,
      IMG.abs_stripeKotak,
    ],
    sizes: ['18"', '20"', '24"'],
    variants: [
      { label: '18"', priceAdj: -50000 },
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 100000 },
    ],
    colorGroups: cgABSumum,
    features: [
      'Desain stripe horizontal klasik',
      '7 pilihan warna cerah',
      'Bahan ABS & Polycarbonate (PC)',
      'Roda putar 360° silent',
      'Kunci kombinasi 3 angka',
      'Custom logo & nama (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '2.8 kg (20")',
    material: 'ABS + Polycarbonate (PC)',
    inStock: true,
  },

  {
    slug: 'koper-abs-tactical',
    name: 'Koper ABS Tactical',
    category: 'koper',
    shortDesc: 'Koper ABS/PC desain tactical modern — 7 warna, uk 20" & 24".',
    description:
      'Desain tactical modern dengan lekukan body yang kokoh dan sporty. Bahan ABS & PC. Tersedia 7 warna termasuk biru, pink, orange, hijau, hitam, merah, navy, dan kuning.',
    price: 480000,
    priceLabel: 'Mulai Rp 480.000',
    images: [
      IMG.abs_tactical,
      IMG.abs_diagonal,
      IMG.abs_set3,
    ],
    sizes: ['20"', '24"'],
    variants: [
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 100000 },
    ],
    colorGroups: cgABSumum,
    features: [
      'Desain tactical sporty modern',
      '7 pilihan warna tersedia',
      'Bahan ABS & Polycarbonate (PC)',
      'Roda putar 360° silent',
      'Kunci kombinasi 3 angka',
      'Custom logo & nama (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '2.9 kg (20")',
    material: 'ABS + Polycarbonate (PC)',
    inStock: true,
  },

  {
    slug: 'koper-abs-set-3-ukuran',
    name: 'Koper ABS Set 3 Ukuran',
    category: 'koper',
    badge: 'HEMAT',
    shortDesc: 'Set koper ABS/PC 3 ukuran sekaligus — 20", 24" & 28" dalam 1 warna pilihan.',
    description:
      'Beli set 3 koper sekaligus dalam 1 warna pilihan: 20", 24", dan 28". Cocok untuk keluarga atau kloter haji yang ingin seragam. Tersedia dalam 6 pilihan warna. Harga lebih hemat vs beli satuan.',
    price: 1200000,
    priceLabel: 'Rp 1.200.000 / set 3 koper',
    images: [
      IMG.abs_set3,
      IMG.abs_stripeKotak,
      IMG.abs_tactical,
    ],
    colorGroups: [
      {
        label: 'Pilihan Warna Set',
        type: 'body',
        colors: [
          { name: 'Rosegold', hex: '#c4956a' },
          { name: 'Orange',   hex: '#e05c1a' },
          { name: 'Hijau',    hex: '#7aed0a' },
          { name: 'Hitam',    hex: '#1a1a1a' },
          { name: 'Merah',    hex: '#c0141e' },
          { name: 'Navy',     hex: '#1e2d5a' },
          { name: 'Kuning',   hex: '#d4a017' },
        ],
      },
    ],
    features: [
      'Set lengkap 20" + 24" + 28" dalam 1 warna',
      '7 pilihan warna tersedia',
      'Bahan ABS & Polycarbonate (PC)',
      'Roda putar 360° silent',
      'Kunci kombinasi 3 angka',
      'Custom logo & nama (free)',
      'Free ongkir area Jakarta',
    ],
    weight: '8.5 kg (total set)',
    material: 'ABS + Polycarbonate (PC)',
    inStock: true,
  },

  {
    slug: 'koper-pc-premium-mewah',
    name: 'Koper PC Premium Mewah',
    category: 'koper',
    shortDesc: 'Koper Polycarbonate premium — kesan mewah, kuat, uk 20" & 24".',
    description:
      'Koper berbahan Polycarbonate (PC) murni yang memberikan kesan mewah dan glossy. Cocok untuk jamaah yang menginginkan tampilan premium. Custom logo travel/kloter tersedia. Bahan PC memberikan kekuatan ekstra dibanding ABS.',
    price: 650000,
    priceLabel: 'Mulai Rp 650.000',
    images: [
      IMG.pcMewah,
      IMG.abs_stripe5,
      IMG.abs_set3,
    ],
    sizes: ['20"', '24"'],
    variants: [
      { label: '20"', priceAdj: 0 },
      { label: '24"', priceAdj: 150000 },
    ],
    colorGroups: [
      {
        label: 'Pilihan Warna',
        type: 'body',
        colors: [
          { name: 'Hitam',  hex: '#1a1a1a' },
          { name: 'Kuning', hex: '#d4a017' },
          { name: 'Merah',  hex: '#c0141e' },
          { name: 'Navy',   hex: '#1e2d5a' },
        ],
      },
      { label: 'Warna Aksesori (One Color)', type: 'accent', colors: WARNA_ONE_COLOR },
    ],
    features: [
      'Bahan Polycarbonate (PC) murni',
      'Tampilan glossy premium mewah',
      'Custom logo travel/kloter (free)',
      'Roda putar 360° silent',
      'Kunci kombinasi 3 angka',
      'Tersedia aksen siku besi',
      'Free ongkir area Jakarta',
    ],
    weight: '3.0 kg (20")',
    material: 'Polycarbonate (PC)',
    inStock: true,
  },

  // ── TAS KABIN ─────────────────────────────────────────────────────────────

  {
    slug: 'tas-kabin-haji-40l',
    name: 'Tas Kabin Haji 40L',
    category: 'tas-kabin',
    badge: 'TERLARIS',
    shortDesc: 'Tas kabin multifungsi 40L, cocok untuk barang bawaan selama perjalanan ibadah.',
    description:
      'Dirancang untuk kenyamanan selama penerbangan dan perjalanan darat. Kompartemen laptop 15", kantong botol minum di samping, dan bahan water-resistant.',
    price: 359000,
    images: [IMG.koperTeal, IMG.tasKabin],
    features: [
      'Kapasitas 40L kabin-friendly',
      'Kompartemen laptop 15"',
      'Bahan water-resistant 600D',
      'Shoulder strap ergonomis berpadding',
      'Port USB charging bawaan',
    ],
    weight: '0.85 kg',
    material: 'Polyester 600D Water Resistant',
    inStock: true,
  },

  {
    slug: 'tas-kabin-slim-25l',
    name: 'Tas Kabin Slim 25L',
    category: 'tas-kabin',
    shortDesc: 'Tas kabin ramping untuk perjalanan ringan dan ibadah harian.',
    description:
      'Desain slim cocok untuk perjalanan ibadah sehari-hari atau umrah singkat.',
    price: 249000,
    images: [IMG.tasKabin],
    features: [
      'Desain slim & ringan',
      'Pocket terorganisir di depan',
      'Back panel berventilasi',
      'Strap anti-slip',
    ],
    weight: '0.6 kg',
    material: 'Polyester 420D',
    inStock: true,
  },

  // ── TAS PASPOR ────────────────────────────────────────────────────────────

  {
    slug: 'tas-paspor-travel-organizer',
    name: 'Tas Paspor Travel Organizer',
    category: 'tas-paspor',
    badge: 'TERLARIS',
    shortDesc: 'Dompet paspor multifungsi RFID blocking untuk dokumen perjalanan yang aman.',
    description:
      'Organizer dokumen serba guna dengan lapisan RFID blocking. Slot paspor, boarding pass, kartu ATM, uang tunai, dan ponsel.',
    price: 129000,
    images: [IMG.koperTeal, IMG.tasPaspor],
    features: [
      'RFID Blocking protection',
      'Slot paspor + boarding pass',
      '6 slot kartu + kantong uang',
      'Pocket ponsel ukuran besar',
      'Material kulit PU premium',
      'Tersedia tali leher & selempang',
    ],
    weight: '0.15 kg',
    material: 'PU Leather + RFID Blocking',
    inStock: true,
  },

  {
    slug: 'tas-dokumen-haji-a4',
    name: 'Tas Dokumen Haji A4',
    category: 'tas-paspor',
    shortDesc: 'Tas dokumen khusus haji, muat berkas A4 dan perlengkapan penting.',
    description:
      'Khusus menyimpan berkas penting perjalanan haji: buku manasik, surat mahram, bukti pembayaran.',
    price: 89000,
    images: [IMG.tasPaspor],
    features: [
      'Kapasitas dokumen A4',
      'Slot paspor & kartu',
      'Handle + tali selempang',
      'Ritsleting anti air',
    ],
    weight: '0.2 kg',
    material: 'Polyester Coated',
    inStock: true,
  },

  // ── TAS SELEMPANG ─────────────────────────────────────────────────────────

  {
    slug: 'tas-selempang-haji-premium',
    name: 'Tas Selempang Haji Premium',
    category: 'tas-selempang',
    badge: 'BARU',
    shortDesc: "Tas selempang ergonomis untuk Tawaf dan Sa'i — tangan tetap bebas.",
    description:
      "Desain compact untuk tangan bebas saat Tawaf dan Sa'i. Anti-gores dan anti-percik air.",
    price: 159000,
    images: [IMG.tasSelempang],
    features: [
      'Desain compact tangan bebas',
      'Anti-gores & water splash proof',
      'Strap adjustable panjang',
      'Pocket tersembunyi anti-copet',
    ],
    weight: '0.25 kg',
    material: 'Nylon Ripstop',
    inStock: true,
  },

  // ── TAS SANDAL ────────────────────────────────────────────────────────────

  {
    slug: 'tas-sandal-masjid-premium',
    name: 'Tas Sandal Masjid Premium',
    category: 'tas-sandal',
    shortDesc: 'Kantong sandal higienis & praktis untuk dibawa masuk Masjidil Haram.',
    description:
      'Material tebal anti-tembus bau, dilengkapi karabiner untuk digantung di tas.',
    price: 45000,
    images: [IMG.tasSandal],
    variants: [
      { label: 'S (sd 40)', priceAdj: 0 },
      { label: 'L (41–45)', priceAdj: 5000 },
    ],
    features: [
      'Material anti-tembus bau',
      'Karabiner clip bawaan',
      'Mudah dibersihkan',
    ],
    weight: '0.08 kg',
    material: 'Oxford Cloth',
    inStock: true,
  },

  // ── POUCH ─────────────────────────────────────────────────────────────────

  {
    slug: 'pouch-perlengkapan-mandi-haji',
    name: 'Pouch Perlengkapan Mandi',
    category: 'pouch',
    shortDesc: 'Pouch toiletries terorganisir untuk perjalanan jauh Haji & Umrah.',
    description:
      'Kompartemen terorganisir untuk sabun, sampo, parfum, dan kebutuhan mandi. Lapisan dalam waterproof.',
    price: 79000,
    images: [IMG.pouch],
    features: [
      'Lapisan dalam waterproof',
      'Multiple kompartemen',
      'Hook gantung kamar mandi',
    ],
    weight: '0.18 kg',
    material: 'Polyester + Waterproof Lining',
    inStock: true,
  },

  {
    slug: 'pouch-obat-medis-haji',
    name: 'Pouch Obat & Medis',
    category: 'pouch',
    shortDesc: 'Pouch khusus obat-obatan dan perlengkapan medis pribadi jamaah.',
    description:
      'Untuk menyimpan obat rutin, P3K, termometer, dan suplemen selama Haji/Umrah.',
    price: 65000,
    images: [IMG.pouch],
    features: [
      'Pocket transparan untuk label',
      'Divider terorganisir',
      'Ukuran pas di dalam koper',
    ],
    weight: '0.12 kg',
    material: 'EVA + Mesh',
    inStock: true,
  },

  // ── BUNDLING ──────────────────────────────────────────────────────────────

  {
    slug: 'paket-bundling-umrah-starter',
    name: 'Paket Bundling Umrah Starter',
    category: 'bundling',
    badge: 'HEMAT 20%',
    shortDesc: 'Paket lengkap untuk jamaah umrah pertama — koper + tas paspor + selempang + sandal.',
    description:
      'Koper PP 20" + Tas Paspor RFID + Tas Selempang + Tas Sandal. Warna koper bebas dipilih.',
    price: 999000,
    priceLabel: 'Rp 999.000 (hemat Rp 183.000)',
    images: [
      '/images/hero-promo-umroh-cream.jpg',
      '/images/hero-promo-umroh-hijau.jpg',
      IMG.cover,
    ],
    isBundle: true,
    bundleItems: [
      'Koper PP Premium 20"',
      'Tas Paspor Travel Organizer (RFID)',
      'Tas Selempang Haji Premium',
      'Tas Sandal Masjid Premium',
    ],
    features: [
      'Hemat hingga Rp 183.000 vs beli satuan',
      'Pilih warna koper bebas (10 warna)',
      'Pilih warna aksesori bebas (12 One Color)',
      'Custom nama jamaah di koper (free)',
    ],
    inStock: true,
  },

  {
    slug: 'paket-bundling-haji-complete',
    name: 'Koper Custom Embos Moulding',
    category: 'bundling',
    badge: 'CUSTOM',
    shortDesc: 'Terima pesanan koper custom embos moulding — logo & desain sesuai permintaan, minimum order.',
    description:
      'Layanan koper custom embos moulding Berkah Koper. Logo, nama travel, dan desain dicetak langsung pada body koper menggunakan teknik embos moulding yang presisi dan tahan lama. Cocok untuk travel haji & umroh, korporat, dan instansi. Tersedia pilihan warna bebas.',
    price: 0,
    priceLabel: 'Hubungi untuk info harga',
    images: [
      '/images/koper-custom-embos/koper-custom-embos-pink.jpg',
      '/images/koper-custom-embos/koper-custom-embos-hitam.jpg',
    ],
    isBundle: true,
    bundleItems: [
      'Koper Cabin (20")',
      'Koper Bagasi (24" atau 28")',
    ],
    features: [
      'Custom logo & nama travel langsung di body koper',
      'Teknik embos moulding — presisi & tahan lama',
      'Pilihan warna bebas sesuai identitas travel',
      'Tersedia set: Koper Cabin + Koper Bagasi',
      'Bahan ABS/PC berkualitas tinggi',
      'Roda putar 360° silent wheels',
      'Kunci kombinasi 3 angka',
      'Minimal order — hubungi untuk info',
    ],
    material: 'ABS / Polycarbonate (PC)',
    inStock: true,
  },

  // ── AKSESORI ──────────────────────────────────────────────────────────────

  {
    slug: 'kunci-tsa-koper',
    name: 'Kunci TSA Kombinasi',
    category: 'aksesori',
    shortDesc: 'Gembok TSA 3-digit untuk keamanan koper di bandara internasional.',
    description:
      'Kunci kombinasi 3 digit berstandar TSA. Bodi zinc alloy tahan karat.',
    price: 35000,
    images: [IMG.aksesori],
    variants: [
      { label: 'Hitam', priceAdj: 0 },
      { label: 'Merah', priceAdj: 0 },
    ],
    features: [
      'Standar TSA internasional',
      'Kombinasi 3 digit kustom',
      'Bodi zinc alloy tahan karat',
    ],
    weight: '0.06 kg',
    material: 'Zinc Alloy',
    inStock: true,
  },

  {
    slug: 'tag-koper-nama-haji',
    name: 'Tag Koper Nama Haji',
    category: 'aksesori',
    shortDesc: 'Label koper silikon tebal, tahan cuaca, mudah dibaca.',
    description:
      'Tag koper silikon premium. Bisa diisi nama, kloter, dan nomor telepon.',
    price: 25000,
    images: [IMG.aksesori],
    variants: [
      { label: 'Hijau', priceAdj: 0 },
      { label: 'Kuning', priceAdj: 0 },
      { label: 'Merah', priceAdj: 0 },
    ],
    features: [
      'Silikon tebal tahan cuaca',
      'Strap pengait kuat double-lock',
      'Isi 2 pcs per pack',
    ],
    weight: '0.04 kg',
    material: 'Silikon Premium',
    inStock: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

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
  const rest   = products.filter((p) => !p.badge);
  return [...badged, ...rest].slice(0, limit);
}

export function getBundleProducts(): Product[] {
  return products.filter((p) => p.isBundle);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWaMessage(product: Product): string {
  if (product.waMessage) return product.waMessage;
  return `Assalamu%27alaikum%20Berkah%20Koper%2C%20saya%20tertarik%20dengan%20*${encodeURIComponent(product.name)}*%20(${encodeURIComponent(formatPrice(product.price))}).%20Boleh%20info%20stok%20dan%20pemesanannya%3F`;
}
