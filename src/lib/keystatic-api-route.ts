import type { APIRoute } from 'astro';
import { makeHandler } from '@keystatic/astro/api';
import config from '../../keystatic.config';

type RuntimeLocals = {
  runtime?: { env?: Record<string, string | undefined> };
};

function readEnv(context: Parameters<APIRoute>[0], key: string) {
  const runtimeEnv = (context.locals as RuntimeLocals)?.runtime?.env;
  return runtimeEnv?.[key] || process.env[key] || undefined;
}

export const prerender = false;

/** Cloudflare-safe Keystatic API: secrets from runtime.env, not astro:env getSecret. */
export const ALL: APIRoute = async (context) => {
  try {
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
          hint: 'Save variables in Pages → Settings → Variables (Production), then Retry deploy',
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
    return await handler(context);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'Keystatic API failed', message }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } },
    );
  }
};

export const all = ALL;
