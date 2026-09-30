'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, EASE } from '@/components/site/motion';
import { IMAGES } from '@/lib/constants';

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.94, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section ref={ref} className="relative" aria-labelledby="hero-title">
      <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="okko-container flex min-h-[92svh] flex-col justify-end pb-12 pt-36 md:min-h-screen md:pb-20 md:pt-44">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="eyebrow mb-10 text-muted-foreground md:mb-16">
          Agence digitale indépendante — France
        </motion.p>

        <h1 id="hero-title" className="display-xl max-w-[16ch] text-balance">
          <TextReveal as="span" text="Le digital au service de" className="block" delay={0.1} />
          <TextReveal as="span" text="votre entreprise." className="serif-accent block font-normal" delay={0.45} />
        </h1>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.9 }} className="lead max-w-md text-muted-foreground md:col-span-6">
            Présence locale, site web, automatisation, outils sur mesure. Nous construisons des solutions simples et solides pour les entreprises qui n&apos;ont pas de temps à perdre.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.05 }} className="flex flex-wrap items-center gap-6 md:col-span-6 md:justify-end">
            <OkkoButton href="/contact" size="lg">
              Parler de mon projet
            </OkkoButton>
            <OkkoButton href="/services" variant="link">
              Découvrir nos services
            </OkkoButton>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-3 md:px-6">
        <motion.div
          style={reduce ? undefined : { scale, borderRadius: radius }}
          className="relative mx-auto h-[70svh] w-full max-w-[1400px] origin-center overflow-hidden bg-muted md:h-[92svh]"
          initial={reduce ? false : { clipPath: 'inset(8% 4% 8% 4% round 24px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
          transition={{ duration: 1.8, ease: EASE, delay: 1.2 }}
        >
          <motion.div style={reduce ? undefined : { y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.heroRestaurant} alt="Salle lumineuse d'un restaurant indépendant, tables en bois et grandes fenêtres" className="h-full w-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white md:p-10">
            <p className="eyebrow text-white/80">Pour les restaurants, artisans, commerces et indépendants</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
