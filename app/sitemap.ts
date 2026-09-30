import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE } from '@/lib/constants';
import { SERVICES } from '@/lib/services-data';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function baseUrl() {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    if (host) return `https://${host}`;
  } catch {}
  return SITE.url;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await baseUrl();
  const now = new Date();
  let hasShowcase = false;
  try {
    hasShowcase = (await prisma.showcase.count({ where: { published: true } })) > 0;
  } catch {}
  const staticRoutes = ['', '/services', ...(hasShowcase ? ['/realisations'] : []), '/a-propos', '/contact'];
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: now, changeFrequency: 'monthly' as const, priority: r === '' ? 1 : 0.8 })),
    ...SERVICES.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 })),
  ];
}
