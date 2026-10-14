import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'admin') return null;
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
}

export function badRequest(message = 'Requête invalide') {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(error: unknown, message = 'Erreur serveur') {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJson(request: Request): Promise<Record<string, any>> {
  try {
    const b = await request.json();
    return b && typeof b === 'object' ? b : {};
  } catch {
    return {};
  }
}

/* ---- Petits parseurs sûrs ---- */
export const str = (v: unknown, max = 2000): string | undefined => (v === undefined ? undefined : String(v ?? '').trim().slice(0, max));
export const strOrNull = (v: unknown, max = 2000): string | null | undefined => {
  if (v === undefined) return undefined;
  const s = String(v ?? '').trim().slice(0, max);
  return s ? s : null;
};
export const dateOrNull = (v: unknown): Date | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
};
export const intOrNull = (v: unknown): number | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : null;
};
export const bool = (v: unknown): boolean | undefined => (v === undefined ? undefined : v === true || v === 'true' || v === 1 || v === '1');
export const enumOf = (v: unknown, allowed: string[], fallback?: string): string | undefined => {
  if (v === undefined) return fallback;
  const s = String(v ?? '');
  return allowed.includes(s) ? s : fallback;
};
export const enumArray = (v: unknown, allowed: string[]): string[] | undefined => {
  if (v === undefined) return undefined;
  const arr = Array.isArray(v) ? v : [];
  return arr.map((x) => String(x)).filter((x) => allowed.includes(x));
};

/** Retire les clés undefined (pour les PATCH partiels). */
export function compact<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj ?? {})) if (v !== undefined) out[k] = v;
  return out as Partial<T>;
}
