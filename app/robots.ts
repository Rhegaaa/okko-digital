import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let base = SITE.url;
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    if (host) base = `https://${host}`;
  } catch {}
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/control', '/api'] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
