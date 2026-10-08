import type { APIRoute } from 'astro';

export const prerender = false;

type RuntimeLocals = {
  runtime?: { env?: Record<string, string | undefined> };
};

async function readSecret(
  context: Parameters<APIRoute>[0],
  key: string,
): Promise<string | undefined> {
  const fromRuntime = (context.locals as RuntimeLocals)?.runtime?.env?.[key];
  if (fromRuntime) return fromRuntime;

  try {
    const { getSecret } = await import('astro:env/server');
    const fromAstro = getSecret(
      key as
        | 'KEYSTATIC_GITHUB_CLIENT_ID'
        | 'KEYSTATIC_GITHUB_CLIENT_SECRET'
        | 'KEYSTATIC_SECRET',
    );
    if (fromAstro) return fromAstro;
  } catch {
    /* astro:env unavailable */
  }

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  return undefined;
}

/** Keystatic API for Cloudflare — secrets from runtime.env / astro:env. */
export const ALL: APIRoute = async (context) => {
  try {
    const clientId = await readSecret(context, 'KEYSTATIC_GITHUB_CLIENT_ID');
    const clientSecret = await readSecret(
      context,
      'KEYSTATIC_GITHUB_CLIENT_SECRET',
    );
    const secret = await readSecret(context, 'KEYSTATIC_SECRET');

    if (!clientId || !clientSecret || !secret) {
      return new Response(
        JSON.stringify({
          error: 'Missing Keystatic env on Cloudflare',
          KEYSTATIC_GITHUB_CLIENT_ID: Boolean(clientId),
          KEYSTATIC_GITHUB_CLIENT_SECRET: Boolean(clientSecret),
          KEYSTATIC_SECRET: Boolean(secret),
          hint: 'Secrets ada di Settings → Retry deployment supaya Worker baru dapat env.',
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
