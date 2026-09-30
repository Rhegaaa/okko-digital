import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/mentions-legales',
  title: 'Mentions légales — OKKO Digital',
  description: 'Mentions légales du site okko-digital.fr.',
  noindex: true,
});

const BLOCKS: { title: string; rows: [string, string][] }[] = [
  {
    title: 'Éditeur du site',
    rows: [
      ['Dénomination', SITE.name],
      ['Responsable', SITE.legal.owner],
      ['Forme juridique', SITE.legal.form],
      ['SIREN', SITE.legal.siren],
      ['SIRET', SITE.legal.siret],
      ['Adresse', SITE.legal.address],
      ['Email', SITE.email],
      ['TVA', SITE.legal.vat],
    ],
  },
  {
    title: 'Hébergement',
    rows: [['Hébergeur', SITE.legal.host]],
  },
];

export default function MentionsPage() {
  return (
    <section className="bg-[#F7F7F5] pb-32 pt-40 md:pb-48 md:pt-52">
      <div className="okko-container">
        <p className="eyebrow text-muted-foreground">Informations légales</p>
        <h1 className="display-lg mt-10">
          Mentions légales<span className="serif-accent font-normal">.</span>
        </h1>
        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <div className="space-y-16 md:col-span-7">
            {BLOCKS.map((b) => (
              <div key={b.title}>
                <h2 className="text-xl font-medium tracking-tight">{b.title}</h2>
                <dl className="mt-6 divide-y divide-[#E7E7E4] border-y border-[#E7E7E4]">
                  {b.rows.map(([k, v]) => (
                    <div key={k} className="grid gap-2 py-4 sm:grid-cols-3">
                      <dt className="text-sm text-muted-foreground">{k}</dt>
                      <dd className="text-base sm:col-span-2" suppressHydrationWarning>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <div>
              <h2 className="text-xl font-medium tracking-tight">Propriété intellectuelle</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">L&apos;ensemble des contenus de ce site (textes, visuels, maquettes, code) est la propriété d&apos;OKKO Digital, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.</p>
            </div>
            <div>
              <h2 className="text-xl font-medium tracking-tight">Données personnelles</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Les informations transmises via le formulaire de contact sont utilisées uniquement pour répondre à votre demande. Elles ne sont ni cédées ni vendues à des tiers. Vous pouvez demander leur consultation, modification ou suppression à tout moment en écrivant à {SITE.email}.</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Ce site n&apos;utilise pas de cookies publicitaires ni d&apos;outils de suivi tiers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
