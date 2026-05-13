'use client';

import { useEffect } from 'react';
import type { CmsSection, CmsSettings } from '@/lib/cms';

const CHANNEL_NAME = 'cms-live-refresh';
const STORAGE_KEY = 'cms-live-refresh-event';

type CmsSnapshot = {
  settings?: Partial<CmsSettings>;
  sections?: Partial<Record<string, Partial<CmsSection>>>;
};

function setText(selector: string, value?: string) {
  if (typeof document === 'undefined' || !value) return;
  const element = document.querySelector<HTMLElement>(selector);
  if (element) {
    element.textContent = value;
  }
}

function setHref(selector: string, value?: string) {
  if (typeof document === 'undefined' || !value) return;
  const element = document.querySelector<HTMLAnchorElement>(selector);
  if (element) {
    element.setAttribute('href', value);
  }
}

function setImage(selector: string, value?: string, alt?: string) {
  if (typeof document === 'undefined' || !value) return;
  const element = document.querySelector<HTMLImageElement>(selector);
  if (element) {
    element.setAttribute('src', value);
    if (alt) {
      element.setAttribute('alt', alt);
    }
  }
}

function setVisible(selector: string, visible?: boolean) {
  if (typeof document === 'undefined' || visible === undefined) return;
  const element = document.querySelector<HTMLElement>(selector);
  if (element) {
    element.style.display = visible ? '' : 'none';
  }
}

function applyCmsSnapshot(snapshot: CmsSnapshot) {
  if (typeof document === 'undefined') return;

  const settings = snapshot.settings;
  const sections = snapshot.sections ?? {};

  const root = document.documentElement;
  if (settings?.primary_color) root.style.setProperty('--primary', settings.primary_color);
  if (settings?.secondary_color) root.style.setProperty('--secondary', settings.secondary_color);
  if (settings?.accent_color) root.style.setProperty('--accent', settings.accent_color);
  if (settings?.font_family) root.style.setProperty('--font-sans', settings.font_family);

  if (settings?.site_title) {
    document.title = settings.site_title;
    setText('[data-cms-field="site_title"]', settings.site_title);
  }

  if (settings?.site_description) {
    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = settings.site_description;
    }
    setText('[data-cms-field="site_description"]', settings.site_description);
  }

  setText('[data-cms-field="settings.company_phone"]', settings?.company_phone);
  setText('[data-cms-field="settings.company_email"]', settings?.company_email);
  setText('[data-cms-field="settings.company_address"]', settings?.company_address);

  for (const [sectionKey, section] of Object.entries(sections)) {
    if (!section) continue;
    const rootSelector = `[data-cms-section="${sectionKey}"]`;
    setVisible(rootSelector, section.is_visible);
    setText(`${rootSelector} [data-cms-field="title"]`, section.title);
    setText(`${rootSelector} [data-cms-field="subtitle"]`, section.subtitle);
    setText(`${rootSelector} [data-cms-field="description"]`, section.description);
    setText(`${rootSelector} [data-cms-field="button_text"]`, section.button_text);
    setHref(`${rootSelector} [data-cms-field="button_url"]`, section.button_url);
    setImage(`${rootSelector} [data-cms-field="image"]`, section.image_url, section.section_name);
  }
}

export function CmsLiveRefresh() {
  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel(CHANNEL_NAME)
      : null;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === 'cms-updated') {
          applyCmsSnapshot(event.data.snapshot ?? {});
        }
      };
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          applyCmsSnapshot(JSON.parse(event.newValue) as CmsSnapshot);
        } catch {
          // Ignore malformed payloads.
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return null;
}

export function broadcastCmsUpdate(snapshot?: CmsSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    type: 'cms-updated',
    timestamp: Date.now(),
    snapshot: snapshot ?? {},
  };

  applyCmsSnapshot(snapshot ?? {});

  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(payload);
    channel.close();
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot ?? {}));
}