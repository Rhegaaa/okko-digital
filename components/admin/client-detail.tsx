'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Plus, Upload, Download, Trash2, Mail, Phone, Globe, MapPin, Loader2, ExternalLink } from 'lucide-react';
import { Card, EmptyState, Table, Th, Td, btn, input } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { TasksView } from '@/components/admin/tasks-view';
import { clientFields, projectFields, quoteFields, noteFields } from '@/components/admin/field-defs';
import { CLIENT_STATUS_LABELS, SERVICE_LABELS, PROJECT_STATUS_LABELS, QUOTE_STATUS_LABELS, SUBSCRIPTION_STATUS_LABELS, NOTE_TYPE_LABELS, formatDate, formatEuro } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TABS = ['Vue d’ensemble', 'Projets', 'Tâches', 'Devis', 'Abonnements & paiements', 'Documents', 'Notes', 'Historique'] as const;
type Tab = (typeof TABS)[number];

const DOC_CATEGORIES = ['CONTRAT', 'DEVIS', 'FACTURE', 'LIVRABLE', 'AUTRE'];
const DOC_LABELS: Record<string, string> = { CONTRAT: 'Contrat', DEVIS: 'Devis', FACTURE: 'Facture', LIVRABLE: 'Livrable', AUTRE: 'Autre' };

