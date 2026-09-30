import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { getStripe, upsertSubscriptionFromStripe, upsertPaymentFromInvoice } from '@/lib/stripe';
import { createNotification } from '@/lib/notifications';
import { formatEuro } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    console.error('Webhook Stripe : STRIPE_WEBHOOK_SECRET manquant.');
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 500 });
  }
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await request.text();
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (e: any) {
    console.error('Signature webhook invalide', e?.message);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  // Idempotence
  try {
    await prisma.stripeEvent.create({ data: { id: event.id, type: event.type } });
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ received: true, duplicate: true });
    console.error('stripeEvent error', e);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscriptionFromStripe(sub);
        }
        await createNotification({
          type: 'stripe',
          title: 'Nouveau paiement Stripe',
          message: `Session finalisée${session.customer_details?.email ? ` — ${session.customer_details.email}` : ''}${session.amount_total ? ` — ${formatEuro(session.amount_total)}` : ''}`,
          link: '/control/abonnements',
        });
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub);
        if (sub.cancel_at_period_end) {
          await createNotification({ type: 'stripe', title: 'Résiliation programmée', message: `Abonnement ${sub.id} se terminera en fin de période.`, link: '/control/abonnements' });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub);
        await createNotification({ type: 'stripe', title: 'Abonnement résilié', message: `Abonnement ${sub.id} terminé.`, link: '/control/abonnements' });
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const inv = event.data.object as Stripe.Invoice;
        await upsertPaymentFromInvoice(inv);
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice;
        await upsertPaymentFromInvoice(inv);
        await createNotification({
          type: 'alerte',
          title: 'Échec de paiement',
          message: `Facture ${inv.number ?? inv.id} — ${formatEuro(inv.amount_due ?? 0)}${inv.customer_email ? ` — ${inv.customer_email}` : ''}`,
          link: '/control/finances',
        });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Traitement webhook', event.type, e);
    // 200 pour éviter les rejeux infinis ; l'événement est tracé.
  }
  return NextResponse.json({ received: true });
}
