import { defineMiddleware } from 'astro:middleware';

const APEX = 'berkah-koper.com';
const HSTS = 'max-age=31536000; includeSubDomains; preload';

export const onRequest = defineMiddleware(async ({ url }, next) => {
  if (url.hostname === `www.${APEX}`) {
    const dest = new URL(url);
    dest.hostname = APEX;
    dest.protocol = 'https:';
    dest.port = '';
    const res = Response.redirect(dest.toString(), 301);
    res.headers.set('Strict-Transport-Security', HSTS);
    return res;
  }

  const res = await next();
  const headers = new Headers(res.headers);
  if (!headers.has('Strict-Transport-Security')) {
    headers.set('Strict-Transport-Security', HSTS);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
});
