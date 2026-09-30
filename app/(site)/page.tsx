import { prisma } from '@/lib/db';
import { pageMeta } from '@/lib/seo';
import { Hero } from '@/components/home/hero';
import { Intro } from '@/components/home/intro';
import { PresenceLocale } from '@/components/home/presence-locale';
import { SitesWeb } from '@/components/home/sites-web';
import { Automatisation } from '@/components/home/automatisation';
import { SolutionsMetier } from '@/components/home/solutions-metier';
import { Methode } from '@/components/home/methode';
import { RealisationsPreview, type ShowcaseItem } from '@/components/home/realisations-preview';
import { CtaFinal } from '@/components/home/cta-final';

export const dynamic = 'force-dynamic';

export const metadata = pageMeta({
  path: '/',
  title: 'OKKO Digital — Agence digitale en Haute-Savoie pour TPE et artisans',
  description: 'Agence digitale indépendante en Haute-Savoie : fiche Google et présence locale, création de sites web, automatisation & IA, logiciels métier pour TPE, artisans et commerçants.',
});

async function getShowcase(): Promise<ShowcaseItem[]> {
  try {
    const rows = await prisma.showcase.findMany({
      where: { published: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      take: 4,
      select: { id: true, title: true, clientName: true, service: true, summary: true, imageUrl: true, url: true },
    });
    return (rows ?? []).map((r: any) => ({ ...r, service: String(r?.service ?? 'AUTRE') }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const showcase = await getShowcase();
  return (
    <>
      <Hero />
      <Intro />
      <PresenceLocale />
      <SitesWeb />
      <Automatisation />
      <SolutionsMetier />
      <Methode />
      {showcase.length > 0 ? <RealisationsPreview items={showcase} /> : null}
      <CtaFinal />
    </>
  );
}
