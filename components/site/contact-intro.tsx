'use client';

import { TextReveal, Reveal } from '@/components/site/motion';
import { SITE } from '@/lib/constants';

export function ContactIntro() {
  return (
    <div className="md:sticky md:top-32">
      <Reveal>
        <p className="eyebrow text-muted-foreground">Contact</p>
      </Reveal>
      <h1 className="display-lg mt-10 text-balance">
        <TextReveal as="span" text="Parlons de" className="block" />
        <TextReveal as="span" text="votre projet." className="serif-accent block font-normal" delay={0.15} />
      </h1>
      <Reveal className="mt-10" delay={0.25}>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">Quelques questions, deux minutes, et nous revenons vers vous sous 48 heures ouvrées avec un premier avis. Sans engagement.</p>
      </Reveal>
      <Reveal className="mt-14 space-y-6 border-t border-[#E7E7E4] pt-10" delay={0.35}>
        <div>
          <p className="font-mono text-xs text-muted-foreground">Email</p>
          <a href={`mailto:${SITE.email}`} className="link-underline mt-2 inline-block text-lg" suppressHydrationWarning>
            {SITE.email}
          </a>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">Où</p>
          <p className="mt-2 text-lg">{SITE.city}</p>
          <p className="text-sm text-muted-foreground">Interventions en Haute-Savoie et à distance partout en France.</p>
        </div>
      </Reveal>
    </div>
  );
}
