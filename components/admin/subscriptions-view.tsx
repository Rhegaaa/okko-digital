'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { PageTitle, Card, EmptyState, StatCard, Table, Th, Td, btn } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { SUBSCRIPTION_STATUS_LABELS, formatDate, formatEuro } from '@/lib/constants';

export function SubscriptionsView({ subscriptions, webhookConfigured }: { subscriptions: any[]; webhookConfigured: boolean }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const active = (subscriptions ?? []).filter((s: any) => ['ACTIF', 'PAIEMENT_EN_RETARD'].includes(s?.status));
  const mrr = active.reduce((a: number, s: any) => a + (s?.interval === 'year' ? Math.round((s?.amount ?? 0) / 12) : s?.amount ?? 0), 0);

  async function sync() {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/subscriptions/sync', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Synchronisation impossible');
      toast.success(`Synchronisation terminée : ${data?.subscriptions ?? 0} abonnement(s), ${data?.payments ?? 0} paiement(s)`);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? 'Synchronisation impossible');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <PageTitle title="Abonnements" description="Données réelles issues de Stripe. Rien n’est saisi à la main." actions={<button className={btn.primary} onClick={sync} disabled={syncing}>{syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Synchroniser avec Stripe</button>} />
      {!webhookConfigured ? (
        <div className="mb-6 flex items-start gap-3 rounded-[6px] border border-[#F3E4C4] bg-[#FEFCE8] px-4 py-3 text-sm text-[#854D0E]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Le secret du webhook Stripe n’est pas encore renseigné : les mises à jour automatiques sont désactivées. Utilisez le bouton de synchronisation en attendant (voir Paramètres).</p>
        </div>
      ) : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenu mensuel récurrent" value={formatEuro(mrr)} hint={`${active.length} abonnement(s) actif(s)`} />
        <StatCard label="En retard de paiement" value={(subscriptions ?? []).filter((s: any) => s?.status === 'PAIEMENT_EN_RETARD').length} />
        <StatCard label="Résiliations programmées" value={(subscriptions ?? []).filter((s: any) => s?.cancelAtPeriodEnd && s?.status === 'ACTIF').length} />
      </div>
      <Card>
        {(subscriptions?.length ?? 0) === 0 ? (
          <EmptyState title="Aucun abonnement synchronisé" text="Cliquez sur « Synchroniser avec Stripe » pour importer les abonnements existants." />
        ) : (
          <Table>
            <thead><tr className="border-b border-[#E7E7E4]"><Th>Client</Th><Th>Formule</Th><Th>Montant</Th><Th>Période en cours</Th><Th>Début</Th><Th>Statut</Th></tr></thead>
            <tbody className="divide-y divide-[#E7E7E4]">
              {subscriptions.map((s: any) => (
                <tr key={s.id} className="hover:bg-[#FAFAF8]">
                  <Td>{s?.client?.id ? <Link href={`/control/clients/${s.client.id}`} className="font-medium hover:underline">{s.client.company}</Link> : <span className="text-xs text-[#666666]" title="Aucun client relié : renseignez cet identifiant Stripe sur la fiche client.">{s.stripeCustomerId}</span>}</Td>
                  <Td>{s.planLabel ?? s.plan}</Td>
                  <Td>{formatEuro(s.amount)} / {s.interval === 'year' ? 'an' : 'mois'}</Td>
                  <Td className="text-xs text-[#666666]">{s.currentPeriodStart ? `${formatDate(s.currentPeriodStart)} → ${formatDate(s.currentPeriodEnd)}` : '—'}{s.cancelAtPeriodEnd ? ' · résiliation programmée' : ''}</Td>
                  <Td>{s.startedAt ? formatDate(s.startedAt) : '—'}</Td>
                  <Td><StatusBadge value={s.status} label={SUBSCRIPTION_STATUS_LABELS[s.status] ?? s.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
