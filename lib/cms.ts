import 'server-only';

import { query } from '@/lib/db';

export interface CmsSettings {
  site_title: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  favicon_url: string;
  font_family: string;
  company_email: string;
  company_phone: string;
  company_address: string;
}

export interface CmsSection {
  id: number;
  section_name: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_url: string;
  is_visible: boolean;
  order_index: number;
}

export interface CmsPayload {
  settings: CmsSettings;
  sections: Record<string, CmsSection>;
}

const defaultSettings: CmsSettings = {
  site_title: 'AXXEN International | Premium Global Mineral Solutions',
  site_description:
    'AXXEN International is a trusted mineral dealer delivering premium quality minerals with integrity, reliability, and global excellence.',
  primary_color: '#c9a227',
  secondary_color: '#1e2b4a',
  accent_color: '#daa520',
  logo_url: '',
  favicon_url: '',
  font_family: 'Inter, sans-serif',
  company_email: 'info@axxeninternational.com',
  company_phone: '+255 738 040 423',
  company_address: 'Dar es Salaam, Tanzania',
};

function asText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  return value;
}

function sanitizeHexColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized)
    ? normalized
    : fallback;
}

function normalizeSettings(raw: Record<string, unknown> | undefined): CmsSettings {
  return {
    site_title: asText(raw?.site_title, defaultSettings.site_title),
    site_description: asText(raw?.site_description, defaultSettings.site_description),
    primary_color: sanitizeHexColor(raw?.primary_color, defaultSettings.primary_color),
    secondary_color: sanitizeHexColor(raw?.secondary_color, defaultSettings.secondary_color),
    accent_color: sanitizeHexColor(raw?.accent_color, defaultSettings.accent_color),
    logo_url: asText(raw?.logo_url),
    favicon_url: asText(raw?.favicon_url),
    font_family: asText(raw?.font_family, defaultSettings.font_family),
    company_email: asText(raw?.company_email, defaultSettings.company_email),
    company_phone: asText(raw?.company_phone, defaultSettings.company_phone),
    company_address: asText(raw?.company_address, defaultSettings.company_address),
  };
}

function normalizeSection(raw: Record<string, unknown>): CmsSection {
  return {
    id: Number(raw.id || 0),
    section_name: asText(raw.section_name),
    section_key: asText(raw.section_key),
    title: asText(raw.title),
    subtitle: asText(raw.subtitle),
    description: asText(raw.description),
    image_url: asText(raw.image_url),
    button_text: asText(raw.button_text),
    button_url: asText(raw.button_url),
    is_visible: raw.is_visible !== false,
    order_index: Number(raw.order_index || 0),
  };
}

export async function getCmsPayload(): Promise<CmsPayload> {
  try {
    const [settingsResult, sectionsResult] = await Promise.all([
      query('SELECT * FROM website_settings ORDER BY id DESC LIMIT 1'),
      query('SELECT * FROM page_sections ORDER BY order_index ASC'),
    ]);

    const settings = normalizeSettings(settingsResult.rows[0]);
    const sections = sectionsResult.rows.reduce<Record<string, CmsSection>>((acc, row) => {
      const section = normalizeSection(row as Record<string, unknown>);
      if (section.section_key) {
        acc[section.section_key] = section;
      }
      return acc;
    }, {});

    return { settings, sections };
  } catch (error) {
    console.error('Failed to load CMS payload:', error);
    return { settings: defaultSettings, sections: {} };
  }
}
