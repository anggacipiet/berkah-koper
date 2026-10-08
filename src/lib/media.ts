/** Resolve nilai gambar Keystatic / path lama menjadi URL publik */
export function resolvePublicImage(
  value: string | null | undefined,
  publicPath = '/images/',
): string {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return value;
  }
  const base = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;
  return `${base}${value.replace(/^\//, '')}`;
}

export function buildWaLink(
  message: string,
  phone = '6285282400061',
): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
