'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TextReveal, Reveal, ImageReveal } from '@/components/site/motion';
import { CtaFinal } from '@/components/home/cta-final';
import type { ServiceData } from '@/lib/services-data';

export function ServicesIndex({ services }: { services: ServiceData[] }) {
  return (
    <>
      <section className="bg-[#F7F7F5] pb-24 pt-40 md:pb-32 md:pt-52" aria-labelledby="services-title">
        <div className="okko-container">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Nos expertises</p>
          </Reveal>
          <h1 id="services-title" className="display-xl mt-10 max-w-5xl text-balance">
            <TextReveal as="span" text="Quatre façons de" className="block" />
            <TextReveal as="span" text="vous rendre la vie plus simple." className="serif-accent block font-normal" delay={0.15} />
          </h1>
          <Reveal className="mt-14" delay={0.25}>
            <p className="lead max-w-2xl text-muted-foreground">Chaque expertise répond à un besoin précis. Elles peuvent être combinées, mais nous ne vous vendrons jamais ce dont vous n’avez pas besoin.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <ul>
          {(services ?? []).map((s, i) => (
            <li key={s.slug} className={`${i % 2 === 1 ? 'bg-[#F7F7F5]' : 'bg-white'} border-t border-[#E7E7E4]`}>
              <Link href={`/services/${s.slug}`} className="group block">
                <div className="okko-container grid items-center gap-12 py-24 md:grid-cols-12 md:py-32">
                  <div className={`md:col-span-6 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                    <Reveal>
                      <p className="font-mono text-xs text-muted-foreground">{s.number}</p>
                      <h2 className="display-md mt-6 text-balance">
                        {s.title[0]} <span className="serif-accent font-normal">{s.title[1]}</span>
                      </h2>
                      <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">{s.intro}</p>
                      <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium">
                        <span className="link-underline">{s.name}</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-okko group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                      </span>
                    </Reveal>
                  </div>
                  <div className={`md:col-span-6 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                    <ImageReveal src={s.image} alt={s.imageAlt} className="aspect-[4/3] w-full rounded-[8px]" imgClassName="transition-transform duration-[1400ms] ease-okko group-hover:scale-[1.03]" parallax={4} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaFinal />
    </>
  );
}
