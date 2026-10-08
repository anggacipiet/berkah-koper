import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.argv.includes('dev');
/** Prod GitHub OAuth CMS. Rollback: hapus PUBLIC_KEYSTATIC_STORAGE di Cloudflare */
const useGithubCms =
  process.env.PUBLIC_KEYSTATIC_STORAGE === 'github' ||
  process.env.KEYSTATIC_STORAGE === 'github';
const enableKeystatic = isDev || useGithubCms;

export default defineConfig({
  site: 'https://berkah-koper.pages.dev',

  // Tanpa github CMS → static murni (deploy lama). Dengan github → adapter SSR untuk /keystatic
  ...(useGithubCms ? { adapter: cloudflare() } : { output: 'static' }),

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
    ...(enableKeystatic ? [react(), markdoc(), keystatic()] : []),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      ...(isDev
        ? {
            alias: {
              'astro:env/server': path.resolve(
                __dirname,
                'scripts/astro-env-server-shim.js',
              ),
            },
          }
        : {}),
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
      external: ['@keystatic/core'],
      resolve: {
        conditions: ['node', 'import', 'module', 'default'],
      },
    },
  },
});
