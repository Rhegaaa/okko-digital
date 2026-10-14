import '../gmb.css';
import { SITE } from '@/lib/constants';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: 'OKKO Digital',
        url: SITE.url,
        email: SITE.email,
        logo: `${SITE.url}/favicon.svg`,
        founder: { '@type': 'Person', name: 'Lorenzo Catenaccio', jobTitle: 'Fondateur' },
        address: { '@type': 'PostalAddress', postalCode: '74520', addressLocality: 'Savigny', addressRegion: 'Haute-Savoie', addressCountry: 'FR' },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE.url}/#service`,
        name: 'OKKO Digital',
        url: SITE.url,
        email: SITE.email,
        description: 'Agence indépendante spécialisée dans l’optimisation et la gestion de fiches Google en Haute-Savoie et dans le Genevois.',
        image: `${SITE.url}/gmb-assets/og.png`,
        parentOrganization: { '@id': `${SITE.url}/#organization` },
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Haute-Savoie' }, { '@type': 'Country', name: 'France' }],
        knowsAbout: ['Fiche Google Business Profile', 'Avis clients', 'Présence locale', 'Google Maps'],
        address: { '@type': 'PostalAddress', postalCode: '74520', addressLocality: 'Savigny', addressRegion: 'Haute-Savoie', addressCountry: 'FR' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: 'OKKO Digital',
        publisher: { '@id': `${SITE.url}/#organization` },
        inLanguage: 'fr-FR',
      },
    ],
  };
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#111111] focus:px-4 focus:py-2 focus:text-white">
        Aller au contenu
      </a>
      <div id="contenu">{children}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
