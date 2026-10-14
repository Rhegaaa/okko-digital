import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

const OG_IMAGE = { url: '/gmb-assets/og.png', width: 1200, height: 630, alt: 'OKKO Digital — agence de fiches Google' };

export function pageMeta({ path, title, description, image, noindex, article }: { path: string; title: string; description: string; image?: string; noindex?: boolean; article?: boolean }): Metadata {
  const url = `${SITE.url}${path}`;
  const images = image ? [{ url: image }] : [OG_IMAGE];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: article ? 'article' : 'website', locale: 'fr_FR', siteName: 'OKKO Digital', url, title, description, images, ...(article ? { publishedTime: '2026-10-14', modifiedTime: '2026-10-14' } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
    robots: { index: !noindex && process.env.VERCEL_ENV !== 'preview', follow: true },
  };
}
