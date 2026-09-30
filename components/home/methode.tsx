'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TextReveal, Reveal } from '@/components/site/motion';

export const METHOD_STEPS = [
  {
    n: '01',
    title: 'Comprendre',
    text: 'Un échange, sans engagement, pour comprendre votre activité, vos contraintes et ce qui vous ferait vraiment gagner du temps. Nous ne proposons rien avant d\'avoir écouté.',
  },
  {
    n: '02',
    title: 'Concevoir',
    text: 'Nous dessinons une solution à votre mesure : ce qu\'elle fait, ce qu\'elle ne fait pas, combien de temps ça prend. Vous validez avant que nous commencions.',
  },
  {
    n: '03',
    title: 'Mettre en place',
    text: 'Nous réalisons, testons et déployons. Vous êtes tenu informé à chaque étape, en langage clair, sans jargon technique.',
  },
  {
    n: '04',
    title: 'Accompagner',
    text: 'Rien ne s\'arrête à la livraison. Nous restons disponibles pour faire évoluer, corriger et vous conseiller au fil du temps.',
  },
];

function Step({ step, index, total }: { step: (typeof METHOD_STEPS)[number]; index: number; total: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] });
  const opacity = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.55, 1]);
  const x = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, 0]);

  return (
    <motion.li ref={ref} style={{ opacity }} className="grid gap-6 border-t border-[#E7E7E4] py-12 md:grid-cols-12 md:gap-8 md:py-16">
      <div className="md:col-span-2">
        <span className="font-mono text-sm text-muted-foreground">
          {step.n} <span className="opacity-70">/ 0{total}</span>
        </span>
      </div>
      <div className="md:col-span-5">
        <motion.h3 style={{ x }} className="display-sm">
          {step.title}
          {index === total - 1 ? <span className="serif-accent font-normal">.</span> : null}
        </motion.h3>
      </div>
      <div className="md:col-span-5">
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">{step.text}</p>
      </div>
    </motion.li>
  );
}

export function Methode() {
  return (
    <section className="bg-[#F7F7F5] py-32 md:py-48" aria-labelledby="methode-title">
      <div className="okko-container">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow text-muted-foreground">Notre méthode</p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <h2 id="methode-title" className="display-lg text-balance">
              <TextReveal as="span" text="Une façon de travailler" className="block" />
              <TextReveal as="span" text="simple et lisible." className="serif-accent block font-normal" delay={0.15} />
            </h2>
            <Reveal className="mt-8" delay={0.2}>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">Quatre étapes, toujours les mêmes, quel que soit le projet. Vous savez où vous en êtes, à tout moment.</p>
            </Reveal>
          </div>
        </div>
        <ol className="mt-24 border-b border-[#E7E7E4] md:mt-32">
          {METHOD_STEPS.map((s, i) => (
            <Step key={s.n} step={s} index={i} total={METHOD_STEPS.length} />
          ))}
        </ol>
      </div>
    </section>
  );
}
