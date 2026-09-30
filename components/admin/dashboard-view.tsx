'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, CheckSquare, UserPlus, Users, FileText, AlertCircle, CalendarDays } from 'lucide-react';
import { Card, StatCard, EmptyState, btn } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { clientFields, prospectFields, taskFields, quoteFields, type Option } from '@/components/admin/field-defs';
import { formatDate, formatEuro, TASK_PRIORITY_LABELS, PROSPECT_STATUS_LABELS } from '@/lib/constants';

type Dialog = 'task' | 'prospect' | 'client' | 'quote' | null;

export function DashboardView({ data, clients, projects }: { data: any; clients: Option[]; projects: Option[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<Dialog>(null);
  const tasksToday: any[] = data?.tasksToday ?? [];
  const tasksLate: any[] = data?.tasksLate ?? [];
  const prospectsFollow: any[] = data?.prospectsFollow ?? [];
  const quotesSent: any[] = data?.quotesSent ?? [];
  const subsLate: any[] = data?.subsLate ?? [];
  const upcomingEvents: any[] = data?.upcomingEvents ?? [];
  const attention = (tasksToday?.length ?? 0) + (tasksLate?.length ?? 0) + (prospectsFollow?.length ?? 0) + (subsLate?.length ?? 0) + (data?.submissionsNew ?? 0);

  async function completeTask(id: string) {
    try {
      await fetch(`/api/admin/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'TERMINE' }) });
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  const [greeting, setGreeting] = useState('Bonjour');
  useEffect(() => setGreeting(new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'), []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">{greeting}, voici ce qui nécessite votre attention aujourd’hui.</h1>
          <p className="mt-1 text-sm text-[#666666]">{attention > 0 ? `${attention} élément${attention > 1 ? 's' : ''} à traiter.` : 'Rien d’urgent. Bonne journée.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={btn.primary} onClick={() => setDialog('task')}>
            <Plus className="h-4 w-4" /> Tâche
          </button>
          <button className={btn.secondary} onClick={() => setDialog('prospect')}>
            <UserPlus className="h-4 w-4" /> Prospect
          </button>
          <button className={btn.secondary} onClick={() => setDialog('client')}>
            <Users className="h-4 w-4" /> Client
          </button>
          <button className={btn.secondary} onClick={() => setDialog('quote')}>
            <FileText className="h-4 w-4" /> Devis
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clients actifs" value={data?.clientsCount ?? 0} icon={Users} />
        <StatCard label="Projets en cours" value={data?.projectsActive ?? 0} icon={CheckSquare} />
        <StatCard label="Nouveaux prospects" value={data?.prospectsNew ?? 0} hint={data?.submissionsNew ? `${data.submissionsNew} demande(s) de contact non traitée(s)` : undefined} icon={UserPlus} />
        <StatCard label="Devis en attente" value={quotesSent?.length ?? 0} icon={FileText} />
      </div>

      {subsLate?.length > 0 ? (
        <div className="mt-6 flex items-start gap-3 rounded-[6px] border border-[#F3D5D5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">{subsLate.length} abonnement(s) en retard de paiement</p>
            <ul className="mt-1 space-y-0.5">
              {subsLate.map((s: any) => (
                <li key={s.id}>
                  {s?.client?.id ? (
                    <Link href={`/control/clients/${s.client.id}`} className="underline">
                      {s.client.company}
                    </Link>
                  ) : (
                    s?.stripeCustomerId
                  )}{' '}
                  — {s?.planLabel ?? s?.plan}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="À faire aujourd’hui" actions={<Link href="/control/taches" className={btn.ghost}>Tout voir</Link>}>
          {tasksLate.length === 0 && tasksToday.length === 0 ? (
            <EmptyState title="Aucune tâche pour aujourd’hui" text="Ajoutez une tâche pour garder le fil." />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {[...tasksLate.map((t: any) => ({ ...t, late: true })), ...tasksToday].map((t: any) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <button onClick={() => completeTask(t.id)} aria-label="Marquer comme terminée" className="h-4 w-4 shrink-0 rounded-[3px] border border-[#BBBBBB] transition-colors hover:border-[#111111] hover:bg-[#111111]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#111111]">{t.title}</p>
                    <p className="text-xs text-[#666666]">
                      {t?.client?.company ? `${t.client.company} · ` : ''}
                      {t.late ? <span className="text-[#991B1B]">En retard · {formatDate(t.dueDate)}</span> : 'Aujourd’hui'}
                    </p>
                  </div>
                  <StatusBadge value={t.priority} label={TASK_PRIORITY_LABELS[t.priority] ?? t.priority} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Prospects à relancer" actions={<Link href="/control/prospects" className={btn.ghost}>Pipeline</Link>}>
          {prospectsFollow.length === 0 ? (
            <EmptyState title="Aucune relance prévue" text="Les prospects avec une date de relance atteinte apparaîtront ici." />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {prospectsFollow.map((p: any) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/control/prospects?focus=${p.id}`} className="truncate text-sm text-[#111111] hover:underline">
                      {p.company}
                    </Link>
                    <p className="text-xs text-[#666666]">
                      {p.nextAction ?? 'Relance'} · {formatDate(p.followUpDate)}
                    </p>
                  </div>
                  <StatusBadge value={p.status} label={PROSPECT_STATUS_LABELS[p.status] ?? p.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Devis en attente de réponse" actions={<Link href="/control/devis" className={btn.ghost}>Devis</Link>}>
          {quotesSent.length === 0 ? (
            <EmptyState title="Aucun devis envoyé" />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {quotesSent.map((q: any) => (
                <li key={q.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#111111]">
                      {q.reference} · {q.title}
                    </p>
                    <p className="text-xs text-[#666666]">
                      {q?.client?.company ?? q?.prospect?.company ?? '—'} · envoyé le {formatDate(q.issuedAt)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatEuro(q.amount)}{q.recurring ? ' /mois' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="7 prochains jours" actions={<Link href="/control/calendrier" className={btn.ghost}>Calendrier</Link>}>
          {upcomingEvents.length === 0 ? (
            <EmptyState title="Aucun rendez-vous planifié" />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {upcomingEvents.map((e: any) => (
                <li key={e.id} className="flex items-center gap-3 py-2.5">
                  <CalendarDays className="h-4 w-4 text-[#999999]" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#111111]">{e.title}</p>
                    <p className="text-xs text-[#666666]">
                      {formatDate(e.startAt, { weekday: 'short', day: 'numeric', month: 'short', hour: e.allDay ? undefined : '2-digit', minute: e.allDay ? undefined : '2-digit' })}
                      {e?.client?.company ? ` · ${e.client.company}` : e?.prospect?.company ? ` · ${e.prospect.company}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <EntityDialog open={dialog === 'task'} onOpenChange={(o) => !o && setDialog(null)} title="Nouvelle tâche" fields={taskFields(clients, projects)} endpoint="/api/admin/tasks" />
      <EntityDialog open={dialog === 'prospect'} onOpenChange={(o) => !o && setDialog(null)} title="Nouveau prospect" fields={prospectFields} endpoint="/api/admin/prospects" />
      <EntityDialog open={dialog === 'client'} onOpenChange={(o) => !o && setDialog(null)} title="Nouveau client" fields={clientFields} endpoint="/api/admin/clients" onSaved={(row: any) => row?.id && router.push(`/control/clients/${row.id}`)} />
      <EntityDialog open={dialog === 'quote'} onOpenChange={(o) => !o && setDialog(null)} title="Nouveau devis" fields={quoteFields(clients, [])} endpoint="/api/admin/quotes" />
    </div>
  );
}
