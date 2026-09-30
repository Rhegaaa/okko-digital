'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageTitle, Card, EmptyState, Table, Th, Td, btn, input } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { projectFields, type Option } from '@/components/admin/field-defs';
import { PROJECT_STATUS_LABELS, SERVICE_LABELS, formatDate, formatEuro } from '@/lib/constants';

export function ProjectsView({ projects, clients }: { projects: any[]; clients: Option[] }) {
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [status, setStatus] = useState('');
  const list = useMemo(() => (projects ?? []).filter((p: any) => !status || p?.status === status), [projects, status]);

  return (
    <div>
      <PageTitle title="Projets" description="Les missions en cours et à venir, client par client." actions={<button className={btn.primary} onClick={() => setEditing('new')} disabled={clients.length === 0}><Plus className="h-4 w-4" /> Nouveau projet</button>} />
      <Card>
        <div className="mb-4">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} w-auto`} aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            {Object.entries(PROJECT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {list.length === 0 ? (
          <EmptyState title="Aucun projet" text={clients.length === 0 ? 'Créez d’abord un client pour lui rattacher un projet.' : 'Créez un projet pour suivre une mission.'} />
        ) : (
          <Table>
            <thead><tr className="border-b border-[#E7E7E4]"><Th>Projet</Th><Th>Client</Th><Th>Service</Th><Th>Échéance</Th><Th>Budget</Th><Th>Tâches ouvertes</Th><Th>Statut</Th></tr></thead>
            <tbody className="divide-y divide-[#E7E7E4]">
              {list.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#FAFAF8]">
                  <Td><button onClick={() => setEditing(p)} className="font-medium hover:underline">{p.name}</button></Td>
                  <Td>{p?.client?.id ? <Link href={`/control/clients/${p.client.id}`} className="hover:underline">{p.client.company}</Link> : '—'}</Td>
                  <Td>{SERVICE_LABELS[p.service] ?? p.service}</Td>
                  <Td>{p.dueDate ? formatDate(p.dueDate) : '—'}</Td>
                  <Td>{p.budget ? formatEuro(p.budget) : '—'}</Td>
                  <Td>{p?._count?.tasks ?? 0}</Td>
                  <Td><StatusBadge value={p.status} label={PROJECT_STATUS_LABELS[p.status] ?? p.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <EntityDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={editing === 'new' ? 'Nouveau projet' : 'Modifier le projet'} fields={projectFields(clients)} initial={editing === 'new' ? { status: 'A_PREPARER', clientId: clients?.[0]?.value ?? '' } : editing} endpoint={editing && editing !== 'new' ? `/api/admin/projects/${editing.id}` : '/api/admin/projects'} deletable={editing !== 'new'} />
    </div>
  );
}
