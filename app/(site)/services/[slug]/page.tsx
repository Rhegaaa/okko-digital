import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES, getService } from '@/lib/services-data';
import { ServicePage } from '@/components/services/service-page';
import { SITE } from '@/lib/constants';
import { pageMeta } from '@/lib/seo';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: 'Service introuvable — OKKO Digital' };
  return pageMeta({ path: `/services/${s.slug}`, title: s.metaTitle, description: s.metaDescription, image: s.image });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const url = `${SITE.url}/services/${service.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.name,
        description: service.metaDescription,
        url,
        provider: { '@id': `${SITE.url}/#organization` },
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Haute-Savoie' }, { '@type': 'Country', name: 'France' }],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.url}/services` },
          { '@type': 'ListItem', position: 3, name: service.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <ServicePage service={service} others={others} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
