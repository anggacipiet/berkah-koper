import type { APIRoute } from 'astro';

export const prerender = false;

const REPO = 'anggacipiet/berkah-koper';
const PDF_PATH = 'public/files/katalog/katalog-berkah-koper.pdf';
const YAML_PATH = 'content/settings/katalog-download.yaml';
const PUBLIC_URL = '/files/katalog/katalog-berkah-koper.pdf';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function getToken(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}

async function gh(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/vnd.github+json');
  headers.set('User-Agent', 'BerkahKoper-Katalog-Upload');
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`https://api.github.com${path}`, { ...init, headers });
}

async function getFileSha(
  token: string,
  path: string,
  branch: string,
): Promise<string | undefined> {
  const res = await gh(
    token,
    `/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(branch)}`,
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal baca ${path}: ${res.status} ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const token = getToken(request);
    if (!token) {
      return json(
        {
          error:
            'Token GitHub tidak ada. Login dulu di /keystatic lalu buka lagi halaman upload.',
        },
        401,
      );
    }

    const form = await request.formData();
    const file = form.get('file');
    const branch = String(form.get('branch') || 'main').trim() || 'main';

    if (!(file instanceof File)) {
      return json({ error: 'File PDF wajib diisi' }, 400);
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return json({ error: 'Hanya file PDF yang diterima' }, 400);
    }
    // Cloudflare Pages menolak asset > 25 MiB (file.pdf 31.9 MiB sempat gagal deploy)
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return json(
        {
          error:
            'PDF terlalu besar untuk Cloudflare Pages (maks ~20 MB, batas platform 25 MB). Kompres PDF, atau host di Google Drive / R2 lalu tempel URL https:// di Keystatic → CTA Siap Berangkat → Link katalog PDF.',
          sizeMB: Number((file.size / (1024 * 1024)).toFixed(1)),
        },
        400,
      );
    }

    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const pdfBase64 = bytesToBase64(pdfBytes);
    const pdfSha = await getFileSha(token, PDF_PATH, branch);

    const putPdf = await gh(token, `/repos/${REPO}/contents/${PDF_PATH}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `chore: update katalog PDF (${file.name})`,
        content: pdfBase64,
        branch,
        ...(pdfSha ? { sha: pdfSha } : {}),
      }),
    });

    if (!putPdf.ok) {
      const text = await putPdf.text();
      return json(
        {
          error: 'Gagal commit PDF ke GitHub',
          status: putPdf.status,
          detail: text.slice(0, 400),
        },
        502,
      );
    }

    // Update YAML path agar tombol CTA mengarah ke file ini
    const yamlSha = await getFileSha(token, YAML_PATH, branch);
    let yamlText = `eyebrow: Siap berangkat?\nheading: Lengkapi perlengkapan ibadah Anda sekarang.\nbuttonLabel: Download Katalog\nfile: ${PUBLIC_URL}\n`;

    if (yamlSha) {
      const getYaml = await gh(
        token,
        `/repos/${REPO}/contents/${YAML_PATH}?ref=${encodeURIComponent(branch)}`,
      );
      if (getYaml.ok) {
        const data = (await getYaml.json()) as { content?: string; encoding?: string };
        if (data.content) {
          const decoded = atob(data.content.replace(/\n/g, ''));
          if (/^file:\s*.*$/m.test(decoded)) {
            yamlText = decoded.replace(/^file:\s*.*$/m, `file: ${PUBLIC_URL}`);
          } else {
            yamlText = decoded.trimEnd() + `\nfile: ${PUBLIC_URL}\n`;
          }
        }
      }
    }

    const putYaml = await gh(token, `/repos/${REPO}/contents/${YAML_PATH}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: 'chore: set path katalog download CTA',
        content: bytesToBase64(new TextEncoder().encode(yamlText)),
        branch,
        ...(yamlSha ? { sha: yamlSha } : {}),
      }),
    });

    if (!putYaml.ok) {
      const text = await putYaml.text();
      return json(
        {
          error: 'PDF terupload, tapi gagal update YAML path',
          status: putYaml.status,
          detail: text.slice(0, 400),
          fileUrl: PUBLIC_URL,
        },
        502,
      );
    }

    return json({
      ok: true,
      fileUrl: PUBLIC_URL,
      message:
        'PDF tersimpan. Tunggu Cloudflare Pages deploy (1–2 menit), lalu cek tombol Download Katalog di beranda.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
};
