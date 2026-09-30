'use client';

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, className, delay = 0, y = 28, once = true, amount = 0.2 }: { children: ReactNode; className?: string; delay?: number; y?: number; once?: boolean; amount?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Révèle un texte mot par mot (masque + translation). */
export function TextReveal({ text, as: Tag = 'h2', className, delay = 0, stagger = 0.045, once = true }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; once?: boolean }) {
  const reduce = useReducedMotion();
  const words = String(text ?? '').split(' ');
  const MotionTag = motion.create(Tag as ElementType);
  return (
    <MotionTag
      className={cn(className)}
      initial={reduce ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount: 0.4 }}
      aria-label={text}
    >
      {words?.map?.((w: string, i: number) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]" aria-hidden>
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: '110%', opacity: 0 }, visible: { y: '0%', opacity: 1 } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      )) ?? null}
    </MotionTag>
  );
}

/** Ligne horizontale qui se dessine. */
export function LineReveal({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn('h-px w-full origin-left bg-current', className)}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

/** Image qui se révèle par masque et léger dézoom. */
export function ImageReveal({ src, alt, className, imgClassName, priority, parallax = 0 }: { src: string; alt: string; className?: string; imgClassName?: string; priority?: boolean; parallax?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-parallax}%`, `${parallax}%`]);
  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden bg-muted', className)}
      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: reduce ? 0 : y, scale: parallax ? 1 + parallax / 40 : 1 }}
        initial={reduce ? false : { scale: 1.18 }}
        whileInView={{ scale: parallax ? 1 + parallax / 40 : 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className={cn('h-full w-full object-cover', imgClassName)} />
      </motion.div>
    </motion.div>
  );
}

/** Parallax douce liée au scroll. */
export function Parallax({ children, className, amount = 8 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}

/** Paragraphe dont les mots s'éclaircissent progressivement au scroll. */
export function ScrollWords({ text, className, accent }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = String(text ?? '').split(' ');
  return (
    <p ref={ref} className={cn('flex flex-wrap', className)}>
      {words?.map?.((w: string, i: number) => {
        const start = i / Math.max(words.length, 1);
        const end = start + 1 / Math.max(words.length, 1);
        const isAccent = accent?.some?.((a) => w.replace(/[.,]/g, '') === a);
        return (
          <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]} accent={isAccent}>
            {w}
          </Word>
        );
      }) ?? null}
    </p>
  );
}

function Word({ children, progress, range, accent }: { children: ReactNode; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className="relative mr-[0.28em] mt-[0.1em]">
      <motion.span style={{ opacity }} className={cn('inline-block', accent && 'serif-accent')}>
        {children}
      </motion.span>
    </span>
  );
}

export { EASE };
