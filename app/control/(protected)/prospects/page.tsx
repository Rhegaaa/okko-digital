import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { ProspectsKanban } from '@/components/admin/prospects-kanban';

export const dynamic = 'force-dynamic';

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const prospects = await prisma.prospect.findMany({ orderBy: [{ position: 'asc' }, { createdAt: 'desc' }] });
  return <ProspectsKanban prospects={toPlain(prospects)} focus={focus ?? null} />;
}
