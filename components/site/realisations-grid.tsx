'use client';

import { ArrowUpRight } from 'lucide-react';
import { TextReveal, Reveal, ImageReveal } from '@/components/site/motion';
import { OkkoButton } from '@/components/site/okko-button';
import { CtaFinal } from '@/components/home/cta-final';
import { SERVICE_LABELS } from '@/lib/constants';

export type ShowcaseFull = {
  id: string;
  title: string;
  clientName: string | null;
  service: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  year: string | null;
};

export function RealisationsGrid({ items }: { items: ShowcaseFull[] }) {
  const list = items ?? [];
  return (
    <>
      <section className="bg-[#F7F7F5] pb-24 pt-40 md:pb-32 md:pt-52" aria-labelledby="real-title">
        <div className="okko-container">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Réalisations</p>
          </Reveal>
          <h1 id="real-title" className="display-xl mt-10 max-w-5xl text-balance">
            <TextReveal as="span" text="Du concret," className="block" />
            <TextReveal as="span" text="pas des promesses." className="serif-accent block font-normal" delay={0.15} />
          </h1>
          <Reveal className="mt-14" delay={0.25}>
            <p className="lead max-w-2xl text-muted-foreground">Nous ne montrons ici que des projets réels, livrés et en service. Chaque réalisation est publiée avec l’accord du client.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24 md:py-36">
        <div className="okko-container">
          {list.length === 0 ? (
            <Reveal>
              <div className="grid gap-10 border-t border-[#E7E7E4] pt-12 md:grid-cols-12">
                <p className="display-md md:col-span-7">
                  Projets sélectionnés<span className="serif-accent font-normal">.</span>
                </p>
                <div className="md:col-span-5">
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground">Chaque projet que nous accompagnons est unique. Nous publierons ici nos collaborations au fil du temps. En attendant, parlons du vôtre.</p>
                  <div className="mt-8">
                    <OkkoButton href="/contact">Parler de mon projet</OkkoButton>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <ul className="grid gap-x-8 gap-y-20 md:grid-cols-2">
              {list.map((it, i) => (
                <Reveal key={it.id} delay={(i % 2) * 0.1}>
                  <li id={it.id} className="scroll-mt-32">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#F7F7F5]">
                      {it.imageUrl ? (
                        <ImageReveal src={it.imageUrl} alt={it.title} className="h-full w-full" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">{SERVICE_LABELS[it.service] ?? it.service}</div>
                      )}
                    </div>
                    <div className="mt-6">
                      <p className="font-mono text-xs text-muted-foreground">
                        {SERVICE_LABELS[it.service] ?? it.service}
                        {it.clientName ? ` — ${it.clientName}` : ''}
                        {it.year ? ` — ${it.year}` : ''}
                      </p>
                      <h2 className="mt-2 text-2xl font-medium tracking-tight">{it.title}</h2>
                      {it.summary ? <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{it.summary}</p> : null}
                      {it.description ? <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{it.description}</p> : null}
                      {it.url ? (
                        <a href={it.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                          <span className="link-underline">Voir le projet</span>
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                        </a>
                      ) : null}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
