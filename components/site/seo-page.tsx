import Link from 'next/link';
import { PageShell } from './page-shell';
import type { SeoPage } from '@/lib/seo-pages-data';
import { getSeoPage } from '@/lib/seo-pages-data';
import { SITE } from '@/lib/constants';

export function SeoPageView({ page }: { page: SeoPage }) {
  const isGuide = page.kind === 'guide';
  const parent = isGuide ? { label: 'Guides', path: '/guides' } : { label: 'Prestations', path: '/services' };
  const title = page.title.replace(/\s*[|—]\s*OKKO.*$/, '');
  const schema = isGuide ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description: page.description,
    mainEntityOfPage: `${SITE.url}${page.path}`, image: `${SITE.url}${page.image}`,
    datePublished: '2026-10-14', dateModified: '2026-10-14', inLanguage: 'fr-FR',
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url }, publisher: { '@id': `${SITE.url}/#organization` },
  } : {
    '@context': 'https://schema.org', '@type': 'Service', name: title, description: page.description,
    url: `${SITE.url}${page.path}`, provider: { '@id': `${SITE.url}/#organization` },
  };
  return <PageShell crumbs={[parent, { label: title, path: page.path }]}>
    <section className="shell detail-hero">
      <div><p className="eyebrow">{page.kicker}</p><h1>{title}</h1><p className="detail-intro">{page.intro}</p><Link className="action-link" href="/contact">Parlons de votre fiche <span aria-hidden="true">↗</span></Link></div>
      <figure className={`detail-photo${page.image.endsWith('plaque-google.jpg') ? ' product-photo' : ''}`}><img src={page.image} alt={page.image.endsWith('plaque-google.jpg') ? 'Support NFC et QR code pour accéder aux avis Google' : 'Photographie d’illustration d’un établissement et de son activité'} width={900} height={600} /><figcaption>Photographie d’illustration.</figcaption></figure>
    </section>
    <div className="shell detail-content">
      <nav className="article-toc" aria-label="Sommaire"><p className="eyebrow">Sur cette page</p>{page.sections.map((section, i) => <a key={section.heading} href={`#partie-${i + 1}`}><span>{String(i + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav>
      <div className="article-body">{page.sections.map((section, i) => <section key={section.heading} id={`partie-${i + 1}`}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, j) => <p key={j}>{paragraph}</p>)}{section.items?.length ? <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul> : null}</section>)}
        <section className="source-note"><h2>Pour aller plus loin avec Google</h2><p><a href="https://support.google.com/business/answer/7091?hl=fr">Les facteurs du classement local</a> et <a href="https://support.google.com/business/answer/3474122?hl=fr">les conseils pour demander des avis</a> expliquent les règles que nous suivons. OKKO est une agence indépendante, non affiliée à Google.</p></section>
      </div>
    </div>
    {page.faq.length ? <section className="section detail-faq"><div className="shell faq-grid"><div><p className="eyebrow">Les questions utiles</p><h2>Avant de<br />commencer.</h2></div><div className="faq">{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section> : null}
    <section className="related-section section"><div className="shell"><p className="eyebrow">Les sujets qui se complètent</p><h2>La suite de<br />votre réflexion.</h2><div className="related-links">{page.related.map(path => { const related = getSeoPage(path); const label = related?.title.replace(/\s*[|—]\s*OKKO.*$/, '') ?? ({ '/contact': 'Faire le point avec OKKO', '/services': 'Toutes les prestations', '/guides': 'Tous les guides' } as Record<string, string>)[path] ?? path; return <Link key={path} href={path}>{label}<span aria-hidden="true">↗</span></Link>; })}</div></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </PageShell>;
}
