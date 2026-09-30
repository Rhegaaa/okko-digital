import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized, serverError } from '@/lib/admin-api';
import { syncFromStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const result = await syncFromStripe();
    if (result?.error) return NextResponse.json({ error: result.error }, { status: 502 });
    return NextResponse.json(result);
  } catch (e) {
    return serverError(e, 'Synchronisation Stripe impossible');
  }
}
