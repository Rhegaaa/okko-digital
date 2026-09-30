import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, serverError } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim().slice(0, 100);
  if (q.length < 2) return NextResponse.json([]);
  const contains = { contains: q, mode: 'insensitive' as const };
  try {
    const [clients, prospects, projects, tasks, quotes] = await Promise.all([
      prisma.client.findMany({ where: { OR: [{ company: contains }, { contactName: contains }, { email: contains }] }, take: 5, select: { id: true, company: true, contactName: true } }),
      prisma.prospect.findMany({ where: { OR: [{ company: contains }, { contactName: contains }, { email: contains }] }, take: 5, select: { id: true, company: true, contactName: true } }),
      prisma.project.findMany({ where: { name: contains }, take: 5, select: { id: true, name: true, client: { select: { company: true } } } }),
      prisma.task.findMany({ where: { title: contains }, take: 5, select: { id: true, title: true } }),
      prisma.quote.findMany({ where: { OR: [{ title: contains }, { reference: contains }] }, take: 5, select: { id: true, title: true, reference: true } }),
    ]);
    const results = [
      ...(clients ?? []).map((c: any) => ({ type: 'Client', label: c.company, sub: c.contactName, href: `/control/clients/${c.id}` })),
      ...(prospects ?? []).map((p: any) => ({ type: 'Prospect', label: p.company, sub: p.contactName, href: `/control/prospects?focus=${p.id}` })),
      ...(projects ?? []).map((p: any) => ({ type: 'Projet', label: p.name, sub: p?.client?.company ?? '', href: `/control/projets?focus=${p.id}` })),
      ...(tasks ?? []).map((t: any) => ({ type: 'Tâche', label: t.title, sub: '', href: `/control/taches?focus=${t.id}` })),
      ...(quotes ?? []).map((q: any) => ({ type: 'Devis', label: q.title, sub: q.reference, href: `/control/devis?focus=${q.id}` })),
    ];
    return NextResponse.json(results);
  } catch (e) {
    return serverError(e);
  }
}
