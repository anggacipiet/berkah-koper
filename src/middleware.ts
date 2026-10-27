import { defineMiddleware } from 'astro:middleware';

const APEX = 'berkah-koper.com';

export const onRequest = defineMiddleware(({ url }, next) => {
  if (url.hostname === `www.${APEX}`) {
    const dest = new URL(url);
    dest.hostname = APEX;
    dest.protocol = 'https:';
    dest.port = '';
    return Response.redirect(dest.toString(), 301);
  }
  return next();
});
