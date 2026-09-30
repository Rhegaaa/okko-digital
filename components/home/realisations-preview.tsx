'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal, ImageReveal } from '@/components/site/motion';
import { SERVICE_LABELS } from '@/lib/constants';

export type ShowcaseItem = {
  id: string;
  title: string;
  clientName: string | null;
  service: string;
  summary: string | null;
  imageUrl: string | null;
  url: string | null;
};

export function RealisationsPreview({ items }: { items: ShowcaseItem[] }) {
  const list = items ?? [];
  return (
    <section className="bg-white py-32 md:py-48" aria-labelledby="real-title">
      <div className="okko-container">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow text-muted-foreground">Réalisations</p>
            </Reveal>
            <h2 id="real-title" className="display-lg mt-8">
              <TextReveal as="span" text="Du concret," className="block" />
              <TextReveal as="span" text="pas des promesses." className="serif-accent block font-normal" delay={0.15} />
            </h2>
          </div>
          {list.length > 0 ? (
            <Reveal delay={0.2}>
              <OkkoButton href="/realisations" variant="link">
                Voir toutes les réalisations
              </OkkoButton>
            </Reveal>
          ) : null}
        </div>

        {list.length === 0 ? (
          <Reveal className="mt-20 md:mt-28" delay={0.1}>
            <div className="grid gap-10 border-t border-[#E7E7E4] pt-12 md:grid-cols-12">
              <p className="display-sm md:col-span-7">
                Nos premières réalisations arrivent<span className="serif-accent font-normal">.</span>
              </p>
              <div className="md:col-span-5">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">Nous préférons montrer des projets réels, livrés et en service, plutôt que des exemples fictifs. Cette page se remplira au fil de nos collaborations.</p>
                <div className="mt-8">
                  <OkkoButton href="/contact" variant="secondary">
                    Parler de mon projet
                  </OkkoButton>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-20 grid gap-x-8 gap-y-16 md:mt-28 md:grid-cols-2">
            {list.slice(0, 4).map((it, i) => (
              <Reveal key={it.id} delay={i * 0.08} className={i % 2 === 1 ? 'md:mt-24' : ''}>
                <li>
                  <Link href={`/realisations#${it.id}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#F7F7F5]">
                      {it.imageUrl ? (
                        <ImageReveal src={it.imageUrl} alt={it.title} className="h-full w-full" imgClassName="transition-transform duration-[1200ms] ease-okko group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">{SERVICE_LABELS[it.service] ?? it.service}</div>
                      )}
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-6">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{SERVICE_LABELS[it.service] ?? it.service}{it.clientName ? ` — ${it.clientName}` : ''}</p>
                        <h3 className="mt-2 text-2xl font-medium tracking-tight">{it.title}</h3>
                        {it.summary ? <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{it.summary}</p> : null}
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition-transform duration-500 ease-okko group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
