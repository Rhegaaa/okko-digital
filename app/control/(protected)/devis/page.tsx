import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import { QuotesView } from '@/components/admin/quotes-view';

export const dynamic = 'force-dynamic';

export default async function DevisPage() {
  const [quotes, clients, prospects] = await Promise.all([
    prisma.quote.findMany({ include: { client: { select: { id: true, company: true } }, prospect: { select: { id: true, company: true } } }, orderBy: { issuedAt: 'desc' } }),
    prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: 'asc' } }),
    prisma.prospect.findMany({ select: { id: true, company: true }, where: { status: { notIn: ['PERDU'] } }, orderBy: { company: 'asc' } }),
  ]);
  return <QuotesView quotes={toPlain(quotes)} clients={(clients ?? []).map((c: any) => ({ value: c.id, label: c.company }))} prospects={(prospects ?? []).map((p: any) => ({ value: p.id, label: p.company }))} />;
}
