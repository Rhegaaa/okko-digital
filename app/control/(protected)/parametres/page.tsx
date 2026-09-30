import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { SettingsView } from '@/components/admin/settings-view';

export const dynamic = 'force-dynamic';

export default async function ParametresPage() {
  const session = await auth();
  const [showcase, submissions] = await Promise.all([
    prisma.showcase.findMany({ orderBy: [{ position: 'asc' }, { createdAt: 'desc' }] }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
  ]);
  return <SettingsView email={session?.user?.email ?? ''} name={session?.user?.name ?? ''} showcase={toPlain(showcase)} submissions={toPlain(submissions)} webhookConfigured={!!process.env.STRIPE_WEBHOOK_SECRET} contactEmail={process.env.CONTACT_EMAIL ?? ''} />;
}
