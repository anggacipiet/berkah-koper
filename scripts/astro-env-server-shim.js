import { loadEnv } from 'vite';

/** Gabungkan .env + process.env — Keystatic baca via getSecret() */
const fileEnv = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  '', // semua prefix, termasuk KEYSTATIC_*
);

function read(key) {
  return process.env[key] ?? fileEnv[key] ?? undefined;
}

export const KEYSTATIC_GITHUB_CLIENT_ID = read('KEYSTATIC_GITHUB_CLIENT_ID');
export const KEYSTATIC_GITHUB_CLIENT_SECRET = read(
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
);
export const KEYSTATIC_SECRET = read('KEYSTATIC_SECRET');

export function getSecret(key) {
  return read(key);
}
