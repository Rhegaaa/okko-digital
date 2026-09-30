import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, serverError } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!(await requireAdmin())) return unauthorized();
  try {
    await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
