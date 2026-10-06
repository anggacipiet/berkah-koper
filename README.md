# Koperumroh

Website company profile/travel umrah menggunakan Astro + Tailwind CSS.

## Jalankan lokal

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## SEO teknis

- Domain sementara di `astro.config.mjs` + `public/robots.txt`: `https://berkah-koper.pages.dev`
- Sitemap otomatis: `@astrojs/sitemap` → `dist/sitemap-index.xml`
- OG image absolut + schema Organization/LocalBusiness
- Product schema tanpa harga (stok + URL saja)

## Sebelum production

Pastikan:
- Beli domain sendiri (jangan pakai `berkahkoper.com` — sudah dipakai orang lain)
- Update `site` di `astro.config.mjs` dan sitemap di `robots.txt`
- Nama legal perusahaan, alamat lengkap, email
- Foto produk & legalitas/perizinan
- Google Search Console (submit sitemap)

## Deploy Cloudflare Pages

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Hubungkan repository GitHub ke Cloudflare Pages lalu setiap `git push` akan melakukan deployment.
