import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { ClientsTable } from '@/components/admin/clients-table';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { projects: true, tasks: { where: { status: { not: 'TERMINE' } } } } }, subscriptions: { where: { status: { in: ['ACTIF', 'PAIEMENT_EN_RETARD'] } }, select: { amount: true, interval: true, status: true } } },
    orderBy: { company: 'asc' },
  });
  return <ClientsTable clients={toPlain(clients)} />;
}
