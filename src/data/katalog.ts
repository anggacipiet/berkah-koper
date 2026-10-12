import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { resolvePublicImage } from '../lib/media';

export interface KatalogDownload {
  eyebrow: string;
  heading: string;
  buttonLabel: string;
  /** URL publik file PDF, kosong jika belum diupload */
  fileUrl: string;
  /** Nama file untuk atribut download */
  fileName: string;
}

const KATALOG_PATH = path.join(process.cwd(), 'content/settings/katalog-download.yaml');
const PUBLIC_DIR = path.join(process.cwd(), 'public/files/katalog');

const FALLBACK: KatalogDownload = {
  eyebrow: 'Siap berangkat?',
  heading: 'Lengkapi perlengkapan ibadah Anda sekarang.',
  buttonLabel: 'Download Katalog',
  fileUrl: '',
  fileName: 'katalog-berkah-koper.pdf',
};

function resolveFileUrl(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  return resolvePublicImage(raw.trim(), '/files/katalog/');
}

function fileNameFromUrl(url: string): string {
  if (!url) return FALLBACK.fileName;
  const base = url.split('/').pop() || FALLBACK.fileName;
  return base.includes('.') ? base : `${base}.pdf`;
}

/** Ambil file terbaru di folder jika YAML belum punya path (fallback aman) */
function latestFileInPublic(): string {
  if (!fs.existsSync(PUBLIC_DIR)) return '';
  const files = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => !f.startsWith('.') && /\.(pdf|zip)$/i.test(f))
    .map((f) => {
      const full = path.join(PUBLIC_DIR, f);
      return { f, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  return files[0] ? `/files/katalog/${files[0].f}` : '';
}

export function getKatalogDownload(): KatalogDownload {
  let eyebrow = FALLBACK.eyebrow;
  let heading = FALLBACK.heading;
  let buttonLabel = FALLBACK.buttonLabel;
  let fileUrl = '';

  if (fs.existsSync(KATALOG_PATH)) {
    try {
      const data = loadYaml(fs.readFileSync(KATALOG_PATH, 'utf8')) as {
        eyebrow?: string;
        heading?: string;
        buttonLabel?: string;
        file?: string | null;
      };
      if (data.eyebrow?.trim()) eyebrow = data.eyebrow.trim();
      if (data.heading?.trim()) heading = data.heading.trim();
      if (data.buttonLabel?.trim()) buttonLabel = data.buttonLabel.trim();
      // Kosong / null = belum ada file
      if (data.file?.trim()) fileUrl = resolveFileUrl(data.file);
    } catch {
      /* pakai fallback */
    }
  }

  if (!fileUrl) fileUrl = latestFileInPublic();

  return {
    eyebrow,
    heading,
    buttonLabel,
    fileUrl,
    fileName: fileNameFromUrl(fileUrl),
  };
}
