import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * @keystatic/astro tanpa API bawaan — API diganti src/lib/keystatic-api-route.ts
 * agar secrets dibaca dari Cloudflare runtime.env.
 */
export default function keystaticUi() {
  return {
    name: 'keystatic-ui',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
        updateConfig({
          server: config.server.host ? {} : { host: '127.0.0.1' },
          vite: {
            plugins: [
              {
                name: 'keystatic-virtual-config',
                resolveId(id) {
                  if (id === 'virtual:keystatic-config') {
                    return this.resolve('./keystatic.config', './a');
                  }
                  return null;
                },
              },
            ],
            optimizeDeps: {
              entries: ['keystatic.config.*', '.astro/keystatic-imports.js'],
            },
          },
        });

        const dir = new URL('./.astro/', config.root);
        mkdirSync(dir, { recursive: true });
        writeFileSync(
          new URL('keystatic-imports.js', dir),
          `import "@keystatic/astro/ui";\nimport "@keystatic/astro/api";\nimport "@keystatic/core/ui";\n`,
        );

        injectRoute({
          entrypoint: '@keystatic/astro/internal/keystatic-astro-page.astro',
          pattern: '/keystatic/[...params]',
          prerender: false,
        });
        injectRoute({
          entrypoint: './src/lib/keystatic-api-route.ts',
          pattern: '/api/keystatic/[...params]',
          prerender: false,
        });
      },
    },
  };
}
