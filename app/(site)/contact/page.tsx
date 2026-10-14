import Link from 'next/link';
import { PageShell } from '@/components/site/page-shell';
import { contactFormMarkup } from '@/lib/gmb-shell';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ path: '/contact', title: 'Contact OKKO : parlons de votre fiche Google', description: 'Présentez votre établissement et votre fiche Google à OKKO. Échangeons sur vos besoins d’audit, d’optimisation ou de gestion de Google Business Profile.' });

export default function ContactPage() {
  return <PageShell crumbs={[{ label: 'Contact', path: '/contact' }]}>
    <section className="shell index-hero"><p className="eyebrow">Tout commence par un échange</p><h1>Parlons de votre fiche.<br />Et de votre établissement.</h1><p>Une fiche à reprendre, des informations à corriger, des avis à accompagner ? Partagez votre situation. Nous regarderons le travail utile avant de vous proposer un devis.</p></section>
    <section className="contact-section section"><div className="shell contact-grid"><div><h2>Quelques mots<br />pour commencer.</h2><p>Le lien de votre fiche Google et une courte description de votre besoin nous aident à préparer l’échange. Si vous ne retrouvez pas votre fiche, indiquez simplement le nom de l’établissement dans le champ prévu.</p><a className="contact-email action-link" href="mailto:contact@okko-digital.fr">contact@okko-digital.fr <span aria-hidden="true">↗</span></a><p>Vous préférez commencer par comprendre la prestation ? <Link className="inline-link" href="/audit-fiche-google">Découvrez l’audit de fiche Google</Link>.</p></div><div dangerouslySetInnerHTML={{ __html: contactFormMarkup }} /></div></section>
  </PageShell>;
}
