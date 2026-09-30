import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { CalendarView } from '@/components/admin/calendar-view';

export const dynamic = 'force-dynamic';

export default async function CalendrierPage() {
  const [events, tasks, clients, prospects] = await Promise.all([
    prisma.calendarEvent.findMany({ include: { client: { select: { id: true, company: true } }, prospect: { select: { id: true, company: true } } }, orderBy: { startAt: 'asc' } }),
    prisma.task.findMany({ where: { dueDate: { not: null }, status: { not: 'TERMINE' } }, select: { id: true, title: true, dueDate: true, priority: true } }),
    prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: 'asc' } }),
    prisma.prospect.findMany({ select: { id: true, company: true }, where: { status: { notIn: ['PERDU', 'GAGNE'] } }, orderBy: { company: 'asc' } }),
  ]);
  return <CalendarView events={toPlain(events)} tasks={toPlain(tasks)} clients={(clients ?? []).map((c: any) => ({ value: c.id, label: c.company }))} prospects={(prospects ?? []).map((p: any) => ({ value: p.id, label: p.company }))} />;
}
