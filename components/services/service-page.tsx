'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal, ImageReveal, LineReveal } from '@/components/site/motion';
import { PhoneGoogleMockup } from '@/components/home/presence-locale';
import { SiteMockupContent } from '@/components/home/sites-web';
import { FlowVisual } from '@/components/home/automatisation';
import { BusinessDashboardMockup } from '@/components/home/solutions-metier';
import { METHOD_STEPS } from '@/components/home/methode';
import type { ServiceData } from '@/lib/services-data';

function NfcPlaque() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <motion.div
        initial={reduce ? false : { rotateX: 12, rotateY: -10, opacity: 0, y: 30 }}
        whileInView={{ rotateX: 6, rotateY: -6, opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformPerspective: 900 }}
        className="aspect-[4/5] rounded-[14px] bg-[#111111] p-8 text-white shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)]"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Votre avis compte</p>
        <p className="mt-3 text-2xl font-medium tracking-tight">Approchez votre téléphone</p>
        <div className="mt-10 grid grid-cols-6 gap-1.5">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className={`aspect-square rounded-[2px] ${[0, 1, 2, 5, 6, 8, 11, 12, 13, 14, 17, 18, 20, 23, 24, 26, 27, 29, 30, 31, 33, 35].includes(i) ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between text-xs text-white/60">
          <span>Google</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            NFC
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Visual({ service }: { service: ServiceData }) {
  switch (service?.slug) {
    case 'presence-locale':
      return (
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="mx-auto w-[240px] md:w-[280px]">
            <PhoneGoogleMockup />
          </div>
          <NfcPlaque />
        </div>
      );
    case 'sites-web':
      return (
        <Reveal>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[10px] border border-[#E7E7E4] bg-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-1.5 border-b border-[#E7E7E4] bg-[#F7F7F5] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7E4]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7E4]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7E4]" />
            </div>
            <div className="aspect-[16/9] text-[clamp(14px,2.2vw,26px)]">
              <SiteMockupContent />
            </div>
          </div>
        </Reveal>
      );
    case 'automatisation':
      return (
        <div className="text-white">
          <FlowVisual />
        </div>
      );
    case 'solutions-metier':
      return (
        <Reveal>
          <div className="rounded-[10px] bg-[#F7F7F5] p-4 sm:p-10">
            <BusinessDashboardMockup />
          </div>
        </Reveal>
      );
    default:
      return null;
  }
}

export function ServicePage({ service, others }: { service: ServiceData; others: ServiceData[] }) {
  const dark = !!service?.dark;
  return (
    <>
      {/* Hero */}
      <section className={`${dark ? 'theme-dark bg-[#111111] text-white' : 'bg-[#F7F7F5]'} pb-24 pt-40 md:pb-32 md:pt-52`} aria-labelledby="service-title">
        <div className="okko-container">
          <Reveal>
            <p className={`eyebrow ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
              {service?.number} — {service?.name}
            </p>
          </Reveal>
          <h1 id="service-title" className="display-xl mt-10 max-w-5xl text-balance">
            <TextReveal as="span" text={service?.title?.[0] ?? ''} className="block" />
            <TextReveal as="span" text={service?.title?.[1] ?? ''} className="serif-accent block font-normal" delay={0.15} />
          </h1>
          <div className="mt-14 grid gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-6" delay={0.25}>
              <p className={`lead max-w-xl ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>{service?.intro}</p>
            </Reveal>
            <Reveal className="md:col-span-6 md:justify-self-end md:self-end" delay={0.35}>
              <OkkoButton href={`/contact?projet=${service?.serviceType ?? ''}`} variant={dark ? 'light' : 'primary'} size="lg">
                {service?.cta}
              </OkkoButton>
            </Reveal>
          </div>
        </div>
        <div className="okko-container mt-20 md:mt-28">
          <ImageReveal src={service?.image ?? ''} alt={service?.imageAlt ?? ''} className="aspect-[16/8] w-full rounded-[10px]" parallax={6} priority />
        </div>
      </section>

      {/* Problème */}
      <section className="bg-white py-32 md:py-44">
        <div className="okko-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow text-muted-foreground">Le constat</p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <TextReveal as="h2" text={service?.problem?.title ?? ''} className="display-md text-balance" />
            <Reveal className="mt-10" delay={0.2}>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{service?.problem?.text}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visuel */}
      <section className={`${service?.slug === 'automatisation' ? 'theme-dark bg-[#111111] text-white' : 'bg-[#F7F7F5]'} py-32 md:py-44`}>
        <div className="okko-container">
          <Reveal>
            <p className={`eyebrow ${service?.slug === 'automatisation' ? 'text-white/60' : 'text-muted-foreground'}`}>En pratique</p>
          </Reveal>
          <div className="mt-16 md:mt-24">
            <Visual service={service} />
          </div>
        </div>
      </section>

      {/* Ce que nous faisons */}
      <section className="bg-white py-32 md:py-44" aria-labelledby="offers-title">
        <div className="okko-container">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="eyebrow text-muted-foreground">Ce que nous faisons</p>
              </Reveal>
              <h2 id="offers-title" className="display-md mt-8">
                <TextReveal as="span" text="Concrètement" className="block" />
                <span className="serif-accent font-normal">.</span>
              </h2>
            </div>
            <ol className="md:col-span-8">
              {(service?.offers ?? []).map((o, i) => (
                <Reveal key={o.title} delay={i * 0.08}>
                  <li className="grid gap-4 border-t border-[#E7E7E4] py-10 md:grid-cols-12">
                    <span className="font-mono text-sm text-muted-foreground md:col-span-2">0{i + 1}</span>
                    <h3 className="text-2xl font-medium tracking-tight md:col-span-4">{o.title}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground md:col-span-6">{o.text}</p>
                  </li>
                </Reveal>
              ))}
              <LineReveal />
            </ol>
          </div>
        </div>
      </section>

      {/* Pour qui + livrables */}
      <section className="bg-[#F7F7F5] py-32 md:py-44">
        <div className="okko-container grid gap-16 md:grid-cols-2 md:gap-8">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Pour qui</p>
            <ul className="mt-8 space-y-4">
              {(service?.forWho ?? []).map((f) => (
                <li key={f} className="flex items-start gap-4 text-xl tracking-tight">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow text-muted-foreground">Ce que vous recevez</p>
            <ul className="mt-8 space-y-4">
              {(service?.deliverables ?? []).map((d) => (
                <li key={d} className="flex items-start gap-4 text-xl tracking-tight">
                  <Check className="mt-1.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Méthode condensée */}
      <section className="bg-white py-32 md:py-44">
        <div className="okko-container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="eyebrow text-muted-foreground">Comment ça se passe</p>
              </Reveal>
              <h2 className="display-md mt-8">
                Quatre étapes<span className="serif-accent font-normal">, toujours les mêmes.</span>
              </h2>
            </div>
          </div>
          <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
            {METHOD_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <li className="border-t border-[#E7E7E4] pt-6">
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="theme-dark grain relative bg-[#111111] py-32 text-white md:py-48">
        <div className="okko-container relative grid gap-12 md:grid-cols-12">
          <h2 className="display-lg md:col-span-8">
            <TextReveal as="span" text="Voyons ce que nous pouvons" className="block" />
            <TextReveal as="span" text="faire ensemble." className="serif-accent block font-normal" delay={0.15} />
          </h2>
          <Reveal className="md:col-span-4 md:self-end" delay={0.25}>
            <OkkoButton href={`/contact?projet=${service?.serviceType ?? ''}`} variant="light" size="lg">
              {service?.cta}
            </OkkoButton>
          </Reveal>
        </div>
      </section>

      {/* Autres expertises */}
      <section className="bg-[#F7F7F5] py-24 md:py-32">
        <div className="okko-container">
          <p className="eyebrow text-muted-foreground">Nos autres expertises</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[8px] bg-[#E7E7E4] md:grid-cols-3">
            {(others ?? []).map((o) => (
              <li key={o.slug} className="bg-white">
                <Link href={`/services/${o.slug}`} className="group flex h-full flex-col justify-between gap-10 p-8 transition-colors duration-500 hover:bg-[#F7F7F5]">
                  <span className="font-mono text-xs text-muted-foreground">{o.number}</span>
                  <span className="flex items-end justify-between gap-4">
                    <span className="text-2xl font-medium tracking-tight">{o.name}</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-okko group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
