import { publishedGrowth } from '@/lib/growthpilot/public';
import Link from 'next/link';
import { PageShell } from '@/components/site/page-shell';
import { SEO_PAGES } from '@/lib/seo-pages-data';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ path: '/guides', title: 'Guides fiche Google : optimisation et avis clients | OKKO', description: 'Des conseils concrets pour optimiser une fiche Google Business Profile, demander des avis authentiques et répondre aux commentaires de vos clients.' });

export const dynamic = 'force-dynamic';
export default async function GuidesPage() {
  const articles = await publishedGrowth();
  return <PageShell crumbs={[{ label: 'Guides', path: '/guides' }]}>
    <section className="shell index-hero"><p className="eyebrow">Les guides OKKO</p><h1>Comprendre votre fiche.<br />Faire les bons gestes.</h1><p>Des explications pratiques sur Google Business Profile, les informations de votre établissement et les avis clients. Pour savoir quoi vérifier et pourquoi.</p></section>
    <section className="shell page-listing guide-listing" aria-label="Guides Google Business Profile">{SEO_PAGES.filter(page => page.kind === 'guide').map(page => <Link className="listing-row" href={page.path} key={page.path}><img src={page.image} alt="Photographie d’illustration d’un établissement" width={300} height={200} loading="lazy" /><div><p className="eyebrow">Guide pratique</p><h2>{page.heading}</h2><p>{page.description}</p><span className="read-label">Lire le guide</span></div><span className="listing-arrow" aria-hidden="true">↗</span></Link>)}</section>
    {!!articles.length && <section className="shell page-listing guide-listing" aria-label="Les nouveaux guides OKKO">{articles.map(article=><Link className="listing-row" href={`/guides/${article.slug}`} key={article.slug}><img src={SEO_PAGES.find(p=>p.kind==='guide')!.image} alt="Photographie d’illustration d’un établissement" width={300} height={200} loading="lazy" /><div><p className="eyebrow">Guide pratique · {article.publishedAt?.toLocaleDateString('fr-FR')}</p><h2>{article.title}</h2><p>{article.description}</p><span className="read-label">Lire le guide</span></div><span className="listing-arrow" aria-hidden="true">↗</span></Link>)}</section>}
    <section className="section related-section"><div className="shell decision-section"><h2>Besoin d’un regard<br />sur votre fiche ?</h2><div><p>Ces guides vous aident à comprendre les principes. Si vous souhaitez un diagnostic propre à votre établissement, regardons votre vraie fiche ensemble.</p><Link className="action-link" href="/audit-fiche-google">Découvrir l’audit de fiche Google <span aria-hidden="true">↗</span></Link></div></div></section>
  </PageShell>;
}
