import type { APIRoute } from 'astro';
import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

type RuntimeLocals = {
  runtime?: { env?: Record<string, string | undefined> };
};

function readEnv(context: Parameters<APIRoute>[0], key: string) {
  const runtimeEnv = (context.locals as RuntimeLocals)?.runtime?.env;
  return runtimeEnv?.[key] || process.env[key] || undefined;
}

export const prerender = false;

/** Override Keystatic API: baca secret dari Cloudflare runtime.env (lebih andal di Pages) */
export const ALL: APIRoute = async (context) => {
  const clientId = readEnv(context, 'KEYSTATIC_GITHUB_CLIENT_ID');
  const clientSecret = readEnv(context, 'KEYSTATIC_GITHUB_CLIENT_SECRET');
  const secret = readEnv(context, 'KEYSTATIC_SECRET');

  if (!clientId || !clientSecret || !secret) {
    return new Response(
      JSON.stringify({
        error: 'Missing Keystatic env on Cloudflare',
        KEYSTATIC_GITHUB_CLIENT_ID: Boolean(clientId),
        KEYSTATIC_GITHUB_CLIENT_SECRET: Boolean(clientSecret),
        KEYSTATIC_SECRET: Boolean(secret),
        hint: 'Save variables in Pages → Settings → Variables (Production + Build), then Retry deploy',
      }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } },
    );
  }

  const handler = makeHandler({
    config,
    clientId,
    clientSecret,
    secret,
  });
  return handler(context);
};
