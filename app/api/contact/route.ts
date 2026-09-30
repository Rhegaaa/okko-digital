import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendContactEmails } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import { SERVICE_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const VALID_TYPES = ['PRESENCE_LOCALE', 'SITE_WEB', 'AUTOMATISATION', 'SOLUTION_METIER', 'AUTRE'];

function clean(v: unknown, max = 500): string {
  return String(v ?? '').trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const name = clean(body?.name, 120);
  const email = clean(body?.email, 200).toLowerCase();
  const company = clean(body?.company, 160) || null;
  const phone = clean(body?.phone, 40) || null;
  const message = clean(body?.message, 5000);
  const projectType = VALID_TYPES.includes(String(body?.projectType ?? '')) ? String(body.projectType) : 'AUTRE';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Nom, email et message sont obligatoires.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  try {
    const prospect = await prisma.prospect.create({
      data: {
        company: company ?? name,
        contactName: name,
        email,
        phone,
        source: 'Formulaire site',
        service: projectType as any,
        notes: message,
        status: 'NOUVEAU',
      },
    });

    const submission = await prisma.contactSubmission.create({
      data: { projectType: projectType as any, name, company, email, phone, message, prospectId: prospect?.id ?? null },
    });

    await createNotification({
      type: 'contact',
      title: 'Nouvelle demande de contact',
      message: `${name}${company ? ` (${company})` : ''} — ${SERVICE_LABELS[projectType] ?? 'Autre'}`,
      link: `/control/prospects?focus=${prospect?.id ?? ''}`,
    });

    // Emails : ne bloquent jamais la réponse.
    sendContactEmails({ projectType, name, company, email, phone, message }).catch((e) => console.error('email error', e));

    return NextResponse.json({ ok: true, id: submission?.id ?? null });
  } catch (error) {
    console.error('contact error', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer votre demande pour le moment.' }, { status: 500 });
  }
}
