import Link from 'next/link';
import { PageShell } from '@/components/site/page-shell';
import { SEO_PAGES } from '@/lib/seo-pages-data';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ path: '/services', title: 'Prestations Google Business Profile : fiches & avis | OKKO', description: 'Audit, optimisation, gestion de fiche Google, avis clients et carte NFC : choisissez un accompagnement adapté à votre établissement avec OKKO.' });

export default function ServicesPage() {
  return <PageShell crumbs={[{ label: 'Prestations', path: '/services' }]}>
    <section className="shell index-hero"><p className="eyebrow">Le savoir-faire OKKO</p><h1>Votre fiche Google.<br />Le bon accompagnement.</h1><p>Une remise à niveau ponctuelle ou une présence suivie dans la durée : nous définissons le travail utile à partir de votre établissement et de votre fiche Google Business Profile.</p></section>
    <section className="shell page-listing" aria-label="Prestations Google Business Profile">{SEO_PAGES.filter(page => page.kind === 'service').map((page, index) => <Link className="listing-row" href={page.path} key={page.path}><span className="listing-number">{String(index + 1).padStart(2, '0')}</span><div><h2>{page.heading}</h2><p>{page.description}</p></div><span className="listing-arrow" aria-hidden="true">↗</span></Link>)}</section>
    <section className="section related-section"><div className="shell decision-section"><div><p className="eyebrow">Choisir sans se compliquer</p><h2>Partons de<br />votre situation.</h2></div><div><p>Vous souhaitez identifier les priorités ? Commencez par un audit. Les informations sont à corriger ? L’optimisation remet la fiche à niveau. Vous manquez de temps au quotidien ? La gestion suit votre activité dans la durée.</p><p>Le contenu de la prestation, le rythme et les conditions sont précisés dans un devis. La fiche Google reste gratuite ; l’accompagnement rémunère le travail d’OKKO.</p><Link className="action-link" href="/contact">Définir mon besoin <span aria-hidden="true">↗</span></Link></div></div></section>
  </PageShell>;
}
