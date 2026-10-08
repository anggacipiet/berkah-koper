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
/**
 * GitHub CMS aktif jika:
 * - PUBLIC_KEYSTATIC_STORAGE=github, atau
 * - build di Cloudflare Pages (CF_PAGES=1) kecuali eksplisit =local (rollback)
 */
const storageFlag = process.env.PUBLIC_KEYSTATIC_STORAGE || process.env.KEYSTATIC_STORAGE;
const onCfPages = process.env.CF_PAGES === '1';
const useGithubCms =
  storageFlag === 'github' || (onCfPages && storageFlag !== 'local');

// Pastikan Vite inject flag ke client bundle (keystatic.config.ts baca import.meta.env)
if (useGithubCms && process.env.PUBLIC_KEYSTATIC_STORAGE !== 'github') {
  process.env.PUBLIC_KEYSTATIC_STORAGE = 'github';
}

const enableKeystatic = isDev || useGithubCms;

export default defineConfig({
  site: 'https://berkah-koper.pages.dev',

  // Hindari auto-binding SESSION KV (sering bikin 500 di Pages jika KV belum dibuat)
  ...(useGithubCms
    ? {
        session: { driver: 'memory' },
        adapter: cloudflare(),
      }
    : { output: 'static' }),

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
