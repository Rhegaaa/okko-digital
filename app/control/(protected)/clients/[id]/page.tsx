import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { ClientDetail } from '@/components/admin/client-detail';

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { createdAt: 'desc' } },
      tasks: { include: { client: { select: { id: true, company: true } }, project: { select: { id: true, name: true } } }, orderBy: [{ status: 'asc' }, { dueDate: 'asc' }] },
      quotes: { orderBy: { issuedAt: 'desc' } },
      clientNotes: { orderBy: { createdAt: 'desc' } },
      subscriptions: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { paidAt: 'desc' }, take: 50 },
      documents: { orderBy: { createdAt: 'desc' } },
      events: { orderBy: { startAt: 'desc' }, take: 30 },
    },
  });
  if (!client) notFound();
  const projects = (client?.projects ?? []).map((p: any) => ({ value: p.id, label: p.name }));
  return <ClientDetail client={toPlain(client)} projectOptions={projects} />;
}
