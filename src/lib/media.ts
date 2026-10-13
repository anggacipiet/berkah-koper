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
  const digits = normalizeWaDigits(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Normalisasi ke format internasional 62… */
export function normalizeWaDigits(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('0')) d = `62${d.slice(1)}`;
  if (!d.startsWith('62') && d.length >= 9) d = `62${d}`;
  return d;
}

/** 6285282400061 → 0852-8240-0061 */
export function formatWaDisplay(phone: string): string {
  const d = normalizeWaDigits(phone);
  if (d.startsWith('62') && d.length >= 10) {
    const local = `0${d.slice(2)}`;
    if (local.length >= 11) {
      return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
    }
    return local;
  }
  return phone;
}
