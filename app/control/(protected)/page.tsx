import { prisma } from '@/lib/db';
import { toPlain, endOfDay, startOfDay } from '@/lib/serialize';
import { DashboardView } from '@/components/admin/dashboard-view';

export const dynamic = 'force-dynamic';

export default async function ControlHome() {
  const today = endOfDay();
  const in7 = new Date(startOfDay().getTime() + 7 * 86400000);

  const [tasksToday, tasksLate, prospectsFollow, quotesSent, subsLate, projectsActive, clientsCount, prospectsNew, submissionsNew, upcomingEvents, clients, projects] = await Promise.all([
    prisma.task.findMany({ where: { status: { not: 'TERMINE' }, dueDate: { gte: startOfDay(), lte: today } }, include: { client: { select: { id: true, company: true } } }, orderBy: { priority: 'desc' } }),
    prisma.task.findMany({ where: { status: { not: 'TERMINE' }, dueDate: { lt: startOfDay() } }, include: { client: { select: { id: true, company: true } } }, orderBy: { dueDate: 'asc' } }),
    prisma.prospect.findMany({ where: { status: { notIn: ['GAGNE', 'PERDU'] }, followUpDate: { lte: today } }, orderBy: { followUpDate: 'asc' }, take: 10 }),
    prisma.quote.findMany({ where: { status: 'ENVOYE' }, include: { client: { select: { company: true } }, prospect: { select: { company: true } } }, orderBy: { issuedAt: 'asc' }, take: 10 }),
    prisma.subscription.findMany({ where: { status: 'PAIEMENT_EN_RETARD' }, include: { client: { select: { id: true, company: true } } } }),
    prisma.project.count({ where: { status: { in: ['EN_COURS', 'A_VALIDER', 'EN_ATTENTE_CLIENT'] } } }),
    prisma.client.count({ where: { status: 'ACTIF' } }),
    prisma.prospect.count({ where: { status: { in: ['NOUVEAU', 'A_CONTACTER'] } } }),
    prisma.contactSubmission.count({ where: { status: 'NOUVEAU' } }),
    prisma.calendarEvent.findMany({ where: { startAt: { gte: startOfDay(), lte: in7 } }, include: { client: { select: { company: true } }, prospect: { select: { company: true } } }, orderBy: { startAt: 'asc' }, take: 8 }),
    prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: 'asc' } }),
    prisma.project.findMany({ select: { id: true, name: true }, where: { status: { not: 'TERMINE' } }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <DashboardView
      data={toPlain({ tasksToday, tasksLate, prospectsFollow, quotesSent, subsLate, projectsActive, clientsCount, prospectsNew, submissionsNew, upcomingEvents })}
      clients={(clients ?? []).map((c: any) => ({ value: c.id, label: c.company }))}
      projects={(projects ?? []).map((p: any) => ({ value: p.id, label: p.name }))}
    />
  );
}
