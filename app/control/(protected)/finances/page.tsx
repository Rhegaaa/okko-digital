import { prisma } from '@/lib/db';
import { PageTitle, Card, StatCard, EmptyState, Table, Th, Td } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { FinancesChart } from '@/components/admin/finances-chart';
import { formatDate, formatEuro } from '@/lib/constants';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FinancesPage() {
  const [subs, payments, quotesAccepted] = await Promise.all([
    prisma.subscription.findMany({ where: { status: { in: ['ACTIF', 'PAIEMENT_EN_RETARD'] } }, select: { amount: true, interval: true } }),
    prisma.payment.findMany({ include: { client: { select: { id: true, company: true } } }, orderBy: [{ paidAt: 'desc' }, { createdAt: 'desc' }], take: 200 }),
    prisma.quote.aggregate({ where: { status: 'ACCEPTE', recurring: false }, _sum: { amount: true } }),
  ]);
  const mrr = (subs ?? []).reduce((a: number, s: any) => a + (s?.interval === 'year' ? Math.round((s?.amount ?? 0) / 12) : s?.amount ?? 0), 0);
  const paid = (payments ?? []).filter((p: any) => p?.status === 'paid');
  const now = new Date();
  const ytd = paid.filter((p: any) => p?.paidAt && new Date(p.paidAt).getFullYear() === now.getFullYear()).reduce((a: number, p: any) => a + (p?.amount ?? 0), 0);
  const thisMonth = paid.filter((p: any) => p?.paidAt && new Date(p.paidAt).getFullYear() === now.getFullYear() && new Date(p.paidAt).getMonth() === now.getMonth()).reduce((a: number, p: any) => a + (p?.amount ?? 0), 0);

  const months: { label: string; total: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = paid.filter((p: any) => p?.paidAt && new Date(p.paidAt).getFullYear() === d.getFullYear() && new Date(p.paidAt).getMonth() === d.getMonth()).reduce((a: number, p: any) => a + (p?.amount ?? 0), 0);
    months.push({ label: d.toLocaleDateString('fr-FR', { month: 'short', timeZone: 'Europe/Paris' }), total: Math.round(total / 100) });
  }

  return (
    <div>
      <PageTitle title="Finances" description="Uniquement des montants réels : abonnements et paiements confirmés par Stripe." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenu mensuel récurrent" value={formatEuro(mrr)} hint={`${subs?.length ?? 0} abonnement(s) actif(s)`} />
        <StatCard label="Encaissé ce mois" value={formatEuro(thisMonth)} />
        <StatCard label={`Encaissé en ${now.getFullYear()}`} value={formatEuro(ytd)} />
        <StatCard label="Devis acceptés (ponctuels)" value={formatEuro(quotesAccepted?._sum?.amount ?? 0)} hint="Hors abonnements" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Encaissements sur 12 mois" className="lg:col-span-3">
          {paid.length === 0 ? <EmptyState title="Aucun paiement enregistré" text="Le graphique apparaîtra dès les premiers paiements Stripe synchronisés." /> : <FinancesChart data={months} />}
        </Card>
        <Card title="Derniers paiements" className="lg:col-span-2">
          {(payments?.length ?? 0) === 0 ? (
            <EmptyState title="Aucun paiement" text="Synchronisez Stripe depuis la page Abonnements." />
          ) : (
            <Table>
              <thead><tr className="border-b border-[#E7E7E4]"><Th>Date</Th><Th>Client</Th><Th>Montant</Th><Th>Statut</Th></tr></thead>
              <tbody className="divide-y divide-[#E7E7E4]">
                {(payments ?? []).slice(0, 15).map((p: any) => (
                  <tr key={p.id}>
                    <Td className="text-xs">{formatDate(p.paidAt ?? p.createdAt)}</Td>
                    <Td>{p?.client?.id ? <Link href={`/control/clients/${p.client.id}`} className="hover:underline">{p.client.company}</Link> : <span className="text-xs text-[#666666]">{p.stripeCustomerId}</span>}</Td>
                    <Td className="font-medium">{formatEuro(p.amount)}</Td>
                    <Td><StatusBadge value={p.status} label={p.status === 'paid' ? 'Payé' : p.status === 'open' ? 'En attente' : p.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
