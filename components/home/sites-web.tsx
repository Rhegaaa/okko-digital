'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal } from '@/components/site/motion';
import { IMAGES } from '@/lib/constants';

export function SiteMockupContent({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col bg-[#F7F7F5] text-[#111111]" aria-hidden>
      <div className="flex items-center justify-between border-b border-[#E7E7E4] bg-white px-[5%] py-[3%]">
        <span className="text-[0.55em] font-semibold tracking-[0.2em]">MAISON</span>
        <span className="hidden gap-[1.2em] text-[0.42em] text-[#666666] sm:flex">
          <span>Carte</span>
          <span>Boutique</span>
          <span>Contact</span>
        </span>
        <span className="rounded-full bg-[#111111] px-[1em] py-[0.35em] text-[0.42em] text-white">Commander</span>
      </div>
      <div className={`grid flex-1 ${compact ? 'grid-rows-[1fr_auto]' : 'grid-cols-2'}`}>
        <div className="flex flex-col justify-center px-[6%] py-[6%]">
          <p className="text-[0.42em] uppercase tracking-[0.2em] text-[#666666]">Depuis 1987</p>
          <p className="mt-[0.5em] text-[1.1em] font-medium leading-[1.05] tracking-tight">
Le goût du travail bien fait.</p>
          <div className="mt-[1em] flex gap-[0.6em]">
            <span className="rounded-full bg-[#111111] px-[1em] py-[0.4em] text-[0.42em] text-white">Voir la carte</span>
            <span className="rounded-full border border-[#111111]/30 px-[1em] py-[0.4em] text-[0.42em]">Nous trouver</span>
          </div>
        </div>
        <div className="relative min-h-[40%] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.florist} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

export function SitesWeb() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // desktop -> tablette -> mobile
  const widthPct = useTransform(scrollYProgress, [0.15, 0.45, 0.6, 0.9], [100, 100, 62, 34]);
  const width = useMotionTemplate`${widthPct}%`;
  const ratio = useTransform(scrollYProgress, [0.15, 0.45, 0.6, 0.9], [16 / 10, 16 / 10, 4 / 3, 9 / 17]);
  const radius = useTransform(scrollYProgress, [0.45, 0.9], [12, 36]);
  const fontSize = useTransform(scrollYProgress, [0.15, 0.9], [22, 12]);
  const labelDesktop = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);
  const labelTablet = useTransform(scrollYProgress, [0.45, 0.55, 0.6, 0.7], [0, 1, 1, 0]);
  const labelMobile = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

  return (
    <section ref={ref} className="relative h-[280svh] bg-white" aria-labelledby="sites-title">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="okko-container flex flex-1 flex-col pt-24 md:pt-28">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-muted-foreground">02 — Sites web</p>
            <div className="relative hidden h-4 w-32 font-mono text-xs text-muted-foreground md:block">
              <motion.span style={{ opacity: reduce ? 1 : labelDesktop }} className="absolute right-0">Ordinateur</motion.span>
              <motion.span style={{ opacity: reduce ? 0 : labelTablet }} className="absolute right-0">Tablette</motion.span>
              <motion.span style={{ opacity: reduce ? 0 : labelMobile }} className="absolute right-0">Mobile</motion.span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
            <h2 id="sites-title" className="display-md text-balance md:col-span-7">
              <TextReveal as="span" text="Un site qui rassure avant même" className="block" />
              <TextReveal as="span" text="le premier appel." className="serif-accent block font-normal" delay={0.2} />
            </h2>
            <Reveal className="md:col-span-5 md:justify-self-end" delay={0.2}>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Clair, rapide, beau sur chaque écran. Un site pensé pour vos clients, pas pour impressionner d&apos;autres agences.</p>
              <div className="mt-6">
                <OkkoButton href="/services/sites-web" variant="link">
                  Voir les sites web
                </OkkoButton>
              </div>
            </Reveal>
          </div>

          <div className="relative flex flex-1 items-end justify-center pb-6 pt-10 md:pb-10">
            <motion.div
              style={reduce ? { width: '100%', aspectRatio: 16 / 10, borderRadius: 12, fontSize: 22 } : { width, aspectRatio: ratio, borderRadius: radius, fontSize }}
              className="relative max-h-full overflow-hidden border border-border bg-white shadow-[0_40px_120px_-40px_rgba(17,17,17,0.35)]"
            >
              <div className="flex h-[1.4em] items-center gap-[0.35em] border-b border-border bg-[#F7F7F5] px-[0.8em]">
                <span className="h-[0.35em] w-[0.35em] rounded-full bg-[#E7E7E4]" />
                <span className="h-[0.35em] w-[0.35em] rounded-full bg-[#E7E7E4]" />
                <span className="h-[0.35em] w-[0.35em] rounded-full bg-[#E7E7E4]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 top-[1.4em]">
                <SiteMockupContent />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
