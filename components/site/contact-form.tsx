'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { OkkoButton } from '@/components/site/okko-button';
import { Reveal, EASE } from '@/components/site/motion';

const TYPES = [
  { value: 'PRESENCE_LOCALE', label: 'Présence locale', hint: 'Fiche Google, avis, NFC / QR' },
  { value: 'SITE_WEB', label: 'Site web', hint: 'Vitrine ou boutique en ligne' },
  { value: 'AUTOMATISATION', label: 'Automatisation & IA', hint: 'Relances, emails, outils connectés' },
  { value: 'SOLUTION_METIER', label: 'Solution métier', hint: 'Un logiciel fait pour vous' },
  { value: 'AUTRE', label: 'Je ne sais pas encore', hint: 'On en discute ensemble' },
];

const VALID = TYPES.map((t) => t.value);

type FormState = { name: string; company: string; email: string; phone: string; message: string };

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional ? <span className="text-xs font-normal text-muted-foreground">Facultatif</span> : null}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputCls = 'w-full rounded-[4px] border border-[#E7E7E4] bg-white px-4 py-3.5 text-base outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#111111]/20';

export function ContactForm({ initialProjectType }: { initialProjectType?: string }) {
  const reduce = useReducedMotion();
  const initialValid = initialProjectType && VALID.includes(initialProjectType) ? initialProjectType : null;
  const [projectType, setProjectType] = useState<string | null>(initialValid);
  const [step, setStep] = useState<1 | 2>(initialValid ? 2 : 1);
  const [form, setForm] = useState<FormState>({ name: '', company: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...(f ?? {}), [k]: e?.target?.value ?? '' }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setError(null);
    if (!form?.name?.trim() || !form?.email?.trim() || !form?.message?.trim()) {
      setError('Merci de renseigner au moins votre nom, votre email et votre message.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectType: projectType ?? 'AUTRE', ...(form ?? {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Une erreur est survenue.');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message ?? 'Une erreur est survenue. Réessayez ou écrivez-nous directement par email.');
    }
  }

  const variants = reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };

  return (
    <Reveal delay={0.2}>
      <div className="rounded-[10px] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.2)] sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? (
            <motion.div key="success" {...variants} transition={{ duration: 0.6, ease: EASE }} className="py-6" role="status">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                <Check className="h-5 w-5" strokeWidth={2} />
              </span>
              <h2 className="display-sm mt-8">
                Message bien reçu<span className="serif-accent font-normal">.</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">Merci {form?.name?.split(' ')?.[0] ?? ''}. Nous revenons vers vous sous 48 heures ouvrées. Un accusé de réception vient de vous être envoyé par email.</p>
              <div className="mt-8">
                <OkkoButton href="/" variant="secondary">
                  Retour à l&apos;accueil
                </OkkoButton>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="step1" {...variants} transition={{ duration: 0.5, ease: EASE }}>
              <p className="font-mono text-xs text-muted-foreground">Étape 1 / 2</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight">De quoi s&apos;agit-il ?</h2>
              <ul className="mt-8 grid gap-3" role="list">
                {TYPES.map((t) => (
                  <li key={t.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setProjectType(t.value);
                        setStep(2);
                      }}
                      className="group flex w-full items-center justify-between rounded-[6px] border border-[#E7E7E4] px-5 py-4 text-left transition-all duration-300 hover:border-[#111111] hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30"
                    >
                      <span>
                        <span className="block text-base font-medium">{t.label}</span>
                        <span className="block text-sm text-muted-foreground">{t.hint}</span>
                      </span>
                      <span className="h-2 w-2 rounded-full border border-[#111111]/40 transition-colors duration-300 group-hover:bg-[#111111]" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.form key="step2" {...variants} transition={{ duration: 0.5, ease: EASE }} onSubmit={onSubmit} noValidate>
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-muted-foreground">Étape 2 / 2</p>
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> {TYPES.find((t) => t.value === projectType)?.label ?? 'Changer'}
                </button>
              </div>
              <h2 className="mt-3 text-2xl font-medium tracking-tight">Dites-nous en un peu plus.</h2>
              <div className="mt-8 grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="name" label="Nom">
                    <input id="name" name="name" autoComplete="name" required value={form.name} onChange={update('name')} className={inputCls} placeholder="Votre nom" />
                  </Field>
                  <Field id="company" label="Entreprise" optional>
                    <input id="company" name="company" autoComplete="organization" value={form.company} onChange={update('company')} className={inputCls} placeholder="Nom de votre entreprise" />
                  </Field>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="email" label="Email">
                    <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className={inputCls} placeholder="vous@exemple.fr" />
                  </Field>
                  <Field id="phone" label="Téléphone" optional>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className={inputCls} placeholder="06 …" />
                  </Field>
                </div>
                <Field id="message" label="Votre projet">
                  <textarea id="message" name="message" required rows={5} value={form.message} onChange={update('message')} className={`${inputCls} resize-none`} placeholder="Quelques lignes suffisent : votre activité, ce que vous aimeriez améliorer, vos délais si vous en avez." />
                </Field>
              </div>
              {error ? (
                <p className="mt-4 text-sm text-[#8A1C1C]" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">Vos informations servent uniquement à traiter votre demande. Elles ne sont jamais transmises à des tiers.</p>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3.5 text-sm font-medium text-white transition-all duration-500 ease-okko hover:bg-[#333333] disabled:opacity-60"
                >
                  {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Envoyer ma demande
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
