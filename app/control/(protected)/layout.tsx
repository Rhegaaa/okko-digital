import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { AdminShell, type NotificationItem } from '@/components/admin/shell';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/control/connexion');

  let notifications: NotificationItem[] = [];
  let unread = 0;
  try {
    const [rows, count] = await Promise.all([prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 15 }), prisma.notification.count({ where: { read: false } })]);
    notifications = (rows ?? []).map((n: any) => ({ id: n.id, title: n.title, message: n.message, link: n.link ?? null, read: !!n.read, createdAt: new Date(n.createdAt).toISOString() }));
    unread = count ?? 0;
  } catch {
    /* ignore */
  }

  return (
    <AdminShell userName={session?.user?.name ?? session?.user?.email ?? ''} notifications={notifications} unread={unread}>
      {children}
    </AdminShell>
  );
}
