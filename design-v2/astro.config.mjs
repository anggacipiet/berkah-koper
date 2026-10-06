import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://berkah-koper.pages.dev',
  output: 'static',
  publicDir: path.resolve(dir, '../public'),
  outDir: path.resolve(dir, 'dist'),
  vite: {
    plugins: [tailwindcss()],
  },
});
