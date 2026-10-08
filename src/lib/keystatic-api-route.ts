import type { APIRoute } from 'astro';

export const prerender = false;

type RuntimeLocals = {
  runtime?: { env?: Record<string, string | undefined> };
};

async function readSecret(
  context: Parameters<APIRoute>[0],
  key: string,
): Promise<string | undefined> {
  const runtimeEnv = (context.locals as RuntimeLocals)?.runtime?.env;
  const fromRuntime = runtimeEnv?.[key];
  if (fromRuntime) return fromRuntime;

  try {
    const { env } = await import('cloudflare:workers');
    const fromCf = (env as Record<string, string | undefined>)?.[key];
    if (fromCf) return fromCf;
  } catch {
    /* not on Cloudflare workers runtime */
  }

  try {
    const { getSecret } = await import('astro:env/server');
    const fromAstro = getSecret(key as 'KEYSTATIC_GITHUB_CLIENT_ID');
    if (fromAstro) return fromAstro;
  } catch {
    /* astro:env unavailable */
  }

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  return undefined;
}

/** Keystatic API for Cloudflare — secrets from runtime / cloudflare:workers / astro:env. */
export const ALL: APIRoute = async (context) => {
  try {
    const clientId = await readSecret(context, 'KEYSTATIC_GITHUB_CLIENT_ID');
    const clientSecret = await readSecret(context, 'KEYSTATIC_GITHUB_CLIENT_SECRET');
    const secret = await readSecret(context, 'KEYSTATIC_SECRET');

    if (!clientId || !clientSecret || !secret) {
      return new Response(
        JSON.stringify({
          error: 'Missing Keystatic env on Cloudflare',
          KEYSTATIC_GITHUB_CLIENT_ID: Boolean(clientId),
          KEYSTATIC_GITHUB_CLIENT_SECRET: Boolean(clientSecret),
          KEYSTATIC_SECRET: Boolean(secret),
          hint: 'Cloudflare → berkah-koper → Settings → Variables and secrets → Production. Add the 3 KEYSTATIC_* secrets (Encrypt), Save, then Retry deploy.',
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
