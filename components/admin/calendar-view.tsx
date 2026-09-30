'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PageTitle, Card, btn } from '@/components/admin/ui';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { eventFields, type Option } from '@/components/admin/field-defs';
import { cn } from '@/lib/utils';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function CalendarView({ events, tasks, clients, prospects }: { events: any[]; tasks: any[]; clients: Option[]; prospects: Option[] }) {
  const [cursor, setCursor] = useState<Date>(() => new Date(2026, 0, 1));
  const [todayKey, setTodayKey] = useState('');
  useEffect(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    setCursor(d);
    setTodayKey(key(new Date()));
  }, []);
  const [mode, setMode] = useState<'mois' | 'semaine'>('mois');
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [newDate, setNewDate] = useState<string>('');

  const items = useMemo(() => {
    const m: Record<string, any[]> = {};
    for (const e of events ?? []) {
      const d = new Date(e?.startAt);
      if (Number.isNaN(d.getTime())) continue;
      (m[key(d)] ??= []).push({ ...e, _type: 'event' });
    }
    for (const t of tasks ?? []) {
      const d = new Date(t?.dueDate);
      if (Number.isNaN(d.getTime())) continue;
      (m[key(d)] ??= []).push({ id: t.id, title: t.title, allDay: true, _type: 'task', priority: t.priority });
    }
    return m;
  }, [events, tasks]);

  const days = useMemo(() => {
    const out: Date[] = [];
    if (mode === 'mois') {
      const first = new Date(cursor);
      const offset = (first.getDay() + 6) % 7;
      const start = new Date(first.getTime() - offset * 86400000);
      for (let i = 0; i < 42; i++) out.push(new Date(start.getTime() + i * 86400000));
    } else {
      const offset = (cursor.getDay() + 6) % 7;
      const start = new Date(cursor.getTime() - offset * 86400000);
      for (let i = 0; i < 7; i++) out.push(new Date(start.getTime() + i * 86400000));
    }
    return out;
  }, [cursor, mode]);

  function shift(n: number) {
    const d = new Date(cursor);
    if (mode === 'mois') d.setMonth(d.getMonth() + n);
    else d.setDate(d.getDate() + 7 * n);
    setCursor(d);
  }
  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (mode === 'mois') d.setDate(1);
    setCursor(d);
  }
  const label = mode === 'mois' ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}` : `Semaine du ${days[0]?.getDate()} ${MONTHS[days[0]?.getMonth() ?? 0]} ${days[0]?.getFullYear()}`;

  function openNew(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    setNewDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`);
    setEditing('new');
  }

  return (
    <div>
      <PageTitle
        title="Calendrier"
        description="Rendez-vous, appels et échéances de tâches."
        actions={
          <>
            <div className="flex rounded-[4px] border border-[#E7E7E4] bg-white p-0.5 text-sm">
              <button onClick={() => { setMode('mois'); const d = new Date(cursor); d.setDate(1); setCursor(d); }} className={cn('rounded-[3px] px-3 py-1', mode === 'mois' ? 'bg-[#111111] text-white' : 'text-[#666666]')}>Mois</button>
              <button onClick={() => { setMode('semaine'); const d = new Date(); d.setHours(0, 0, 0, 0); setCursor(d); }} className={cn('rounded-[3px] px-3 py-1', mode === 'semaine' ? 'bg-[#111111] text-white' : 'text-[#666666]')}>Semaine</button>
            </div>
            <button className={btn.primary} onClick={() => openNew(new Date())}><Plus className="h-4 w-4" /> Événement</button>
          </>
        }
      />
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className={btn.ghost} onClick={() => shift(-1)} aria-label="Précédent"><ChevronLeft className="h-4 w-4" /></button>
            <button className={btn.ghost} onClick={today}>Aujourd’hui</button>
            <button className={btn.ghost} onClick={() => shift(1)} aria-label="Suivant"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <p className="text-sm font-semibold capitalize text-[#111111]">{label}</p>
        </div>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-[4px] border border-[#E7E7E4] bg-[#E7E7E4]">
          {DAYS.map((d) => <div key={d} className="bg-[#F7F7F5] px-2 py-1.5 text-center text-xs font-medium uppercase tracking-wide text-[#666666]">{d}</div>)}
          {days.map((d) => {
            const k = key(d);
            const inMonth = mode === 'semaine' || d.getMonth() === cursor.getMonth();
            const list = items[k] ?? [];
            return (
              <div key={k} className={cn('flex flex-col bg-white p-1.5', mode === 'mois' ? 'min-h-[96px]' : 'min-h-[260px]', !inMonth && 'bg-[#FAFAF8]')}>
                <div className="mb-1 flex items-center justify-between">
                  <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-xs', k === todayKey ? 'bg-[#111111] font-semibold text-white' : inMonth ? 'text-[#111111]' : 'text-[#BBBBBB]')}>{d.getDate()}</span>
                  <button onClick={() => openNew(d)} className="text-[#BBBBBB] hover:text-[#111111]" aria-label="Ajouter"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <div className="space-y-1">
                  {list.slice(0, mode === 'mois' ? 3 : 20).map((it: any) => (
                    <button key={`${it._type}-${it.id}`} onClick={() => it._type === 'event' && setEditing(it)} className={cn('block w-full truncate rounded-[3px] px-1.5 py-0.5 text-left text-xs', it._type === 'task' ? 'bg-[#F7F7F5] text-[#666666]' : 'bg-[#111111] text-white')} title={it.title}>
                      {it._type === 'event' && !it.allDay ? `${new Date(it.startAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ` : ''}{it.title}
                    </button>
                  ))}
                  {list.length > 3 && mode === 'mois' ? <p className="px-1 text-xs text-[#999999]">+{list.length - 3}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[#666666]">Noir : rendez-vous et événements · Gris : échéances de tâches.</p>
      </Card>
      <EntityDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={editing === 'new' ? 'Nouvel événement' : 'Modifier l’événement'} fields={eventFields(clients, prospects)} initial={editing === 'new' ? { startAt: newDate, kind: 'RDV' } : editing} endpoint={editing && editing !== 'new' ? `/api/admin/events/${editing.id}` : '/api/admin/events'} deletable={editing !== 'new'} />
    </div>
  );
}
