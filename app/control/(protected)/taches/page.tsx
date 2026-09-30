import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { TasksView } from '@/components/admin/tasks-view';

export const dynamic = 'force-dynamic';

export default async function TachesPage() {
  const [tasks, clients, projects] = await Promise.all([
    prisma.task.findMany({ include: { client: { select: { id: true, company: true } }, project: { select: { id: true, name: true } } }, orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }] }),
    prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: 'asc' } }),
    prisma.project.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);
  return <TasksView tasks={toPlain(tasks)} clients={(clients ?? []).map((c: any) => ({ value: c.id, label: c.company }))} projects={(projects ?? []).map((p: any) => ({ value: p.id, label: p.name }))} />;
}
