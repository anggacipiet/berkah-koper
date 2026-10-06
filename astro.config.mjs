import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Sementara Cloudflare Pages — ganti ke domain custom setelah beli
  site: 'https://berkah-koper.pages.dev',

  // Output static — cocok untuk Cloudflare Pages
  output: 'static',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
