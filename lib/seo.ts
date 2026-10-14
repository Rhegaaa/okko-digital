import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

const OG_IMAGE = { url: '/gmb-assets/og.png', width: 1200, height: 630, alt: 'OKKO Digital — agence de fiches Google en Haute-Savoie' };

export function pageMeta({ path, title, description, image, noindex }: { path: string; title: string; description: string; image?: string; noindex?: boolean }): Metadata {
  const url = `${SITE.url}${path}`;
  const images = image ? [{ url: image }] : [OG_IMAGE];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'fr_FR', siteName: 'OKKO Digital', url, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
