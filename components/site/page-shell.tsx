import Link from 'next/link';
import { headerMarkup, footerMarkup } from '@/lib/gmb-shell';
import { GmbContact } from './gmb-contact';
import { SITE } from '@/lib/constants';

export type Crumb = { label: string; path: string };

export function PageShell({ children, crumbs }: { children: React.ReactNode; crumbs: Crumb[] }) {
  const items = [{ label: 'Accueil', path: '/' }, ...crumbs];
  const schema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE.url}${item.path}` })),
  };
  return <div className="gmb-site">
    <a className="skip-link" href="#contenu-gmb">Aller au contenu</a>
    <div dangerouslySetInnerHTML={{ __html: headerMarkup }} />
    <main id="contenu-gmb">
      <nav className="shell breadcrumbs" aria-label="Fil d’Ariane">
        {items.map((item, index) => <span key={item.path}>{index > 0 ? <span aria-hidden="true" className="crumb-separator">/</span> : null}{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.path}>{item.label}</Link>}</span>)}
      </nav>
      {children}
    </main>
    <div dangerouslySetInnerHTML={{ __html: footerMarkup }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <GmbContact />
  </div>;
}
