import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, serverError, readJson } from '@/lib/admin-api';
import { profileInput, actionInput, initialActions } from '@/lib/gmb-work';

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = await readJson(req);
  try {
    if (body.mode === 'action') {
      const input = actionInput.safeParse(body);
      if (!input.success) return badRequest(input.error.issues[0].message);
      const { dueDate, ...data } = input.data;
      const profile = await prisma.gmbProfile.findUnique({ where: { id: data.profileId }, include: { client: true } });
      if (!profile || profile.client.status !== 'ACTIF') return badRequest('Choisissez un client actif.');
      return NextResponse.json(await prisma.gmbAction.create({ data: { ...data, dueDate: new Date(`${dueDate}T12:00:00Z`), source: 'MANUELLE' } }), { status: 201 });
    }
    const input = profileInput.safeParse(body);
    if (!input.success) return badRequest(input.error.issues[0].message);
    const v = input.data;
    const existing = await prisma.gmbProfile.findFirst({ where: { mapsUrl: v.mapsUrl } });
    if (existing) return badRequest('Cette fiche est déjà enregistrée.');
    const row = await prisma.$transaction(async tx => {
      const client = await tx.client.create({ data: { company: v.company, contactName: v.contactName, email: v.email || null, phone: v.phone || null, city: v.city || null, services: ['PRESENCE_LOCALE'] } });
      return tx.gmbProfile.create({ data: { clientId: client.id, mapsUrl: v.mapsUrl, manageUrl: v.manageUrl || null, reviewsUrl: v.reviewsUrl || null, photosUrl: v.photosUrl || null, accessConfirmed: v.accessConfirmed, actions: { create: initialActions(v) } } });
    });
    return NextResponse.json(row, { status: 201 });
  } catch (e) { return serverError(e, 'Enregistrement impossible.'); }
}
