'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, Phone, Globe, Star, Navigation } from 'lucide-react';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal } from '@/components/site/motion';
import { IMAGES } from '@/lib/constants';

export function PhoneGoogleMockup({ className }: { className?: string }) {
  return (
    <div className={`relative aspect-[9/19] w-full rounded-[2.6rem] border border-white/20 bg-[#111111] p-2.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] ${className ?? ''}`} aria-hidden>
      <div className="absolute left-1/2 top-4 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.1rem] bg-white text-[#111111]">
        <div className="relative h-[38%] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.boulangerie} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 px-5 pt-5">
          <p className="text-[1.05rem] font-semibold leading-tight">Votre établissement</p>
          <div className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-[#666666]">
            <span className="flex text-[#111111]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" strokeWidth={0} />
              ))}
            </span>
            <span>Avis clients</span>
          </div>
          <p className="mt-1 text-[0.7rem] text-[#666666]">Commerce local · Ouvert</p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-[0.6rem] text-[#111111]">
            {[
              { icon: Navigation, label: 'Itinéraire' },
              { icon: Phone, label: 'Appeler' },
              { icon: Globe, label: 'Site' },
              { icon: MapPin, label: 'Enregistrer' },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E7E4]">
                  <a.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                {a.label}
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-[#F0F0ED]" />
            <div className="h-2 w-1/2 rounded-full bg-[#F0F0ED]" />
            <div className="h-2 w-2/3 rounded-full bg-[#F0F0ED]" />
          </div>
          <div className="mt-5 rounded-xl border border-[#E7E7E4] p-3">
            <p className="text-[0.65rem] font-medium">Dernière publication</p>
            <div className="mt-2 h-2 w-full rounded-full bg-[#F0F0ED]" />
            <div className="mt-1.5 h-2 w-4/5 rounded-full bg-[#F0F0ED]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PresenceLocale() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const phoneY = useTransform(scrollYProgress, [0.1, 0.55], ['45%', '0%']);
  const phoneRotate = useTransform(scrollYProgress, [0.1, 0.55], [6, 0]);
  const overlay = useTransform(scrollYProgress, [0, 0.5], [0.25, 0.55]);

  return (
    <section ref={ref} className="relative h-[190svh] md:h-[220svh]" aria-labelledby="presence-title">
      <div className="sticky top-0 h-svh overflow-hidden text-white">
        <motion.div style={reduce ? undefined : { scale: bgScale }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.storefront} alt="Devanture d'un commerce indépendant dans une rue française" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </motion.div>
        <motion.div style={{ opacity: reduce ? 0.5 : overlay }} className="absolute inset-0 bg-[#111111]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-[#111111]/70" />

        <div className="okko-container relative flex h-full flex-col justify-between py-28 md:py-32">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-white/70">01 — Présence locale</p>
            <p className="hidden font-mono text-xs text-white/50 md:block">Google Business · Avis · NFC / QR</p>
          </div>

          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 id="presence-title" className="display-lg text-balance">
                <TextReveal as="span" text="Être trouvé par ceux qui" className="block" />
                <TextReveal as="span" text="vous cherchent déjà." className="serif-accent block font-normal" delay={0.25} />
              </h2>
              <Reveal delay={0.3} className="mt-8 max-w-md">
                <p className="lead text-white/75">La plupart de vos futurs clients passent par Google avant de pousser votre porte. Nous faisons de votre fiche un véritable point d&apos;entrée : complète, vivante, rassurante.</p>
                <div className="mt-10">
                  <OkkoButton href="/services/presence-locale" variant="light">
                    Découvrir la présence locale
                  </OkkoButton>
                </div>
              </Reveal>
            </div>
            <div className="hidden md:col-span-5 md:flex md:justify-end">
              <motion.div style={reduce ? undefined : { y: phoneY, rotate: phoneRotate }} className="w-[260px] lg:w-[300px]">
                <PhoneGoogleMockup />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
