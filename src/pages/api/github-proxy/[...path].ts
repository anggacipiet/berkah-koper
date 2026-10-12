import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Proxy api.github.com → same-origin agar Keystatic (GitHub mode)
 * tidak kena CORS dari berkah-koper.pages.dev.
 */
export const ALL: APIRoute = async ({ request, params }) => {
  const parts = params.path;
  const suffix = Array.isArray(parts) ? parts.join('/') : parts || '';
  const incoming = new URL(request.url);
  const target = `https://api.github.com/${suffix}${incoming.search}`;

  const headers = new Headers();
  const passthrough = [
    'authorization',
    'accept',
    'content-type',
    'x-github-api-version-selected',
    'x-github-api-version',
  ] as const;
  for (const key of passthrough) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/vnd.github+json');
  }
  headers.set('User-Agent', 'BerkahKoper-Keystatic-Proxy');

  const init: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  // Stream body (jangan buffer penuh — PDF besar bikin 504 di Cloudflare)
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
    init.body = request.body;
    init.duplex = 'half';
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: 'GitHub proxy failed', message }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const outHeaders = new Headers();
  for (const [key, value] of upstream.headers.entries()) {
    const lower = key.toLowerCase();
    if (lower === 'transfer-encoding' || lower === 'connection') continue;
    outHeaders.set(key, value);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
};

export const all = ALL;
