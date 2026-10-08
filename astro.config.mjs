import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import keystaticUi from './integrations/keystatic-ui.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes('dev');

const storageFlag = process.env.PUBLIC_KEYSTATIC_STORAGE || process.env.KEYSTATIC_STORAGE;
const onCfPages = process.env.CF_PAGES === '1';
const useGithubCms =
  storageFlag === 'github' || (onCfPages && storageFlag !== 'local');

if (useGithubCms) {
  process.env.PUBLIC_KEYSTATIC_STORAGE = 'github';
}

const enableKeystatic = isDev || useGithubCms;

export default defineConfig({
  site: 'https://berkah-koper.pages.dev',

  ...(useGithubCms
    ? {
        output: 'server',
        adapter: cloudflare({ imageService: 'passthrough' }),
        session: { driver: 'memory' },
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
    ...(enableKeystatic ? [react(), markdoc(), keystaticUi()] : []),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: isDev
        ? {
            'astro:env/server': path.resolve(
              __dirname,
              'scripts/astro-env-server-shim.js',
            ),
          }
        : {},
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
    // Bundle Keystatic into the Worker — external breaks CF ("No such module")
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro'],
    },
  },
});
