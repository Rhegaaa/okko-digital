import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, serverError } from '@/lib/admin-api';
import { getFileUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!id) return badRequest();
  try {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    const url = await getFileUrl(doc.cloud_storage_path, doc.contentType ?? 'application/octet-stream', doc.isPublic);
    return NextResponse.json({ url });
  } catch (e) {
    return serverError(e);
  }
}
