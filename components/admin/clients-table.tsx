'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { PageTitle, Card, EmptyState, Table, Th, Td, btn, input } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { clientFields } from '@/components/admin/field-defs';
import { CLIENT_STATUS_LABELS, SERVICE_LABELS, formatEuro } from '@/lib/constants';

export function ClientsTable({ clients }: { clients: any[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const s = q?.trim?.().toLowerCase() ?? '';
    return (clients ?? []).filter((c: any) => (!status || c?.status === status) && (!s || `${c?.company ?? ''} ${c?.contactName ?? ''} ${c?.email ?? ''} ${c?.city ?? ''}`.toLowerCase().includes(s)));
  }, [clients, q, status]);

  const mrr = (c: any) => (c?.subscriptions ?? []).reduce((acc: number, s: any) => acc + (s?.interval === 'year' ? Math.round((s?.amount ?? 0) / 12) : s?.amount ?? 0), 0);

  return (
    <div>
      <PageTitle title="Clients" description={`${clients?.length ?? 0} client${(clients?.length ?? 0) > 1 ? 's' : ''} au total.`} actions={<button className={btn.primary} onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nouveau client</button>} />
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un client…" className={`${input} pl-9`} aria-label="Rechercher" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} w-auto`} aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        {list.length === 0 ? (
          <EmptyState title="Aucun client" text={clients?.length ? 'Aucun résultat pour cette recherche.' : 'Ajoutez votre premier client.'} />
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-[#E7E7E4]">
                <Th>Entreprise</Th>
                <Th>Contact</Th>
                <Th>Services</Th>
                <Th>Projets</Th>
                <Th>Tâches ouvertes</Th>
                <Th>Abonnement</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7E4]">
              {list.map((c: any) => (
                <tr key={c.id} className="transition-colors hover:bg-[#FAFAF8]">
                  <Td>
                    <Link href={`/control/clients/${c.id}`} className="font-medium hover:underline">{c.company}</Link>
                    {c?.city ? <p className="text-xs text-[#666666]">{c.city}</p> : null}
                  </Td>
                  <Td>
                    <p>{c.contactName}</p>
                    {c?.email ? <p className="text-xs text-[#666666]">{c.email}</p> : null}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(c?.services ?? []).map((s: string) => (
                        <span key={s} className="rounded-full bg-[#F7F7F5] px-2 py-0.5 text-xs text-[#444444]">{SERVICE_LABELS[s] ?? s}</span>
                      ))}
                    </div>
                  </Td>
                  <Td>{c?._count?.projects ?? 0}</Td>
                  <Td>{c?._count?.tasks ?? 0}</Td>
                  <Td>{(c?.subscriptions?.length ?? 0) > 0 ? `${formatEuro(mrr(c))} /mois` : <span className="text-[#999999]">—</span>}</Td>
                  <Td><StatusBadge value={c.status} label={CLIENT_STATUS_LABELS[c.status] ?? c.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <EntityDialog open={open} onOpenChange={setOpen} title="Nouveau client" fields={clientFields} initial={{ status: 'ACTIF' }} endpoint="/api/admin/clients" onSaved={(row: any) => row?.id && router.push(`/control/clients/${row.id}`)} />
    </div>
  );
}
