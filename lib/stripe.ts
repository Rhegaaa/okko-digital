import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { PLAN_LABELS } from '@/lib/constants';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export function mapStripeStatus(status?: string | null): 'ACTIF' | 'PAIEMENT_EN_RETARD' | 'ANNULE' | 'TERMINE' | 'INCOMPLET' {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'ACTIF';
    case 'past_due':
    case 'unpaid':
      return 'PAIEMENT_EN_RETARD';
    case 'canceled':
      return 'ANNULE';
    case 'incomplete':
    case 'incomplete_expired':
      return 'INCOMPLET';
    default:
      return 'TERMINE';
  }
}

function toDate(ts?: number | null): Date | null {
  return ts ? new Date(ts * 1000) : null;
}

function planFromSubscription(sub: Stripe.Subscription): { plan: string; planLabel: string; priceId: string | null; amount: number; interval: string } {
  const item = sub?.items?.data?.[0];
  const price = item?.price;
  const product = price?.product;
  const productMeta = typeof product === 'object' && product && 'metadata' in product ? (product.metadata ?? {}) : {};
  const plan = String(sub?.metadata?.okko_plan ?? price?.metadata?.okko_plan ?? (productMeta as Record<string, string>)?.okko_plan ?? price?.nickname ?? 'AUTRE');
  const productName = typeof product === 'object' && product && 'name' in product ? String(product.name ?? '') : '';
  const planLabel = PLAN_LABELS[plan] ?? productName ?? plan;
  return {
    plan,
    planLabel,
    priceId: price?.id ?? null,
    amount: (price?.unit_amount ?? 0) * (item?.quantity ?? 1),
    interval: price?.recurring?.interval ?? 'month',
  };
}

/** Crée ou met à jour un abonnement local à partir d'un abonnement Stripe. */
export async function upsertSubscriptionFromStripe(sub: Stripe.Subscription) {
  const customerId = typeof sub?.customer === 'string' ? sub.customer : sub?.customer?.id ?? '';
  const client = customerId ? await prisma.client.findUnique({ where: { stripeCustomerId: customerId } }) : null;
  const info = planFromSubscription(sub);
  const item = sub?.items?.data?.[0];
  const periodStart = (item as unknown as { current_period_start?: number })?.current_period_start ?? (sub as unknown as { current_period_start?: number })?.current_period_start ?? null;
  const periodEnd = (item as unknown as { current_period_end?: number })?.current_period_end ?? (sub as unknown as { current_period_end?: number })?.current_period_end ?? null;

  const data = {
    clientId: client?.id ?? null,
    stripeCustomerId: customerId,
    stripePriceId: info.priceId,
    plan: info.plan,
    planLabel: info.planLabel,
    amount: info.amount,
    currency: sub?.currency ?? 'eur',
    interval: info.interval,
    status: mapStripeStatus(sub?.status),
    stripeStatus: sub?.status ?? null,
    currentPeriodStart: toDate(periodStart),
    currentPeriodEnd: toDate(periodEnd),
    cancelAtPeriodEnd: Boolean(sub?.cancel_at_period_end),
    canceledAt: toDate(sub?.canceled_at),
    startedAt: toDate(sub?.start_date ?? sub?.created),
  };

  return prisma.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    update: data,
    create: { ...data, stripeSubscriptionId: sub.id },
  });
}

export async function upsertPaymentFromInvoice(inv: Stripe.Invoice) {
  const customerId = typeof inv?.customer === 'string' ? inv.customer : inv?.customer?.id ?? null;
  const subField = (inv as unknown as { subscription?: string | { id: string } | null })?.subscription
    ?? (inv as unknown as { parent?: { subscription_details?: { subscription?: string | { id: string } } } })?.parent?.subscription_details?.subscription
    ?? null;
  const stripeSubId = typeof subField === 'string' ? subField : subField?.id ?? null;
  const localSub = stripeSubId ? await prisma.subscription.findUnique({ where: { stripeSubscriptionId: stripeSubId } }) : null;
  const client = customerId ? await prisma.client.findUnique({ where: { stripeCustomerId: customerId } }) : null;

  const paidAt = toDate((inv as unknown as { status_transitions?: { paid_at?: number } })?.status_transitions?.paid_at ?? null);
  const data = {
    stripeCustomerId: customerId,
    clientId: client?.id ?? localSub?.clientId ?? null,
    subscriptionId: localSub?.id ?? null,
    amount: inv?.amount_paid ?? inv?.amount_due ?? 0,
    currency: inv?.currency ?? 'eur',
    status: inv?.status ?? 'open',
    paidAt,
    invoiceUrl: inv?.hosted_invoice_url ?? null,
    createdAt: toDate(inv?.created) ?? new Date(),
  };
  return prisma.payment.upsert({
    where: { stripeInvoiceId: inv.id ?? '' },
    update: data,
    create: { ...data, stripeInvoiceId: inv.id ?? '' },
  });
}

/** Synchronise abonnements et factures depuis Stripe (données réelles, aucune invention). */
export async function syncFromStripe(): Promise<{ subscriptions: number; payments: number; error?: string }> {
  const stripe = getStripe();
  if (!stripe) return { subscriptions: 0, payments: 0, error: 'Clé Stripe absente.' };
  let subs = 0;
  let pays = 0;
  try {
    for await (const sub of stripe.subscriptions.list({ status: 'all', limit: 100, expand: ['data.items.data.price.product'] })) {
      await upsertSubscriptionFromStripe(sub);
      subs++;
    }
    for await (const inv of stripe.invoices.list({ limit: 100 })) {
      if (inv?.id) {
        await upsertPaymentFromInvoice(inv);
        pays++;
      }
    }
    return { subscriptions: subs, payments: pays };
  } catch (error) {
    console.error('Stripe sync error', error);
    return { subscriptions: subs, payments: pays, error: (error as Error)?.message ?? 'Erreur Stripe' };
  }
}
