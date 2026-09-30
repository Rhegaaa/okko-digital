import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { ContactForm } from '@/components/site/contact-form';
import { ContactIntro } from '@/components/site/contact-intro';

export const metadata: Metadata = pageMeta({
  path: '/contact',
  title: 'Contact et demande de devis — OKKO Digital',
  description: 'Parlez-nous de votre projet : présence locale, site web, automatisation ou solution métier. Réponse sous 48 heures ouvrées.',
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ projet?: string }> }) {
  const sp = await searchParams;
  const initial = typeof sp?.projet === 'string' ? sp.projet : undefined;
  return (
    <section className="bg-[#F7F7F5] pb-32 pt-40 md:pb-48 md:pt-52">
      <div className="okko-container grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <ContactIntro />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm initialProjectType={initial} />
        </div>
      </div>
    </section>
  );
}
