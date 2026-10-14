import '../gmb.css';
import { SITE } from '@/lib/constants';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': `${SITE.url}/#organization`, name: SITE.name,
        url: SITE.url, email: SITE.email, logo: `${SITE.url}/gmb-assets/favicon.svg`,
        description: 'Agence indépendante spécialisée dans l’optimisation et la gestion de fiches Google Business Profile.',
        knowsAbout: ['Google Business Profile', 'Google My Business', 'Fiches Google', 'Avis clients'],
      },
      {
        '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: SITE.url, name: SITE.name,
        publisher: { '@id': `${SITE.url}/#organization` }, inLanguage: 'fr-FR',
      },
    ],
  };
  return <>
    <link rel="preload" href="/gmb-assets/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    {children}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
  </>;
}
