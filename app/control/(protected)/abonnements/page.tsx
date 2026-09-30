import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { SubscriptionsView } from '@/components/admin/subscriptions-view';

export const dynamic = 'force-dynamic';

export default async function AbonnementsPage() {
  const subs = await prisma.subscription.findMany({ include: { client: { select: { id: true, company: true } } }, orderBy: [{ status: 'asc' }, { createdAt: 'desc' }] });
  return <SubscriptionsView subscriptions={toPlain(subs)} webhookConfigured={!!process.env.STRIPE_WEBHOOK_SECRET} />;
}
