import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, readJson, serverError } from '@/lib/admin-api';
import { googleUrl } from '@/lib/gmb-work';
const link = z.union([z.string().trim().max(1500).refine(googleUrl), z.literal('')]);
const schema = z.object({ status: z.enum(['ACTIF','EN_PAUSE','ANCIEN']).optional(), accessConfirmed: z.boolean().optional(), manageUrl: link.optional(), reviewsUrl: link.optional(), photosUrl: link.optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const input = schema.safeParse(await readJson(req));
  if (!input.success) return badRequest('Les liens doivent être des liens Google en https.');
  const { id } = await params;
  const { status, ...links } = input.data;
  try {
    const row = await prisma.$transaction(async tx => {
      const profile = await tx.gmbProfile.update({ where: { id }, data: { ...links, manageUrl: links.manageUrl === '' ? null : links.manageUrl, reviewsUrl: links.reviewsUrl === '' ? null : links.reviewsUrl, photosUrl: links.photosUrl === '' ? null : links.photosUrl, ...(status ? { client: { update: { status } } } : {}) } });
      if (links.accessConfirmed === true) await tx.gmbAction.updateMany({ where: { profileId: id, kind: 'ACCESS', status: { not: 'TERMINE' } }, data: { status: 'TERMINE', completedAt: new Date() } });
      return profile;
    });
    return NextResponse.json(row);
  } catch (e) { return serverError(e); }
}
