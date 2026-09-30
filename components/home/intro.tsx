'use client';

import { ScrollWords, Reveal } from '@/components/site/motion';

export function Intro() {
  return (
    <section className="okko-container py-32 md:py-56" aria-labelledby="intro-title">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <Reveal>
            <p id="intro-title" className="eyebrow text-muted-foreground">Pourquoi OKKO existe</p>
          </Reveal>
        </div>
        <div className="md:col-span-9">
          <ScrollWords
            className="display-md"
            text="Les petites entreprises n'ont pas besoin de plus de technologie. Elles ont besoin d'outils qui fonctionnent, simplement, tous les jours. Une fiche Google à jour. Un site qui rassure. Des tâches qui se font seules. Un logiciel pensé pour leur métier, pas pour un autre."
            accent={['simplement', 'rassure', 'seules', 'métier']}
          />
          <Reveal className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-24" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              OKKO Digital est une agence indépendante basée en Haute-Savoie. Nous travaillons avec des restaurants, des artisans, des commerces et des indépendants qui veulent des résultats concrets, sans jargon.
            </p>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Quatre expertises, une seule exigence : que chaque outil serve réellement votre activité. Nous concevons, mettons en place, puis restons à vos côtés.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
