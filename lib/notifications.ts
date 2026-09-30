import { prisma } from '@/lib/db';

export async function createNotification(input: { type: string; title: string; message: string; link?: string | null }) {
  try {
    return await prisma.notification.create({
      data: {
        type: input?.type ?? 'info',
        title: input?.title ?? '',
        message: input?.message ?? '',
        link: input?.link ?? null,
      },
    });
  } catch (error) {
    console.error('notification error', error);
    return null;
  }
}
