import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import {
  buildWaLink,
  formatWaDisplay,
  normalizeWaDigits,
  resolvePublicImage,
} from '../lib/media';

export interface HubungiAdmin {
  name: string;
  role: string;
  phone: string;
  phoneDisplay: string;
  waUrl: string;
  image: string;
}

export interface HubungiGroup {
  title: string;
  description: string;
  coverImage: string;
  admins: HubungiAdmin[];
}

export interface HubungiContent {
  heading: string;
  description: string;
  groups: HubungiGroup[];
}

const HUBUNGI_PATH = path.join(process.cwd(), 'content/settings/hubungi.yaml');

const FALLBACK: HubungiContent = {
  heading: 'Hubungi Kami',
  description:
    'Tim admin Berkah Koper siap membantu pemesanan, custom logo, dan konsultasi perlengkapan Haji & Umrah.',
  groups: [
    {
      title: 'Berkah Koper Group',
      description: 'Chat langsung dengan admin untuk info stok & harga.',
      coverImage: '/images/logo.webp',
      admins: [
        {
          name: 'Admin Utama',
          role: 'Customer Service',
          phone: '6285282400061',
          phoneDisplay: '0852-8240-0061',
          waUrl: buildWaLink(
            "Assalamu'alaikum Berkah Koper, saya ingin tanya produk.",
            '6285282400061',
          ),
          image: '/images/logo.webp',
        },
      ],
    },
  ],
};

type RawAdmin = {
  name?: string;
  role?: string;
  phone?: string;
  image?: string | null;
  waMessage?: string;
};

type RawGroup = {
  title?: string;
  description?: string;
  coverImage?: string | null;
  admins?: RawAdmin[];
};

function normalizeAdmin(raw: RawAdmin): HubungiAdmin | null {
  if (!raw?.name?.trim() || !raw?.phone?.trim()) return null;
  const phone = normalizeWaDigits(raw.phone);
  const message =
    raw.waMessage?.trim() ||
    `Assalamu'alaikum, saya ingin menghubungi ${raw.name.trim()} (Berkah Koper).`;
  return {
    name: raw.name.trim(),
    role: raw.role?.trim() || 'Admin',
    phone,
    phoneDisplay: formatWaDisplay(phone),
    waUrl: buildWaLink(message, phone),
    image: resolvePublicImage(raw.image) || '/images/logo.webp',
  };
}

function normalizeGroup(raw: RawGroup): HubungiGroup | null {
  if (!raw?.title?.trim()) return null;
  const admins = (raw.admins ?? [])
    .map(normalizeAdmin)
    .filter((a): a is HubungiAdmin => Boolean(a));
  return {
    title: raw.title.trim(),
    description: raw.description?.trim() || '',
    coverImage: resolvePublicImage(raw.coverImage) || '/images/logo.webp',
    admins,
  };
}

export function getHubungi(): HubungiContent {
  if (!fs.existsSync(HUBUNGI_PATH)) return FALLBACK;

  try {
    const data = loadYaml(fs.readFileSync(HUBUNGI_PATH, 'utf8')) as Partial<
      HubungiContent & { groups?: RawGroup[] }
    >;
    const groups = (data.groups ?? [])
      .map(normalizeGroup)
      .filter((g): g is HubungiGroup => Boolean(g));

    return {
      heading: data.heading?.trim() || FALLBACK.heading,
      description: data.description?.trim() || FALLBACK.description,
      groups: groups.length ? groups : FALLBACK.groups,
    };
  } catch {
    return FALLBACK;
  }
}
