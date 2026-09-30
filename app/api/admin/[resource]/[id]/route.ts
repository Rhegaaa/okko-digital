import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, serverError, readJson } from '@/lib/admin-api';
import { RESOURCES } from '@/lib/admin-resources';
import { deleteFile } from '@/lib/s3';

export const dynamic = 'force-dynamic';

type P = { params: Promise<{ resource: string; id: string }> };

export async function GET(_req: Request, { params }: P) {
  if (!(await requireAdmin())) return unauthorized();
  const { resource, id } = await params;
  const def = RESOURCES[resource ?? ''];
  if (!def) return badRequest('Ressource inconnue');
  try {
    const row = await (prisma as any)[def.model].findUnique({ where: { id }, include: def.include });
    if (!row) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: Request, { params }: P) {
  if (!(await requireAdmin())) return unauthorized();
  const { resource, id } = await params;
  const def = RESOURCES[resource ?? ''];
  if (!def) return badRequest('Ressource inconnue');
  const body = await readJson(req);
  const parsed = def.parse(body, false);
  if ('error' in parsed && typeof parsed.error === 'string') return badRequest(parsed.error);
  try {
    const row = await (prisma as any)[def.model].update({ where: { id }, data: parsed, include: def.include });
    return NextResponse.json(row);
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    if (e?.code === 'P2002') return badRequest('Une entrée identique existe déjà.');
    return serverError(e);
  }
}

export async function DELETE(_req: Request, { params }: P) {
  if (!(await requireAdmin())) return unauthorized();
  const { resource, id } = await params;
  if (resource === 'documents') {
    try {
      const doc = await prisma.document.findUnique({ where: { id } });
      if (doc?.cloud_storage_path) await deleteFile(doc.cloud_storage_path).catch(() => null);
      await prisma.document.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch (e) {
      return serverError(e);
    }
  }
  const def = RESOURCES[resource ?? ''];
  if (!def) return badRequest('Ressource inconnue');
  try {
    await (prisma as any)[def.model].delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    return serverError(e);
  }
}
