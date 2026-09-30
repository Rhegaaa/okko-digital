import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, serverError, readJson } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = await readJson(req);
  const clientId = String(body?.clientId ?? '');
  const cloud_storage_path = String(body?.cloud_storage_path ?? '');
  const name = String(body?.name ?? '').slice(0, 200);
  if (!clientId || !cloud_storage_path || !name) return badRequest('Données manquantes');
  try {
    const doc = await prisma.document.create({
      data: {
        clientId,
        name,
        category: String(body?.category ?? 'AUTRE').slice(0, 40),
        cloud_storage_path,
        isPublic: false,
        contentType: body?.contentType ? String(body.contentType).slice(0, 120) : null,
        size: Number.isFinite(Number(body?.size)) ? Math.round(Number(body.size)) : null,
      },
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
