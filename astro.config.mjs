import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keystatic admin (SSR) hanya di `astro dev` — build tetap static untuk Cloudflare Pages
const isDev = process.argv.includes('dev');

export default defineConfig({
  // Sementara Cloudflare Pages — ganti ke domain custom setelah beli
  site: 'https://berkah-koper.pages.dev',

  // Output static — cocok untuk Cloudflare Pages
  output: 'static',

  // Dibutuhkan @keystatic/astro (getSecret) — opsional karena kita pakai local mode
  env: {
    schema: {
      KEYSTATIC_GITHUB_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      KEYSTATIC_GITHUB_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      KEYSTATIC_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  integrations: [
    sitemap(),
    ...(isDev ? [react(), markdoc(), keystatic()] : []),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Alias file nyata — esbuild optimizeDeps juga ikut (plugin virtual sering gagal)
      alias: {
        'astro:env/server': path.resolve(__dirname, 'scripts/astro-env-server-shim.js'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@astrojs/react/client.js',
      ],
      exclude: ['@keystatic/astro'],
    },
    ssr: {
      // API local mode butuh export "node" dari @keystatic/core (bukan stub browser)
      external: ['@keystatic/core'],
      resolve: {
        conditions: ['node', 'import', 'module', 'default'],
      },
    },
  },
});
