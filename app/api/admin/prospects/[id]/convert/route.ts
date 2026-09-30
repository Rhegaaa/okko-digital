import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, serverError } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

/** Convertit un prospect gagné en client (idempotent). */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  try {
    const p = await prisma.prospect.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    if (p.convertedClientId) {
      const existing = await prisma.client.findUnique({ where: { id: p.convertedClientId } });
      if (existing) return NextResponse.json({ clientId: existing.id, alreadyConverted: true });
    }
    const client = await prisma.client.create({
      data: {
        company: p.company,
        contactName: p.contactName,
        email: p.email,
        phone: p.phone,
        services: p.service && p.service !== 'AUTRE' ? [p.service] : [],
        notes: p.notes,
        status: 'ACTIF',
      },
    });
    await prisma.prospect.update({ where: { id }, data: { status: 'GAGNE', convertedClientId: client.id } });
    await prisma.quote.updateMany({ where: { prospectId: id, clientId: null }, data: { clientId: client.id } });
    await prisma.contactSubmission.updateMany({ where: { prospectId: id }, data: { status: 'CONVERTI' } });
    return NextResponse.json({ clientId: client.id });
  } catch (e) {
    return serverError(e);
  }
}
