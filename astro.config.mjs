import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Ganti dengan URL Cloudflare Pages setelah deploy
  // Format: https://berkah-koper.pages.dev
  // Atau domain custom jika sudah punya: https://berkahkoper.com
  site: 'https://berkah-koper.anggacipiet89.workers.dev',

  // Output static — cocok untuk Cloudflare Pages (gratis, tanpa server)
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },
});
