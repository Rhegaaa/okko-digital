'use client';

import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { btn, input } from '@/components/admin/ui';

export type FieldDef = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'euros' | 'multiselect' | 'checkbox' | 'email' | 'url' | 'datetime' | 'hidden';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
  hint?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial?: Record<string, any> | null;
  endpoint: string; // ex: /api/admin/clients ou /api/admin/clients/ID
  method?: 'POST' | 'PATCH';
  onSaved?: (row: any) => void;
  onDeleted?: () => void;
  deletable?: boolean;
  extraFooter?: ReactNode;
};

function toInputDate(v: unknown, withTime = false) {
  if (!v) return '';
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return withTime ? `${base}T${pad(d.getHours())}:${pad(d.getMinutes())}` : base;
}

function initialValues(fields: FieldDef[], initial?: Record<string, any> | null) {
  const out: Record<string, any> = {};
  for (const f of fields ?? []) {
    const v = initial?.[f.name];
    if (f.type === 'multiselect') out[f.name] = Array.isArray(v) ? v : [];
    else if (f.type === 'checkbox') out[f.name] = !!v;
    else if (f.type === 'date') out[f.name] = toInputDate(v);
    else if (f.type === 'datetime') out[f.name] = toInputDate(v, true);
    else if (f.type === 'euros') out[f.name] = v === null || v === undefined ? '' : String((Number(v) || 0) / 100);
    else out[f.name] = v === null || v === undefined ? '' : String(v);
  }
  return out;
}

export function EntityDialog({ open, onOpenChange, title, description, fields, initial, endpoint, method, onSaved, onDeleted, deletable, extraFooter }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, any>>(() => initialValues(fields, initial));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initialValues(fields, initial));
      setConfirmDelete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const visibleFields = (fields ?? []).filter((f) => f.type !== 'hidden');
  const set = (name: string, v: any) => setValues((s) => ({ ...(s ?? {}), [name]: v }));
  const isEdit = method === 'PATCH' || (!!initial?.id && method !== 'POST');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const payload: Record<string, any> = {};
    for (const f of fields ?? []) {
      const v = values?.[f.name];
      if (f.type === 'euros') payload[f.name] = v === '' ? null : Math.round(Number(String(v).replace(',', '.')) * 100);
      else if (f.type === 'number') payload[f.name] = v === '' ? null : Number(v);
      else payload[f.name] = v;
    }
    try {
      const res = await fetch(endpoint, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Erreur');
      toast.success(isEdit ? 'Modifications enregistrées' : 'Créé avec succès');
      onOpenChange(false);
      onSaved?.(data);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('Suppression impossible');
      toast.success('Supprimé');
      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[6px] border-[#E7E7E4] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : <DialogDescription className="sr-only">Formulaire</DialogDescription>}
        </DialogHeader>
        <form onSubmit={submit} className="mt-2 grid gap-4 sm:grid-cols-2">
          {visibleFields.map((f) => {
            const id = `f-${f.name}`;
            const wrap = f.half ? '' : 'sm:col-span-2';
            const v = values?.[f.name];
            return (
              <div key={f.name} className={wrap}>
                {f.type !== 'checkbox' ? (
                  <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-[#444444]">
                    {f.label}
                    {f.required ? <span className="text-[#999999]"> *</span> : null}
                  </label>
                ) : null}
                {f.type === 'textarea' ? (
                  <textarea id={id} rows={4} value={v ?? ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} required={f.required} className={`${input} resize-y`} />
                ) : f.type === 'select' ? (
                  <select id={id} value={v ?? ''} onChange={(e) => set(f.name, e.target.value)} required={f.required} className={input}>
                    {!f.required ? <option value="">—</option> : null}
                    {(f.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'multiselect' ? (
                  <div className="flex flex-wrap gap-2">
                    {(f.options ?? []).map((o) => {
                      const on = Array.isArray(v) && v.includes(o.value);
                      return (
                        <button key={o.value} type="button" onClick={() => set(f.name, on ? (v ?? []).filter((x: string) => x !== o.value) : [...(v ?? []), o.value])} className={`rounded-full border px-3 py-1 text-xs transition-colors ${on ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E7E7E4] bg-white text-[#444444] hover:bg-[#F7F7F5]'}`}>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2.5 text-sm text-[#111111]">
                    <input id={id} type="checkbox" checked={!!v} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 rounded border-[#E7E7E4] accent-[#111111]" />
                    {f.label}
                  </label>
                ) : (
                  <input
                    id={id}
                    type={f.type === 'euros' ? 'number' : f.type === 'datetime' ? 'datetime-local' : f.type ?? 'text'}
                    step={f.type === 'euros' ? '0.01' : undefined}
                    min={f.type === 'euros' || f.type === 'number' ? '0' : undefined}
                    value={v ?? ''}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    required={f.required}
                    className={input}
                  />
                )}
                {f.hint ? <p className="mt-1 text-xs text-[#999999]">{f.hint}</p> : null}
              </div>
            );
          })}
          <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">
            <div>
              {deletable && isEdit ? (
                <button type="button" onClick={remove} disabled={saving} className={btn.danger}>
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  {confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
                </button>
              ) : null}
              {extraFooter}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onOpenChange(false)} className={btn.secondary}>
                Annuler
              </button>
              <button type="submit" disabled={saving} className={btn.primary}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
