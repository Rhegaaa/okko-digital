'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { btn, input } from '@/components/admin/ui';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', { email: email?.trim?.() ?? '', password, redirect: false });
      if (res?.error) {
        setError('Identifiants incorrects.');
      } else {
        router.replace('/control');
      }
    } catch {
      setError('Connexion impossible pour le moment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#444444]">
          Email
        </label>
        <input id="email" type="email" autoComplete="email" required className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#444444]">
          Mot de passe
        </label>
        <input id="password" type="password" autoComplete="current-password" required className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error ? (
        <p role="alert" className="rounded-[4px] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={loading} className={`${btn.primary} w-full justify-center`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Se connecter
      </button>
    </form>
  );
}
