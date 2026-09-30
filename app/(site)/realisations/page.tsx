import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { pageMeta } from '@/lib/seo';
import { RealisationsGrid, type ShowcaseFull } from '@/components/site/realisations-grid';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let count = 0;
  try {
    count = await prisma.showcase.count({ where: { published: true } });
  } catch {}
  return pageMeta({
    path: '/realisations',
    title: 'Réalisations — OKKO Digital',
    description: 'Projets conçus par OKKO Digital pour des restaurants, artisans, commerces et indépendants.',
    noindex: count === 0,
  });
}

export default async function RealisationsPage() {
  let items: ShowcaseFull[] = [];
  try {
    const rows = await prisma.showcase.findMany({ where: { published: true }, orderBy: [{ position: 'asc' }, { createdAt: 'desc' }] });
    items = (rows ?? []).map((r: any) => ({
      id: String(r?.id ?? ''),
      title: String(r?.title ?? ''),
      clientName: r?.clientName ?? null,
      service: String(r?.service ?? 'AUTRE'),
      summary: r?.summary ?? null,
      description: r?.description ?? null,
      imageUrl: r?.imageUrl ?? null,
      url: r?.url ?? null,
      year: r?.year ?? null,
    }));
  } catch {
    items = [];
  }
  return <RealisationsGrid items={items} />;
}
