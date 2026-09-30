'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Inbox, ListChecks, Send, BellRing } from 'lucide-react';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal } from '@/components/site/motion';

const STEPS = [
  { icon: Inbox, title: 'Une demande arrive', text: 'Formulaire, email, message, appel manqué. Peu importe le canal.' },
  { icon: ListChecks, title: 'Elle est traitée', text: 'Qualifiée, enregistrée au bon endroit, sans ressaisie.' },
  { icon: Send, title: "L'action est effectuée", text: 'Accusé de réception, proposition de rendez-vous, relance planifiée.' },
  { icon: BellRing, title: 'Votre équipe est informée', text: 'Une notification claire. Vous décidez, le reste est déjà fait.' },
];

export function FlowVisual({ progress }: { progress?: ReturnType<typeof useTransform<number, number>> }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <svg className="absolute left-0 top-7 hidden h-px w-full md:block" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden>
        <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="currentColor" strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
        <motion.line x1="0" y1="0.5" x2="100" y2="0.5" stroke="currentColor" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce || !progress ? 1 : progress }} pathLength={1} strokeDasharray="1 1" />
      </svg>
      <div className="absolute left-7 top-0 h-full w-px bg-current opacity-15 md:hidden" aria-hidden />
      <ol className="relative grid gap-12 md:grid-cols-4 md:gap-8">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.18 }}
            className="flex gap-6 md:block"
          >
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-current/20 bg-[#111111] text-white">
              <s.icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div className="md:mt-8">
              <p className="font-mono text-xs text-current/50">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-current/60">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Automatisation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const line = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);

  return (
    <section ref={ref} className="theme-dark grain relative bg-[#111111] py-32 text-white md:py-48" aria-labelledby="auto-title">
      <div className="okko-container relative">
        <div className="flex items-start justify-between">
          <p className="eyebrow text-white/60">03 — Automatisation & IA</p>
          <p className="hidden font-mono text-xs text-white/40 md:block">Sans robot. Avec des résultats.</p>
        </div>
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <h2 id="auto-title" className="display-lg text-balance md:col-span-8">
            <TextReveal as="span" text="Ce qui se passe quand une" className="block" />
            <TextReveal as="span" text="demande arrive." className="serif-accent block font-normal" delay={0.2} />
          </h2>
          <Reveal className="md:col-span-4 md:self-end" delay={0.2}>
            <p className="max-w-sm text-base leading-relaxed text-white/65">Les tâches répétitives disparaissent. Les demandes ne se perdent plus. Vous gardez la main, sans y passer vos soirées.</p>
          </Reveal>
        </div>

        <div className="mt-24 md:mt-36">
          <FlowVisual progress={line} />
        </div>

        <Reveal className="mt-24 flex flex-wrap items-center justify-between gap-8 border-t border-white/10 pt-10 md:mt-32">
          <p className="max-w-md text-base text-white/65">Emails, relances, notifications, synchronisation entre vos outils, réponses assistées par IA quand c&apos;est pertinent.</p>
          <OkkoButton href="/services/automatisation" variant="light">
            Étudier mon automatisation
          </OkkoButton>
        </Reveal>
      </div>
    </section>
  );
}
