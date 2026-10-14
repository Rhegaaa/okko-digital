import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, readJson, serverError } from '@/lib/admin-api';
import { actionUpdate, addDays, parisToday } from '@/lib/gmb-work';
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const input = actionUpdate.safeParse(await readJson(req));
  if (!input.success) return badRequest('Mise à jour invalide.');
  const { id } = await params;
  try {
    const result = await prisma.$transaction(async tx => {
      const action = await tx.gmbAction.findUnique({ where: { id }, include: { profile: { include: { client: true } } } });
      if (!action) throw new Error('Action introuvable.');
      if (action.status === 'TERMINE') return action;
      const complete = input.data.status === 'TERMINE';
      const claimed = await tx.gmbAction.updateMany({ where: { id, status: { not: 'TERMINE' } }, data: { ...input.data, dueDate: input.data.dueDate ? new Date(`${input.data.dueDate}T12:00:00Z`) : undefined, completedAt: complete ? new Date() : undefined } });
      if (complete && claimed.count) {
        if (action.kind === 'ACCESS') await tx.gmbProfile.update({ where: { id: action.profileId }, data: { accessConfirmed: true } });
        if (action.cadenceDays && action.profile.client.status === 'ACTIF') {
          await tx.gmbAction.upsert({ where: { previousId: id }, update: {}, create: { profileId: action.profileId, previousId: id, kind: action.kind, title: action.title, detail: action.detail, cadenceDays: action.cadenceDays, quantity: null, source: 'PLANIFIEE', dueDate: new Date(`${addDays(parisToday(), action.cadenceDays)}T12:00:00Z`) } });
        }
      }
      return tx.gmbAction.findUnique({ where: { id } });
    });
    return NextResponse.json(result);
  } catch (e) { return serverError(e, 'Action non enregistrée.'); }
}
