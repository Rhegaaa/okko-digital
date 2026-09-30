'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Users, FileText, BarChart3, Check } from 'lucide-react';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal, LineReveal } from '@/components/site/motion';

const ROWS = [
  { name: 'Devis n° 2026-041', meta: 'Atelier Bois & Cie', state: 'Accepté' },
  { name: 'Intervention du 14/10', meta: 'Chantier Rue des Alpes', state: 'Planifiée' },
  { name: 'Facture n° 2026-117', meta: 'Boulangerie du Centre', state: 'Payée' },
  { name: 'Relance contrat annuel', meta: 'Garage Martin', state: 'À faire' },
];

export function BusinessDashboardMockup({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden rounded-[10px] border border-[#E7E7E4] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] ${className}`} aria-hidden>
      <div className="flex">
        <aside className="hidden w-40 shrink-0 border-r border-[#E7E7E4] bg-[#F7F7F5] p-4 sm:block">
          <div className="h-2.5 w-14 rounded-sm bg-[#111111]" />
          <ul className="mt-6 space-y-3 text-[11px] text-[#666666]">
            {[
              { icon: BarChart3, label: 'Tableau de bord' },
              { icon: Users, label: 'Clients' },
              { icon: CalendarDays, label: 'Planning' },
              { icon: FileText, label: 'Devis & factures' },
            ].map((it, i) => (
              <li key={it.label} className={`flex items-center gap-2 rounded-[4px] px-2 py-1.5 ${i === 0 ? 'bg-white text-[#111111] shadow-sm' : ''}`}>
                <it.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {it.label}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#666666]">Aujourd&apos;hui</p>
              <p className="mt-1 text-sm font-medium text-[#111111]">Bonjour, voici votre journée.</p>
            </div>
            <div className="h-7 w-7 rounded-full bg-[#111111]" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { l: 'Interventions', v: '6' },
              { l: 'Devis en attente', v: '3' },
              { l: 'À encaisser', v: '2' },
            ].map((k, i) => (
              <motion.div
                key={k.l}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="rounded-[6px] bg-[#F7F7F5] p-3"
              >
                <p className="text-[10px] text-[#666666]">{k.l}</p>
                <p className="mt-1 text-xl font-medium tracking-tight text-[#111111]">{k.v}</p>
              </motion.div>
            ))}
          </div>
          <ul className="mt-5 divide-y divide-[#E7E7E4] rounded-[6px] border border-[#E7E7E4]">
            {ROWS.map((r, i) => (
              <motion.li
                key={r.name}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                className="flex items-center justify-between px-3 py-2.5 text-[11px]"
              >
                <div>
                  <p className="font-medium text-[#111111]">{r.name}</p>
                  <p className="text-[#666666]">{r.meta}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E7E4] px-2 py-0.5 text-[10px] text-[#111111]">
                  {r.state === 'Payée' || r.state === 'Accepté' ? <Check className="h-3 w-3" /> : null}
                  {r.state}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const POINTS = ['Un outil conçu autour de votre façon de travailler', 'Vos données, chez vous, accessibles partout', 'Des écrans simples, que votre équipe adopte vite', 'Évolutif au rythme de votre activité'];

export function SolutionsMetier() {
  return (
    <section className="bg-white py-32 md:py-48" aria-labelledby="metier-title">
      <div className="okko-container">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow text-muted-foreground">04 — Solutions métier</p>
            </Reveal>
            <h2 id="metier-title" className="display-lg mt-8 text-balance">
              <TextReveal as="span" text="L'outil s'adapte à" className="block" />
              <TextReveal as="span" text="votre entreprise," className="block" delay={0.15} />
              <TextReveal as="span" text="pas l'inverse." className="serif-accent block font-normal" delay={0.3} />
            </h2>
            <Reveal className="mt-10" delay={0.2}>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">Quand les logiciels du marché vous imposent leur logique, nous concevons le vôtre : gestion des clients, planning, devis, suivi d&apos;activité. Rien de superflu, tout ce qui compte.</p>
            </Reveal>
            <ul className="mt-12 space-y-0">
              {POINTS.map((p, i) => (
                <Reveal key={p} delay={0.1 + i * 0.08}>
                  <li className="flex items-start gap-4 py-4">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    <span className="text-base">{p}</span>
                  </li>
                  <LineReveal />
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-12" delay={0.3}>
              <OkkoButton href="/services/solutions-metier" variant="secondary">
                Parler de mon besoin
              </OkkoButton>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:pl-8">
            <Reveal delay={0.15} y={40}>
              <div className="relative rounded-[10px] bg-[#F7F7F5] p-4 sm:p-10">
                <BusinessDashboardMockup />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
