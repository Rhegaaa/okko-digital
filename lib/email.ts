import { Resend } from 'resend';
import { SITE, SERVICE_LABELS } from '@/lib/constants';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = `OKKO Digital <${process.env.CONTACT_EMAIL ?? 'contact@okko-digital.fr'}>`;
const ADMIN_TO = process.env.ADMIN_NOTIFY_EMAIL ?? process.env.CONTACT_EMAIL ?? 'contact@okko-digital.fr';

function escapeHtml(s?: string | null) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shell(inner: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F7F7F5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111111">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px">
    <div style="font-weight:700;letter-spacing:0.18em;font-size:12px;text-transform:uppercase;margin-bottom:32px">OKKO Digital</div>
    <div style="background:#FFFFFF;border:1px solid #E7E7E4;padding:32px">${inner}</div>
    <p style="color:#666666;font-size:12px;margin-top:24px;line-height:1.6">OKKO Digital — ${SITE.city}<br/>${SITE.email}</p>
  </div></body></html>`;
}

export type ContactPayload = {
  projectType: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
};

export async function sendContactEmails(payload: ContactPayload): Promise<{ admin: boolean; visitor: boolean }> {
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY manquante : emails non envoyés.');
    return { admin: false, visitor: false };
  }
  const service = SERVICE_LABELS[payload?.projectType ?? ''] ?? 'Autre';
  const result = { admin: false, visitor: false };

  try {
    await resend.emails.send({
      from: FROM,
      to: [ADMIN_TO],
      replyTo: payload.email,
      subject: `Nouvelle demande — ${service} — ${payload.name}`,
      html: shell(`
        <h1 style="font-size:22px;margin:0 0 8px;font-weight:600">Nouvelle demande de contact</h1>
        <p style="color:#666666;margin:0 0 24px">Reçue depuis le site okko-digital.fr</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#666666;width:140px">Projet</td><td style="padding:8px 0">${escapeHtml(service)}</td></tr>
          <tr><td style="padding:8px 0;color:#666666">Nom</td><td style="padding:8px 0">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#666666">Entreprise</td><td style="padding:8px 0">${escapeHtml(payload.company) || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(payload.email)}" style="color:#111">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666666">Téléphone</td><td style="padding:8px 0">${escapeHtml(payload.phone) || '—'}</td></tr>
        </table>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #E7E7E4;white-space:pre-wrap;line-height:1.6;font-size:15px">${escapeHtml(payload.message)}</div>
      `),
    });
    result.admin = true;
  } catch (error) {
    console.error('Resend admin email error', error);
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: [payload.email],
      replyTo: SITE.email,
      subject: 'Nous avons bien reçu votre message',
      html: shell(`
        <h1 style="font-size:22px;margin:0 0 16px;font-weight:600">Merci, ${escapeHtml(payload.name)}.</h1>
        <p style="line-height:1.7;font-size:15px;margin:0 0 16px">Votre message concernant <strong>${escapeHtml(service)}</strong> nous est bien parvenu. Nous le lisons avec attention et revenons vers vous rapidement, généralement sous un jour ouvré.</p>
        <p style="line-height:1.7;font-size:15px;margin:0 0 24px">Si vous souhaitez ajouter un élément, répondez simplement à cet email.</p>
        <div style="padding:16px;background:#F7F7F5;border-left:2px solid #111;white-space:pre-wrap;color:#666666;font-size:14px;line-height:1.6">${escapeHtml(payload.message)}</div>
        <p style="margin:32px 0 0;font-size:15px">À très vite,<br/><strong>Lorenzo — OKKO Digital</strong></p>
      `),
    });
    result.visitor = true;
  } catch (error) {
    console.error('Resend visitor email error', error);
  }
  return result;
}
