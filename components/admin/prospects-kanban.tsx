'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, ChevronLeft, ChevronRight, UserCheck, LayoutGrid, List } from 'lucide-react';
import { PageTitle, Card, EmptyState, Table, Th, Td, btn } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { prospectFields } from '@/components/admin/field-defs';
import { PROSPECT_STATUS_LABELS, PROSPECT_STATUS_ORDER, SERVICE_LABELS, formatDate, formatEuro } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function ProspectsKanban({ prospects, focus }: { prospects: any[]; focus: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [view, setView] = useState<'kanban' | 'liste'>('kanban');
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    if (focus) {
      const p = (prospects ?? []).find((x: any) => x?.id === focus);
      if (p) setEditing(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const byStatus = useMemo(() => {
    const m: Record<string, any[]> = {};
    for (const s of PROSPECT_STATUS_ORDER) m[s] = [];
    for (const p of prospects ?? []) (m[p?.status] ?? (m[p?.status] = [])).push(p);
    return m;
  }, [prospects]);

  async function move(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/prospects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error('Changement de statut impossible');
    }
  }

  async function convert(id: string) {
    try {
      const res = await fetch(`/api/admin/prospects/${id}/convert`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.clientId) throw new Error(data?.error);
      toast.success(data?.alreadyConverted ? 'Ce prospect est déjà client' : 'Prospect converti en client');
      setEditing(null);
      router.push(`/control/clients/${data.clientId}`);
    } catch {
      toast.error('Conversion impossible');
    }
  }

  const late = (p: any) => p?.followUpDate && new Date(p.followUpDate) < new Date() && !['GAGNE', 'PERDU'].includes(p?.status);

  const cardEl = (p: any) => (
    <button
      key={p.id}
      draggable
      onDragStart={() => setDragId(p.id)}
      onDragEnd={() => setDragId(null)}
      onClick={() => setEditing(p)}
      className={cn('w-full rounded-[4px] border border-[#E7E7E4] bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md', dragId === p.id && 'opacity-50')}
    >
      <p className="truncate text-sm font-medium text-[#111111]">{p.company}</p>
      <p className="truncate text-xs text-[#666666]">{p.contactName}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#666666]">
        <span className="rounded-full bg-[#F7F7F5] px-2 py-0.5">{SERVICE_LABELS[p.service] ?? p.service}</span>
        {p.estimatedValue ? <span>{formatEuro(p.estimatedValue)}</span> : null}
      </div>
      {p.followUpDate ? <p className={cn('mt-2 text-xs', late(p) ? 'text-[#991B1B]' : 'text-[#666666]')}>{late(p) ? 'Relance en retard · ' : 'Relance · '}{formatDate(p.followUpDate)}</p> : null}
    </button>
  );

  return (
    <div>
      <PageTitle
        title="Prospects"
        description="Suivez chaque demande jusqu’à la signature."
        actions={
          <>
            <div className="flex rounded-[4px] border border-[#E7E7E4] bg-white p-0.5">
              <button onClick={() => setView('kanban')} className={cn('rounded-[3px] p-1.5', view === 'kanban' ? 'bg-[#111111] text-white' : 'text-[#666666]')} aria-label="Vue kanban"><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView('liste')} className={cn('rounded-[3px] p-1.5', view === 'liste' ? 'bg-[#111111] text-white' : 'text-[#666666]')} aria-label="Vue liste"><List className="h-4 w-4" /></button>
            </div>
            <button className={btn.primary} onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Nouveau prospect</button>
          </>
        }
      />

      {(prospects?.length ?? 0) === 0 ? (
        <Card><EmptyState title="Aucun prospect" text="Les demandes envoyées depuis le formulaire de contact arrivent ici automatiquement." /></Card>
      ) : view === 'kanban' ? (
        <div className="-mx-6 overflow-x-auto px-6 pb-4">
          <div className="flex min-w-max gap-3">
            {PROSPECT_STATUS_ORDER.map((s) => (
              <div
                key={s}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragId && move(dragId, s)}
                className="flex w-[248px] shrink-0 flex-col rounded-[6px] bg-[#EFEFEC] p-2"
              >
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#444444]">{PROSPECT_STATUS_LABELS[s]}</span>
                  <span className="text-xs text-[#666666]">{byStatus[s]?.length ?? 0}</span>
                </div>
                <div className="flex min-h-[80px] flex-col gap-2">{(byStatus[s] ?? []).map(cardEl)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <Table>
            <thead><tr className="border-b border-[#E7E7E4]"><Th>Entreprise</Th><Th>Contact</Th><Th>Service</Th><Th>Valeur</Th><Th>Relance</Th><Th>Statut</Th></tr></thead>
            <tbody className="divide-y divide-[#E7E7E4]">
              {(prospects ?? []).map((p: any) => (
                <tr key={p.id} className="cursor-pointer hover:bg-[#FAFAF8]" onClick={() => setEditing(p)}>
                  <Td className="font-medium">{p.company}</Td>
                  <Td>{p.contactName}<p className="text-xs text-[#666666]">{p.email}</p></Td>
                  <Td>{SERVICE_LABELS[p.service] ?? p.service}</Td>
                  <Td>{p.estimatedValue ? formatEuro(p.estimatedValue) : '—'}</Td>
                  <Td className={late(p) ? 'text-[#991B1B]' : ''}>{p.followUpDate ? formatDate(p.followUpDate) : '—'}</Td>
                  <Td><StatusBadge value={p.status} label={PROSPECT_STATUS_LABELS[p.status] ?? p.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <EntityDialog
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing === 'new' ? 'Nouveau prospect' : editing?.company ?? 'Prospect'}
        description={editing && editing !== 'new' ? `Ajouté le ${formatDate(editing.createdAt)}${editing.source ? ` · ${editing.source}` : ''}` : undefined}
        fields={prospectFields}
        initial={editing === 'new' ? { status: 'NOUVEAU', service: 'AUTRE' } : editing}
        endpoint={editing && editing !== 'new' ? `/api/admin/prospects/${editing.id}` : '/api/admin/prospects'}
        deletable={editing !== 'new'}
        extraFooter={
          editing && editing !== 'new' ? (
            <div className="flex flex-wrap items-center gap-2">
              {editing.convertedClientId ? (
                <button type="button" className={btn.secondary} onClick={() => router.push(`/control/clients/${editing.convertedClientId}`)}><UserCheck className="h-4 w-4" /> Voir la fiche client</button>
              ) : (
                <button type="button" className={btn.secondary} onClick={() => convert(editing.id)}><UserCheck className="h-4 w-4" /> Convertir en client</button>
              )}
              {(() => {
                const i = PROSPECT_STATUS_ORDER.indexOf(editing.status);
                const prev = PROSPECT_STATUS_ORDER[i - 1];
                const next = PROSPECT_STATUS_ORDER[i + 1];
                return (
                  <>
                    {prev ? <button type="button" className={btn.ghost} onClick={() => { move(editing.id, prev); setEditing(null); }}><ChevronLeft className="h-4 w-4" />{PROSPECT_STATUS_LABELS[prev]}</button> : null}
                    {next && next !== 'PERDU' ? <button type="button" className={btn.ghost} onClick={() => { move(editing.id, next); setEditing(null); }}>{PROSPECT_STATUS_LABELS[next]}<ChevronRight className="h-4 w-4" /></button> : null}
                  </>
                );
              })()}
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
