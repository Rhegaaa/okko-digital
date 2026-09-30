import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized, badRequest, serverError, readJson } from '@/lib/admin-api';
import { generatePresignedUploadUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = await readJson(req);
  const fileName = String(body?.fileName ?? '').replace(/[^\w.\-à-ü ]/gi, '_').slice(0, 150);
  const contentType = String(body?.contentType ?? 'application/octet-stream');
  if (!fileName) return badRequest('Nom de fichier manquant');
  try {
    const result = await generatePresignedUploadUrl(fileName, contentType, false);
    return NextResponse.json(result);
  } catch (e) {
    return serverError(e);
  }
}
