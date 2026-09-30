'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageTitle, Card, EmptyState, StatCard, Table, Th, Td, btn, input } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { quoteFields, type Option } from '@/components/admin/field-defs';
import { QUOTE_STATUS_LABELS, SERVICE_LABELS, formatDate, formatEuro } from '@/lib/constants';

export function QuotesView({ quotes, clients, prospects }: { quotes: any[]; clients: Option[]; prospects: Option[] }) {
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [status, setStatus] = useState('');
  const list = useMemo(() => (quotes ?? []).filter((q: any) => !status || q?.status === status), [quotes, status]);
  const sum = (s: string) => (quotes ?? []).filter((q: any) => q?.status === s).reduce((a: number, q: any) => a + (q?.amount ?? 0), 0);

  return (
    <div>
      <PageTitle title="Devis" description="Propositions envoyées, acceptées ou en attente." actions={<button className={btn.primary} onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Nouveau devis</button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="En attente" value={formatEuro(sum('ENVOYE'))} hint={`${(quotes ?? []).filter((q: any) => q?.status === 'ENVOYE').length} devis envoyé(s)`} />
        <StatCard label="Acceptés" value={formatEuro(sum('ACCEPTE'))} hint={`${(quotes ?? []).filter((q: any) => q?.status === 'ACCEPTE').length} devis`} />
        <StatCard label="Brouillons" value={(quotes ?? []).filter((q: any) => q?.status === 'BROUILLON').length} />
      </div>
      <Card>
        <div className="mb-4">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} w-auto`} aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            {Object.entries(QUOTE_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {list.length === 0 ? (
          <EmptyState title="Aucun devis" text="Les montants restent internes et ne sont jamais publiés sur le site." />
        ) : (
          <Table>
            <thead><tr className="border-b border-[#E7E7E4]"><Th>Réf.</Th><Th>Intitulé</Th><Th>Destinataire</Th><Th>Service</Th><Th>Montant HT</Th><Th>Émis le</Th><Th>Valide jusqu’au</Th><Th>Statut</Th></tr></thead>
            <tbody className="divide-y divide-[#E7E7E4]">
              {list.map((q: any) => (
                <tr key={q.id} className="hover:bg-[#FAFAF8]">
                  <Td className="font-mono text-xs">{q.reference}</Td>
                  <Td><button onClick={() => setEditing(q)} className="font-medium hover:underline">{q.title}</button></Td>
                  <Td>{q?.client?.id ? <Link href={`/control/clients/${q.client.id}`} className="hover:underline">{q.client.company}</Link> : q?.prospect?.id ? <Link href={`/control/prospects?focus=${q.prospect.id}`} className="hover:underline">{q.prospect.company} <span className="text-xs text-[#999999]">(prospect)</span></Link> : '—'}</Td>
                  <Td>{SERVICE_LABELS[q.service] ?? q.service}</Td>
                  <Td className="font-medium">{formatEuro(q.amount)}{q.recurring ? <span className="text-xs text-[#666666]"> /mois</span> : null}</Td>
                  <Td>{formatDate(q.issuedAt)}</Td>
                  <Td>{q.validUntil ? formatDate(q.validUntil) : '—'}</Td>
                  <Td><StatusBadge value={q.status} label={QUOTE_STATUS_LABELS[q.status] ?? q.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <EntityDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={editing === 'new' ? 'Nouveau devis' : `Devis ${editing?.reference ?? ''}`} fields={quoteFields(clients, prospects)} initial={editing === 'new' ? { status: 'BROUILLON', service: 'AUTRE' } : editing} endpoint={editing && editing !== 'new' ? `/api/admin/quotes/${editing.id}` : '/api/admin/quotes'} deletable={editing !== 'new'} />
    </div>
  );
}
