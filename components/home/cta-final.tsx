'use client';

import { OkkoButton } from '@/components/site/okko-button';
import { TextReveal, Reveal } from '@/components/site/motion';
import { SITE } from '@/lib/constants';

export function CtaFinal({ title = 'Parlons de votre projet.', text = 'Un premier échange, sans engagement, pour comprendre votre activité et voir ce que nous pouvons faire ensemble. Réponse sous 48 heures ouvrées.' }: { title?: string; text?: string }) {
  const words = title.replace(/\.$/, '');
  return (
    <section className="theme-dark grain relative bg-[#111111] py-36 text-white md:py-56" aria-labelledby="cta-title">
      <div className="okko-container relative">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 id="cta-title" className="display-xl md:col-span-8">
            <TextReveal as="span" text={words} className="block" />
            <span className="serif-accent font-normal">.</span>
          </h2>
          <Reveal className="md:col-span-4 md:self-end" delay={0.25}>
            <p className="max-w-sm text-base leading-relaxed text-white/65">{text}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <OkkoButton href="/contact" variant="light" size="lg">
                Parler de mon projet
              </OkkoButton>
            </div>
            <p className="mt-8 text-sm text-white/45">
              Ou par email :{' '}
              <a href={`mailto:${SITE.email}`} className="link-underline text-white/80" suppressHydrationWarning>
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
