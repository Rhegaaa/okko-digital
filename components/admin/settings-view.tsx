'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageTitle, Card, EmptyState, btn, input } from '@/components/admin/ui';
import { StatusBadge } from '@/components/admin/status-badge';
import { EntityDialog } from '@/components/admin/entity-dialog';
import { showcaseFields } from '@/components/admin/field-defs';
import { CONTACT_STATUS_LABELS, SERVICE_LABELS, formatDate } from '@/lib/constants';

export function SettingsView({ email, name, showcase, submissions, webhookConfigured, contactEmail }: { email: string; name: string; showcase: any[]; submissions: any[]; webhookConfigured: boolean; contactEmail: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | 'new' | null>(null);

  async function patch(resource: string, id: string, body: Record<string, any>) {
    try {
      await fetch(`/api/admin/${resource}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <PageTitle title="Paramètres" description="Compte, intégrations et contenu publié sur le site." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Compte">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#666666]">Nom</dt><dd>{name || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#666666]">Email</dt><dd>{email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#666666]">Email de contact public</dt><dd>{contactEmail || '—'}</dd></div>
          </dl>
        </Card>
        <Card title="Intégrations">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#065F46]" />
              <div><p className="font-medium">Stripe — lecture des abonnements et paiements</p><p className="text-xs text-[#666666]">Synchronisation manuelle disponible depuis la page Abonnements.</p></div>
            </li>
            <li className="flex items-start gap-2">
              {webhookConfigured ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#065F46]" /> : <AlertCircle className="mt-0.5 h-4 w-4 text-[#854D0E]" />}
              <div>
                <p className="font-medium">Webhook Stripe — mises à jour automatiques</p>
                <p className="text-xs text-[#666666]">{webhookConfigured ? 'Configuré.' : 'Secret manquant. Dans Stripe → Développeurs → Webhooks, créez un endpoint vers /api/webhooks/stripe (événements : checkout.session.completed, customer.subscription.*, invoice.paid, invoice.payment_failed) puis renseignez la variable STRIPE_WEBHOOK_SECRET.'}</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#065F46]" />
              <div><p className="font-medium">Emails — formulaire de contact</p><p className="text-xs text-[#666666]">Accusé de réception au demandeur et notification interne.</p></div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Réalisations publiées sur le site" actions={<button className={btn.primary} onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Ajouter</button>}>
          {(showcase?.length ?? 0) === 0 ? (
            <EmptyState title="Aucune réalisation" text="Ajoutez vos vrais projets ici : ils apparaîtront sur la page Réalisations et l’accueil une fois publiés." />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {showcase.map((s: any) => (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <button onClick={() => setEditing(s)} className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-[#666666]">{[s.clientName, SERVICE_LABELS[s.service] ?? s.service, s.year].filter(Boolean).join(' · ')}</p>
                  </button>
                  <button className={btn.ghost} onClick={() => patch('showcase', s.id, { published: !s.published })}>
                    {s.published ? <><Eye className="h-4 w-4" /> Publié</> : <><EyeOff className="h-4 w-4" /> Brouillon</>}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-[#666666]"><Link href="/realisations" target="_blank" className="underline">Voir la page publique</Link></p>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Demandes reçues via le formulaire de contact">
          {(submissions?.length ?? 0) === 0 ? (
            <EmptyState title="Aucune demande pour le moment" />
          ) : (
            <ul className="divide-y divide-[#E7E7E4]">
              {submissions.map((s: any) => (
                <li key={s.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{s.name}{s.company ? ` · ${s.company}` : ''}</p>
                      <p className="text-xs text-[#666666]">{s.email}{s.phone ? ` · ${s.phone}` : ''} · {formatDate(s.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}{s.projectType ? ` · ${s.projectType}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.prospectId ? <Link href={`/control/prospects?focus=${s.prospectId}`} className={btn.ghost}>Voir le prospect</Link> : null}
                      <select value={s.status} onChange={(e) => patch('contact-submissions', s.id, { status: e.target.value })} className={`${input} w-auto py-1.5 text-xs`} aria-label="Statut">
                        {Object.entries(CONTACT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <StatusBadge value={s.status} label={CONTACT_STATUS_LABELS[s.status] ?? s.status} />
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[#444444]">{s.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <EntityDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={editing === 'new' ? 'Nouvelle réalisation' : 'Modifier la réalisation'} fields={showcaseFields} initial={editing === 'new' ? { service: 'SITE_WEB', published: false } : editing} endpoint={editing && editing !== 'new' ? `/api/admin/showcase/${editing.id}` : '/api/admin/showcase'} deletable={editing !== 'new'} />
    </div>
  );
}
