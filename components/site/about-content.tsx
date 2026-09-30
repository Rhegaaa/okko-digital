'use client';

import { TextReveal, Reveal, ImageReveal, ScrollWords, LineReveal } from '@/components/site/motion';
import { CtaFinal } from '@/components/home/cta-final';
import { IMAGES } from '@/lib/constants';

const VALUES = [
  { title: 'Clarté', text: 'Pas de jargon, pas de promesses floues. Vous comprenez ce que nous faisons, pourquoi, et combien de temps ça prend.' },
  { title: 'Utilité', text: 'Chaque outil doit servir votre activité au quotidien. Sinon, nous ne le proposons pas.' },
  { title: 'Proximité', text: 'Basés en Haute-Savoie, nous connaissons les réalités des petites entreprises locales. Et nous répondons vite.' },
  { title: 'Durée', text: 'Nous ne livrons pas pour disparaître. Nous restons à vos côtés pour faire évoluer ce qui a été mis en place.' },
];

export function AboutContent() {
  return (
    <>
      <section className="bg-[#F7F7F5] pb-24 pt-40 md:pb-32 md:pt-52" aria-labelledby="about-title">
        <div className="okko-container">
          <Reveal>
            <p className="eyebrow text-muted-foreground">À propos</p>
          </Reveal>
          <h1 id="about-title" className="display-xl mt-10 max-w-5xl text-balance">
            <TextReveal as="span" text="Une agence à taille" className="block" />
            <TextReveal as="span" text="humaine, en Haute-Savoie." className="serif-accent block font-normal" delay={0.15} />
          </h1>
        </div>
        <div className="okko-container mt-20 md:mt-28">
          <ImageReveal src={IMAGES.teamMeeting} alt="Échange de travail autour d’une table" className="aspect-[16/8] w-full rounded-[10px]" parallax={6} priority />
        </div>
      </section>

      <section className="bg-white py-32 md:py-48">
        <div className="okko-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="eyebrow text-muted-foreground">Notre conviction</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <ScrollWords
              className="display-md"
              text="OKKO Digital est née d’un constat simple : les petites entreprises méritent les mêmes outils que les grandes, sans la complexité ni les coûts qui vont avec. Nous concevons des solutions sobres, fiables et utiles, pensées pour des gens qui ont autre chose à faire que de s’occuper d’informatique."
              accent={['simple', 'sobres', 'utiles']}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F5] py-32 md:py-48">
        <div className="okko-container grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow text-muted-foreground">Qui est derrière OKKO</p>
            </Reveal>
            <h2 className="display-md mt-8">
              Lorenzo<span className="serif-accent font-normal">, fondateur.</span>
            </h2>
            <Reveal className="mt-10 space-y-6" delay={0.15}>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">Indépendant basé à Savigny, en Haute-Savoie, Lorenzo accompagne des commerçants, restaurateurs et artisans sur leur présence en ligne, leurs sites et leurs outils du quotidien.</p>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">Un interlocuteur unique, du premier échange à la mise en place, puis dans la durée. Pas de service commercial, pas d’intermédiaire : la personne que vous rencontrez est celle qui réalise.</p>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ImageReveal src={IMAGES.artisanHands} alt="Mains d’un artisan au travail" className="aspect-[4/5] w-full rounded-[10px]" parallax={5} />
          </div>
        </div>
      </section>

      <section className="bg-white py-32 md:py-48" aria-labelledby="values-title">
        <div className="okko-container">
          <Reveal>
            <p id="values-title" className="eyebrow text-muted-foreground">Ce qui nous guide</p>
          </Reveal>
          <ul className="mt-16">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <li className="grid gap-4 border-t border-[#E7E7E4] py-10 md:grid-cols-12 md:py-14">
                  <span className="font-mono text-sm text-muted-foreground md:col-span-2">0{i + 1}</span>
                  <h3 className="display-sm md:col-span-4">{v.title}</h3>
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground md:col-span-6">{v.text}</p>
                </li>
              </Reveal>
            ))}
            <LineReveal />
          </ul>
        </div>
      </section>
      <CtaFinal title="Envie d’en parler." text="Un café, un appel ou un email : le premier échange est toujours sans engagement." />
    </>
  );
}
