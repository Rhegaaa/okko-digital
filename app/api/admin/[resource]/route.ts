import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, serverError, readJson } from '@/lib/admin-api';
import { RESOURCES, prepareCreate } from '@/lib/admin-resources';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { resource } = await params;
  const def = RESOURCES[resource ?? ''];
  if (!def) return badRequest('Ressource inconnue');
  try {
    const rows = await (prisma as any)[def.model].findMany({ include: def.include, orderBy: def.orderBy, take: 500 });
    return NextResponse.json(rows ?? []);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { resource } = await params;
  const def = RESOURCES[resource ?? ''];
  if (!def) return badRequest('Ressource inconnue');
  const body = await readJson(req);
  const parsed = def.parse(body, true);
  if ('error' in parsed && typeof parsed.error === 'string') return badRequest(parsed.error);
  try {
    const data = await prepareCreate(resource, parsed as Record<string, any>);
    const row = await (prisma as any)[def.model].create({ data, include: def.include });
    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') return badRequest('Une entrée identique existe déjà.');
    if (e?.code === 'P2003') return badRequest('Référence invalide (client ou projet introuvable).');
    return serverError(e);
  }
}