function formatSize(n?: number | null) {
  const v = Number(n ?? 0);
  if (v < 1024) return `${v} o`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(0)} Ko`;
  return `${(v / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ClientDetail({ client, projectOptions }: { client: any; projectOptions: { value: string; label: string }[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Vue d’ensemble');
  const [editClient, setEditClient] = useState(false);
  const [project, setProject] = useState<any | 'new' | null>(null);
  const [quote, setQuote] = useState<any | 'new' | null>(null);
  const [note, setNote] = useState<any | 'new' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [docCategory, setDocCategory] = useState('AUTRE');
  const fileRef = useRef<HTMLInputElement>(null);

  const clientOpt = [{ value: client?.id, label: client?.company }];
  const activeSubs = (client?.subscriptions ?? []).filter((s: any) => ['ACTIF', 'PAIEMENT_EN_RETARD'].includes(s?.status));
  const mrr = activeSubs.reduce((acc: number, s: any) => acc + (s?.interval === 'year' ? Math.round((s?.amount ?? 0) / 12) : s?.amount ?? 0), 0);
  const paidTotal = (client?.payments ?? []).filter((p: any) => p?.status === 'paid').reduce((a: number, p: any) => a + (p?.amount ?? 0), 0);
  const openTasks = (client?.tasks ?? []).filter((t: any) => t?.status !== 'TERMINE');

  const timeline = useMemo(() => {
    const items: { at: string; label: string; detail?: string; kind: string }[] = [];
    for (const p of client?.projects ?? []) items.push({ at: p.createdAt, label: `Projet créé : ${p.name}`, kind: 'Projet' });
    for (const q of client?.quotes ?? []) items.push({ at: q.issuedAt ?? q.createdAt, label: `Devis ${q.reference} — ${q.title}`, detail: `${formatEuro(q.amount)} · ${QUOTE_STATUS_LABELS[q.status] ?? q.status}`, kind: 'Devis' });
    for (const n of client?.clientNotes ?? []) items.push({ at: n.createdAt, label: NOTE_TYPE_LABELS[n.type] ?? 'Note', detail: n.content, kind: 'Note' });
    for (const p of client?.payments ?? []) items.push({ at: p.paidAt ?? p.createdAt, label: `Paiement ${p.status === 'paid' ? 'reçu' : p.status}`, detail: formatEuro(p.amount), kind: 'Paiement' });
    for (const s of client?.subscriptions ?? []) items.push({ at: s.startedAt ?? s.createdAt, label: `Abonnement ${s.planLabel ?? s.plan}`, detail: SUBSCRIPTION_STATUS_LABELS[s.status] ?? s.status, kind: 'Abonnement' });
    for (const d of client?.documents ?? []) items.push({ at: d.createdAt, label: `Document ajouté : ${d.name}`, kind: 'Document' });
    for (const e of client?.events ?? []) items.push({ at: e.startAt, label: `${e.kind ?? 'RDV'} : ${e.title}`, kind: 'Agenda' });
    for (const t of (client?.tasks ?? []).filter((t: any) => t?.completedAt)) items.push({ at: t.completedAt, label: `Tâche terminée : ${t.title}`, kind: 'Tâche' });
    return items.filter((i) => i.at).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [client]);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const pres = await fetch('/api/admin/documents/presigned', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: file.name, contentType: file.type || 'application/octet-stream' }) });
      const { uploadUrl, cloud_storage_path, error } = await pres.json();
      if (!pres.ok || !uploadUrl) throw new Error(error ?? 'Préparation impossible');
      const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      if (!put.ok) throw new Error('Téléversement refusé');
      const done = await fetch('/api/admin/documents/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: client.id, cloud_storage_path, name: file.name, category: docCategory, contentType: file.type, size: file.size }) });
      if (!done.ok) throw new Error('Enregistrement impossible');
      toast.success('Document ajouté');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? 'Erreur lors de l’envoi');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function download(id: string) {
    try {
      const res = await fetch(`/api/admin/documents/url?id=${encodeURIComponent(id)}`);
      const { url } = await res.json();
      if (!url) throw new Error();
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast.error('Téléchargement impossible');
    }
  }

  async function removeDoc(id: string) {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
      toast.success('Document supprimé');
      router.refresh();
    } catch {
      toast.error('Suppression impossible');
    }
  }

  return (
    <div>
      <Link href="/control/clients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#111111]">
        <ArrowLeft className="h-4 w-4" /> Clients
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">{client?.company}</h1>
            <StatusBadge value={client?.status} label={CLIENT_STATUS_LABELS[client?.status] ?? client?.status} />
          </div>
          <p className="mt-1 text-sm text-[#666666]">{client?.contactName}{client?.city ? ` · ${client.city}` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(client?.services ?? []).map((s: string) => (
              <span key={s} className="rounded-full bg-[#F7F7F5] px-2 py-0.5 text-xs text-[#444444]">{SERVICE_LABELS[s] ?? s}</span>
            ))}
          </div>
        </div>
        <button className={btn.secondary} onClick={() => setEditClient(true)}>
          <Pencil className="h-4 w-4" /> Modifier
        </button>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#E7E7E4]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors', tab === t ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Vue d’ensemble' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Identité" className="lg:col-span-1">
            <dl className="space-y-3 text-sm">
              {client?.email ? <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#999999]" /><a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a></div> : null}
              {client?.phone ? <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#999999]" /><a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a></div> : null}
              {client?.website ? <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#999999]" /><a href={client.website} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{client.website}</a></div> : null}
              {client?.address || client?.city ? <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#999999]" /><span>{[client?.address, client?.city].filter(Boolean).join(', ')}</span></div> : null}
              <div className="pt-2 text-xs text-[#666666]">Client depuis le {formatDate(client?.createdAt)}</div>
              {client?.stripeCustomerId ? <div className="text-xs text-[#666666]">Stripe : {client.stripeCustomerId}</div> : null}
            </dl>
            {client?.notes ? <p className="mt-4 whitespace-pre-wrap rounded-[4px] bg-[#F7F7F5] p-3 text-sm text-[#444444]">{client.notes}</p> : null}
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <Stat label="Abonnement mensuel" value={mrr > 0 ? `${formatEuro(mrr)} /mois` : '—'} hint={activeSubs.length ? `${activeSubs.length} abonnement(s) actif(s)` : 'Aucun abonnement actif'} />
            <Stat label="Total encaissé" value={formatEuro(paidTotal)} hint="Paiements Stripe confirmés" />
            <Stat label="Projets" value={client?.projects?.length ?? 0} hint={`${(client?.projects ?? []).filter((p: any) => p?.status !== 'TERMINE').length} en cours`} />
            <Stat label="Tâches ouvertes" value={openTasks.length} hint={openTasks.filter((t: any) => t?.dueDate && new Date(t.dueDate) < new Date()).length ? `${openTasks.filter((t: any) => t?.dueDate && new Date(t.dueDate) < new Date()).length} en retard` : undefined} />
          </div>
        </div>
      ) : null}

      {tab === 'Projets' ? (
        <Card title="Projets" actions={<button className={btn.primary} onClick={() => setProject('new')}><Plus className="h-4 w-4" /> Projet</button>}>
          {(client?.projects?.length ?? 0) === 0 ? (
            <EmptyState title="Aucun projet" />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {client.projects.map((p: any) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <button onClick={() => setProject(p)} className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-[#666666]">{SERVICE_LABELS[p.service] ?? p.service}{p?.dueDate ? ` · échéance ${formatDate(p.dueDate)}` : ''}{p?.budget ? ` · ${formatEuro(p.budget)}` : ''}</p>
                  </button>
                  <StatusBadge value={p.status} label={PROJECT_STATUS_LABELS[p.status] ?? p.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {tab === 'Tâches' ? (
        <Card title="Tâches">
          <TasksView tasks={client?.tasks ?? []} clients={clientOpt} projects={projectOptions} embedded presetClientId={client?.id} />
        </Card>
      ) : null}

      {tab === 'Devis' ? (
        <Card title="Devis" actions={<button className={btn.primary} onClick={() => setQuote('new')}><Plus className="h-4 w-4" /> Devis</button>}>
          {(client?.quotes?.length ?? 0) === 0 ? (
            <EmptyState title="Aucun devis" />
          ) : (
            <Table>
              <thead><tr className="border-b border-[#E7E7E4]"><Th>Réf.</Th><Th>Intitulé</Th><Th>Montant</Th><Th>Émis le</Th><Th>Statut</Th></tr></thead>
              <tbody className="divide-y divide-[#E7E7E4]">
                {client.quotes.map((q: any) => (
                  <tr key={q.id} className="cursor-pointer hover:bg-[#FAFAF8]" onClick={() => setQuote(q)}>
                    <Td className="font-mono text-xs">{q.reference}</Td>
                    <Td>{q.title}</Td>
                    <Td>{formatEuro(q.amount)}{q.recurring ? ' /mois' : ''}</Td>
                    <Td>{formatDate(q.issuedAt)}</Td>
                    <Td><StatusBadge value={q.status} label={QUOTE_STATUS_LABELS[q.status] ?? q.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      ) : null}

      {tab === 'Abonnements & paiements' ? (
        <div className="space-y-6">
          <Card title="Abonnements">
            {(client?.subscriptions?.length ?? 0) === 0 ? (
              <EmptyState title="Aucun abonnement" text={client?.stripeCustomerId ? 'Lancez une synchronisation Stripe depuis la page Abonnements.' : 'Renseignez l’identifiant client Stripe pour relier les abonnements.'} />
            ) : (
              <Table>
                <thead><tr className="border-b border-[#E7E7E4]"><Th>Formule</Th><Th>Montant</Th><Th>Période en cours</Th><Th>Statut</Th></tr></thead>
                <tbody className="divide-y divide-[#E7E7E4]">
                  {client.subscriptions.map((s: any) => (
                    <tr key={s.id}>
                      <Td>{s.planLabel ?? s.plan}</Td>
                      <Td>{formatEuro(s.amount)} / {s.interval === 'year' ? 'an' : 'mois'}</Td>
                      <Td className="text-xs text-[#666666]">{s.currentPeriodStart ? `${formatDate(s.currentPeriodStart)} → ${formatDate(s.currentPeriodEnd)}` : '—'}{s.cancelAtPeriodEnd ? ' · résiliation programmée' : ''}</Td>
                      <Td><StatusBadge value={s.status} label={SUBSCRIPTION_STATUS_LABELS[s.status] ?? s.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
          <Card title="Paiements">
            {(client?.payments?.length ?? 0) === 0 ? (
              <EmptyState title="Aucun paiement enregistré" />
            ) : (
              <Table>
                <thead><tr className="border-b border-[#E7E7E4]"><Th>Date</Th><Th>Montant</Th><Th>Statut</Th><Th>Facture</Th></tr></thead>
                <tbody className="divide-y divide-[#E7E7E4]">
                  {client.payments.map((p: any) => (
                    <tr key={p.id}>
                      <Td>{formatDate(p.paidAt ?? p.createdAt)}</Td>
                      <Td>{formatEuro(p.amount)}</Td>
                      <Td><StatusBadge value={p.status} label={p.status === 'paid' ? 'Payé' : p.status === 'open' ? 'En attente' : p.status} /></Td>
                      <Td>{p.invoiceUrl ? <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs hover:underline">Voir <ExternalLink className="h-3 w-3" /></a> : '—'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </div>
      ) : null}

      {tab === 'Documents' ? (
        <Card
          title="Documents"
          actions={
            <div className="flex items-center gap-2">
              <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} className={`${input} w-auto py-1.5`} aria-label="Catégorie">
                {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{DOC_LABELS[c]}</option>)}
              </select>
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
              <button className={btn.primary} disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Ajouter
              </button>
            </div>
          }
        >
          {(client?.documents?.length ?? 0) === 0 ? (
            <EmptyState title="Aucun document" text="Contrats, devis signés, livrables… stockés de manière sécurisée." />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {client.documents.map((d: any) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{d.name}</p>
                    <p className="text-xs text-[#666666]">{DOC_LABELS[d.category] ?? d.category} · {formatSize(d.size)} · {formatDate(d.createdAt)}</p>
                  </div>
                  <button className={btn.ghost} onClick={() => download(d.id)} aria-label="Télécharger"><Download className="h-4 w-4" /></button>
                  <button className={btn.danger} onClick={() => removeDoc(d.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {tab === 'Notes' ? (
        <Card title="Notes internes" actions={<button className={btn.primary} onClick={() => setNote('new')}><Plus className="h-4 w-4" /> Note</button>}>
          {(client?.clientNotes?.length ?? 0) === 0 ? (
            <EmptyState title="Aucune note" text="Comptes rendus d’appel, décisions, points d’attention." />
          ) : (
            <ul className="space-y-3">
              {client.clientNotes.map((n: any) => (
                <li key={n.id} className="rounded-[4px] bg-[#F7F7F5] p-4">
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-[#666666]">
                    <span className="font-medium text-[#444444]">{NOTE_TYPE_LABELS[n.type] ?? n.type}</span>
                    <span className="flex items-center gap-3">{formatDate(n.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<button onClick={() => setNote(n)} className="hover:text-[#111111]">Modifier</button></span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[#111111]">{n.content}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {tab === 'Historique' ? (
        <Card title="Historique">
          {timeline.length === 0 ? (
            <EmptyState title="Aucune activité pour le moment" />
          ) : (
            <ol className="relative ml-2 border-l border-[#E7E7E4]">
              {timeline.map((i, idx) => (
                <li key={idx} className="relative pb-5 pl-6">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#111111]" />
                  <p className="text-xs text-[#666666]">{formatDate(i.at, { day: 'numeric', month: 'short', year: 'numeric' })} · {i.kind}</p>
                  <p className="text-sm text-[#111111]">{i.label}</p>
                  {i.detail ? <p className="mt-0.5 line-clamp-2 text-sm text-[#666666]">{i.detail}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </Card>
      ) : null}

      <EntityDialog open={editClient} onOpenChange={setEditClient} title="Modifier le client" fields={clientFields} initial={client} endpoint={`/api/admin/clients/${client?.id}`} deletable onDeleted={() => router.push('/control/clients')} />
      <EntityDialog open={project !== null} onOpenChange={(o) => !o && setProject(null)} title={project === 'new' ? 'Nouveau projet' : 'Modifier le projet'} fields={projectFields(clientOpt)} initial={project === 'new' ? { clientId: client?.id, status: 'A_PREPARER' } : project} endpoint={project && project !== 'new' ? `/api/admin/projects/${project.id}` : '/api/admin/projects'} deletable={project !== 'new'} />
      <EntityDialog open={quote !== null} onOpenChange={(o) => !o && setQuote(null)} title={quote === 'new' ? 'Nouveau devis' : 'Modifier le devis'} fields={quoteFields(clientOpt, [])} initial={quote === 'new' ? { clientId: client?.id, status: 'BROUILLON' } : quote} endpoint={quote && quote !== 'new' ? `/api/admin/quotes/${quote.id}` : '/api/admin/quotes'} deletable={quote !== 'new'} />
      <EntityDialog open={note !== null} onOpenChange={(o) => !o && setNote(null)} title={note === 'new' ? 'Nouvelle note' : 'Modifier la note'} fields={[...noteFields, { name: 'clientId', label: 'Client', type: 'hidden' }]} initial={note === 'new' ? { clientId: client?.id, type: 'INTERNE' } : note} endpoint={note && note !== 'new' ? `/api/admin/notes/${note.id}` : '/api/admin/notes'} deletable={note !== 'new'} />
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-[6px] border border-[#E7E7E4] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[#666666]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#111111]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#666666]">{hint}</p> : null}
    </div>
  );
}
