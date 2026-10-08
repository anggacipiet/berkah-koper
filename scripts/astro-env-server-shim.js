/** Shim untuk @keystatic/astro — local mode tidak butuh secret GitHub */
export const KEYSTATIC_GITHUB_CLIENT_ID = undefined;
export const KEYSTATIC_GITHUB_CLIENT_SECRET = undefined;
export const KEYSTATIC_SECRET = undefined;

export function getSecret(key) {
  return process.env[key];
}
