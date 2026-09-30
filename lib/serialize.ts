/** Convertit récursivement Date → ISO string et BigInt → number pour passer des données Prisma aux composants clients. */
export function toPlain<T = any>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (value instanceof Date) return (Number.isNaN(value.getTime()) ? null : value.toISOString()) as T;
  if (typeof value === 'bigint') return Number(value) as T;
  if (Array.isArray(value)) return value.map((v) => toPlain(v)) as T;
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = toPlain(v);
    return out as T;
  }
  return value as T;
}

export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
