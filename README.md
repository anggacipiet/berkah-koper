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

## Sebelum production

Ganti:
- `Koperumroh` / nama legal perusahaan
- nomor WhatsApp `6281234567890`
- email `info@koperumroh.com`
- alamat
- harga paket contoh
- foto hero
- informasi legalitas/perizinan
- domain pada `robots.txt`
- metadata SEO

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
