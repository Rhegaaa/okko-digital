'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Check } from 'lucide-react';
import { PageTitle, Card, EmptyState, btn } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { taskFields, type Option } from '@/components/admin/field-defs';
import { formatDate, TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Filter = 'toutes' | 'aujourdhui' | 'retard' | 'venir' | 'terminees';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'aujourdhui', label: 'Aujourd’hui' },
  { key: 'retard', label: 'En retard' },
  { key: 'venir', label: 'À venir' },
  { key: 'terminees', label: 'Terminées' },
];

export function TasksView({ tasks, clients, projects, embedded, presetClientId, presetProjectId }: { tasks: any[]; clients: Option[]; projects: Option[]; embedded?: boolean; presetClientId?: string; presetProjectId?: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('toutes');
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [now, setNow] = useState<number>(0);
  useEffect(() => setNow(Date.now()), []);

  const list = useMemo(() => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 86400000);
    return (tasks ?? []).filter((t: any) => {
      const due = t?.dueDate ? new Date(t.dueDate) : null;
      const done = t?.status === 'TERMINE';
      switch (filter) {
        case 'aujourdhui':
          return !done && due && due >= start && due < end;
        case 'retard':
          return !done && due && due < start;
        case 'venir':
          return !done && (!due || due >= end);
        case 'terminees':
          return done;
        default:
          return true;
      }
    });
  }, [tasks, filter, now]);

  async function toggle(t: any) {
    const status = t?.status === 'TERMINE' ? 'A_FAIRE' : 'TERMINE';
    try {
      await fetch(`/api/admin/tasks/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  const fields = taskFields(clients, projects);
  const isLate = (t: any) => now > 0 && t?.status !== 'TERMINE' && t?.dueDate && new Date(t.dueDate) < new Date(new Date(now).setHours(0, 0, 0, 0));

  const body = (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-1">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn('rounded-[4px] px-3 py-1.5 text-sm transition-colors', filter === f.key ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#F7F7F5] hover:text-[#111111]')}>
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Aucune tâche" text="Créez une tâche pour commencer." action={<button className={btn.primary} onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Nouvelle tâche</button>} />
      ) : (
        <ul className="divide-y divide-[#E7E7E4]">
          {list.map((t: any) => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <button onClick={() => toggle(t)} aria-label={t.status === 'TERMINE' ? 'Rouvrir' : 'Terminer'} className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors', t.status === 'TERMINE' ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#BBBBBB] hover:border-[#111111]')}>
                {t.status === 'TERMINE' ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              </button>
              <button onClick={() => setEditing(t)} className="min-w-0 flex-1 text-left">
                <p className={cn('truncate text-sm', t.status === 'TERMINE' ? 'text-[#999999] line-through' : 'text-[#111111]')}>{t.title}</p>
                <p className="text-xs text-[#666666]">
                  {t?.client?.company ? `${t.client.company}` : ''}
                  {t?.project?.name ? ` · ${t.project.name}` : ''}
                  {t?.dueDate ? <span className={isLate(t) ? ' text-[#991B1B]' : ''}>{t?.client?.company || t?.project?.name ? ' · ' : ''}{isLate(t) ? 'En retard · ' : ''}{formatDate(t.dueDate)}</span> : null}
                </p>
              </button>
              {t?.client?.id && !embedded ? (
                <Link href={`/control/clients/${t.client.id}`} className="hidden text-xs text-[#666666] hover:text-[#111111] sm:inline">
                  Fiche
                </Link>
              ) : null}
              <StatusBadge value={t.priority} label={TASK_PRIORITY_LABELS[t.priority] ?? t.priority} />
              <StatusBadge value={t.status} label={TASK_STATUS_LABELS[t.status] ?? t.status} className="hidden sm:inline-flex" />
            </li>
          ))}
        </ul>
      )}
      <EntityDialog
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing === 'new' ? 'Nouvelle tâche' : 'Modifier la tâche'}
        fields={fields}
        initial={editing === 'new' ? { clientId: presetClientId ?? '', projectId: presetProjectId ?? '', priority: 'NORMALE', status: 'A_FAIRE' } : editing}
        endpoint={editing && editing !== 'new' ? `/api/admin/tasks/${editing.id}` : '/api/admin/tasks'}
        deletable={editing !== 'new'}
      />
    </>
  );

  if (embedded) return body;
  return (
    <div>
      <PageTitle title="À faire" description="Toutes vos tâches, classées par échéance." actions={<button className={btn.primary} onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Nouvelle tâche</button>} />
      <Card>{body}</Card>
    </div>
  );
}
