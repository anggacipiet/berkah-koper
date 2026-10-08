import type { APIRoute } from 'astro';

export const prerender = false;

type RuntimeLocals = {
  runtime?: { env?: Record<string, string | undefined> };
};

function envFrom(context: Parameters<APIRoute>[0]) {
  const runtime = (context.locals as RuntimeLocals)?.runtime?.env ?? {};
  const processEnv = typeof process !== 'undefined' ? process.env : {};
  return { runtime, processEnv };
}

function read(runtime: Record<string, string | undefined>, processEnv: NodeJS.ProcessEnv, key: string) {
  return runtime[key] || processEnv[key] || undefined;
}

/** Dynamic imports so a bad Keystatic/env load still returns JSON (not empty CF 500). */
export const ALL: APIRoute = async (context) => {
  try {
    const { runtime, processEnv } = envFrom(context);
    const clientId = read(runtime, processEnv, 'KEYSTATIC_GITHUB_CLIENT_ID');
    const clientSecret = read(runtime, processEnv, 'KEYSTATIC_GITHUB_CLIENT_SECRET');
    const secret = read(runtime, processEnv, 'KEYSTATIC_SECRET');

    if (!clientId || !clientSecret || !secret) {
      const runtimeKeys = Object.keys(runtime).filter((k) => k.includes('KEYSTATIC') || k.includes('PUBLIC_'));
      return new Response(
        JSON.stringify({
          error: 'Missing Keystatic env on Cloudflare',
          KEYSTATIC_GITHUB_CLIENT_ID: Boolean(clientId),
          KEYSTATIC_GITHUB_CLIENT_SECRET: Boolean(clientSecret),
          KEYSTATIC_SECRET: Boolean(secret),
          runtimeKeys,
          hint: 'Pages → Settings → Variables and secrets → Production (Encrypt secrets), then Retry deploy',
        }),
        { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } },
      );
    }

    const [{ makeHandler }, { default: config }] = await Promise.all([
      import('@keystatic/astro/api'),
      import('../../keystatic.config'),
    ]);

    const handler = makeHandler({ config, clientId, clientSecret, secret });
    return await handler(context);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return new Response(
      JSON.stringify({ error: 'Keystatic API failed', message, stack }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } },
    );
  }
};

export const all = ALL;
