import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { SEO_PAGES } from '@/lib/seo-pages-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/services', '/guides', '/a-propos', '/contact', ...SEO_PAGES.map(page => page.path)];
  return paths.map(path => ({ url: `${SITE.url}${path}`, lastModified: new Date('2026-10-14'), changeFrequency: 'monthly', priority: path === '/' ? 1 : path.startsWith('/guides/') ? 0.6 : 0.8 }));
}
