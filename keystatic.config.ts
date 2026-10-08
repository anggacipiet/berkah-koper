import { config, fields, collection, singleton } from '@keystatic/core';

const colorOption = fields.object({
  name: fields.text({ label: 'Nama warna', validation: { isRequired: true } }),
  hex: fields.text({
    label: 'Kode hex',
    description: 'Wajib pakai # di depan, contoh: #4a5e3a',
    validation: { isRequired: true },
    defaultValue: '#',
  }),
  imageIndex: fields.integer({
    label: 'Index gambar (opsional)',
    description: 'Mulai dari 0 = gambar pertama di daftar Gambar produk',
  }),
});

const colorGroup = fields.object({
  label: fields.text({ label: 'Label grup', validation: { isRequired: true } }),
  type: fields.select({
    label: 'Tipe',
    options: [
      { label: 'Body', value: 'body' },
      { label: 'Aksen', value: 'accent' },
    ],
    defaultValue: 'body',
  }),
  colors: fields.array(colorOption, {
    label: 'Warna',
    itemLabel: (props) => props.fields.name.value || 'Warna',
  }),
});

const imageField = (label: string) =>
  fields.image({
    label,
    description: 'Upload gambar (disimpan di public/images, path /images/...)',
    directory: 'public/images',
    publicPath: '/images/',
  });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Berkah Koper' },
  },
  singletons: {
    hero: singleton({
      label: 'Hero Beranda',
      path: 'content/settings/hero',
      format: { data: 'yaml' },
      schema: {
        eyebrow: fields.text({
          label: 'Badge / eyebrow',
          validation: { isRequired: true },
        }),
        headline: fields.text({
          label: 'Judul utama',
          multiline: true,
          validation: { isRequired: true },
        }),
        headlineAccent: fields.text({
          label: 'Bagian judul berwarna emas',
          description: 'Ditampilkan setelah judul utama, warna emas',
          validation: { isRequired: true },
        }),
        paragraphs: fields.array(
          fields.text({ label: 'Paragraf', multiline: true }),
          {
            label: 'Paragraf deskripsi',
            itemLabel: (props) =>
              (props.value || 'Paragraf').slice(0, 48) +
              ((props.value?.length ?? 0) > 48 ? '…' : ''),
          },
        ),
        primaryCtaLabel: fields.text({
          label: 'Tombol utama — teks',
          defaultValue: 'Lihat Semua Produk →',
        }),
        primaryCtaHref: fields.text({
          label: 'Tombol utama — link',
          defaultValue: '/katalog',
        }),
        secondaryCtaLabel: fields.text({
          label: 'Tombol kedua — teks',
          defaultValue: 'Konsultasi Gratis',
        }),
        waNumber: fields.text({
          label: 'Nomor WhatsApp',
          description: 'Format internasional tanpa +, contoh: 6285282400061',
          defaultValue: '6285282400061',
        }),
        waMessage: fields.text({
          label: 'Pesan WhatsApp',
          description: 'Tulis biasa saja — sistem yang encode otomatis',
          multiline: true,
          defaultValue:
            "Assalamu'alaikum Berkah Koper, saya ingin tanya produk untuk Haji/Umrah.",
        }),
        trustItems: fields.array(fields.text({ label: 'Item' }), {
          label: 'Poin kepercayaan (✓)',
          itemLabel: (props) => props.value || 'Item',
        }),
        slides: fields.array(
          fields.object({
            image: fields.image({
              label: 'Gambar',
              description:
                'Upload foto. Disimpan di public/images/slides/{index}/ — preview muncul setelah save.',
              directory: 'public/images',
              publicPath: '/images/',
            }),
            alt: fields.text({
              label: 'Teks alternatif (alt)',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Foto hero (carousel mobile + collage desktop)',
            description:
              'Desktop memakai 3 foto pertama sebagai collage. Path: /images/slides/{index}/image.jpg',
            itemLabel: (props) => {
              const alt = props.fields.alt.value;
              if (alt) return alt;
              const img = props.fields.image.value;
              if (img?.filename) return img.filename;
              return 'Slide';
            },
          },
        ),
      },
    }),
    tentang: singleton({
      label: 'Tentang / Mengapa Kami',
      path: 'content/settings/tentang',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({
          label: 'Judul section',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Deskripsi singkat',
          multiline: true,
          validation: { isRequired: true },
        }),
        items: fields.array(
          fields.object({
            icon: fields.text({
              label: 'Ikon (emoji)',
              description: 'Satu emoji, contoh: 🏆',
              defaultValue: '•',
            }),
            title: fields.text({
              label: 'Judul poin',
              validation: { isRequired: true },
            }),
            desc: fields.text({
              label: 'Deskripsi poin',
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Poin keunggulan',
            itemLabel: (props) => props.fields.title.value || 'Poin',
          },
        ),
      },
    }),
    mitra: singleton({
      label: 'Mitra — Teks Section',
      path: 'content/settings/mitra',
      format: { data: 'yaml' },
      schema: {
        eyebrow: fields.text({
          label: 'Badge / eyebrow',
          defaultValue: 'Mitra Travel',
        }),
        heading: fields.text({
          label: 'Judul section',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Deskripsi singkat',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
  collections: {
    mitraLogos: collection({
      label: 'Mitra Tour / Logo',
      slugField: 'name',
      path: 'content/mitra/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({
          name: {
            label: 'Nama biro / tour',
            validation: { isRequired: true },
          },
        }),
        order: fields.integer({
          label: 'Urutan tampil',
          description: 'Angka lebih kecil muncul lebih dulu',
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Logo',
          description:
            'Upload logo. Disimpan di public/images/client/{slug}/ — preview muncul setelah save.',
          directory: 'public/images/client',
          publicPath: '/images/client/',
          validation: { isRequired: true },
        }),
      },
    }),
    products: collection({
      label: 'Produk',
      slugField: 'name',
      path: 'content/products/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({
          name: {
            label: 'Nama Produk',
            validation: { isRequired: true },
          },
        }),
        order: fields.integer({
          label: 'Urutan tampil',
          description: 'Angka lebih kecil muncul lebih dulu',
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Kategori',
          options: [
            { label: 'Koper', value: 'koper' },
            { label: 'Tas Kabin', value: 'tas-kabin' },
            { label: 'Tas Paspor/Selempang', value: 'tas-paspor-selempang' },
            { label: 'Tas Sandal', value: 'tas-sandal' },
          ],
          defaultValue: 'koper',
        }),
        badge: fields.text({ label: 'Badge (opsional)' }),
        shortDesc: fields.text({
          label: 'Deskripsi singkat',
          multiline: true,
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Deskripsi lengkap',
          multiline: true,
          validation: { isRequired: true },
        }),
        price: fields.integer({
          label: 'Harga dasar (Rp)',
          validation: { isRequired: true },
          defaultValue: 0,
        }),
        priceLabel: fields.text({ label: 'Label harga (override, opsional)' }),
        images: fields.array(
          fields.image({
            label: 'Gambar',
            description:
              'Upload gambar. Disimpan di public/images/{slug}/images/ — preview muncul setelah save.',
            directory: 'public/images',
            publicPath: '/images/',
          }),
          {
            label: 'Gambar produk',
            description:
              'Path: /images/{slug}/images/{index}.jpg — sama seperti pola preview Hero/Mitra.',
            itemLabel: (props) => {
              const name = props.value?.filename;
              if (!name) return 'Gambar';
              return name.length > 40 ? `${name.slice(0, 38)}…` : name;
            },
          },
        ),
        sizes: fields.array(fields.text({ label: 'Ukuran' }), {
          label: 'Ukuran',
          itemLabel: (props) => props.value || 'Ukuran',
        }),
        variants: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            priceAdj: fields.integer({ label: 'Penyesuaian harga', defaultValue: 0 }),
          }),
          {
            label: 'Varian',
            itemLabel: (props) => props.fields.label.value || 'Varian',
          },
        ),
        colorGroups: fields.array(colorGroup, {
          label: 'Grup warna',
          itemLabel: (props) => props.fields.label.value || 'Grup warna',
        }),
        features: fields.array(fields.text({ label: 'Fitur' }), {
          label: 'Fitur / keunggulan',
          itemLabel: (props) => props.value || 'Fitur',
        }),
        weight: fields.text({ label: 'Berat' }),
        material: fields.text({ label: 'Material' }),
        isBundle: fields.checkbox({ label: 'Paket bundling?', defaultValue: false }),
        bundleItems: fields.array(fields.text({ label: 'Item' }), {
          label: 'Isi paket',
          itemLabel: (props) => props.value || 'Item',
        }),
        waMessage: fields.text({
          label: 'Pesan WhatsApp custom (opsional)',
          description: 'Tulis biasa saja — sistem yang encode otomatis',
          multiline: true,
        }),
        inStock: fields.checkbox({ label: 'Stok tersedia', defaultValue: true }),
      },
    }),
  },
});
