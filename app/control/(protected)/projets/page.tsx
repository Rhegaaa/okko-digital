import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { ProjectsView } from '@/components/admin/projects-view';

export const dynamic = 'force-dynamic';

export default async function ProjetsPage() {
  const [projects, clients] = await Promise.all([
    prisma.project.findMany({ include: { client: { select: { id: true, company: true } }, _count: { select: { tasks: { where: { status: { not: 'TERMINE' } } } } } }, orderBy: [{ status: 'asc' }, { dueDate: 'asc' }] }),
    prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: 'asc' } }),
  ]);
  return <ProjectsView projects={toPlain(projects)} clients={(clients ?? []).map((c: any) => ({ value: c.id, label: c.company }))} />;
}
