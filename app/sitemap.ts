import { publishedGrowth } from '@/lib/growthpilot/public';
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { SEO_PAGES } from '@/lib/seo-pages-data';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles=await publishedGrowth();
  const paths = ['/', '/services', '/guides', '/a-propos', '/contact', ...SEO_PAGES.map(page => page.path)];
  return [...articles.map(a=>({url:`${SITE.url}/guides/${a.slug}`,lastModified:a.updatedAt,changeFrequency:'monthly' as const,priority:0.6})),...paths.map(path => ({ url: `${SITE.url}${path}`, lastModified: new Date('2026-10-14'), changeFrequency: 'monthly' as const, priority: path === '/' ? 1 : path.startsWith('/guides/') ? 0.6 : 0.8 }))];
}
