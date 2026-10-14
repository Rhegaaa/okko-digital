import { z } from 'zod';

export const ACTION_KINDS = { ACCESS: 'Accès gestionnaire', AUDIT: 'Audit initial', INFO: 'Informations et services', REVIEWS: 'Avis', PHOTOS: 'Photos', POST: 'Publication', HOURS: 'Horaires', REPORT: 'Bilan', OTHER: 'Autre action' } as const;
export type ActionKind = keyof typeof ACTION_KINDS;
export function parisToday(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function addDays(date: string, days: number) {
  const d = new Date(`${date.slice(0, 10)}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function googleUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && (u.hostname === 'google.com' || u.hostname.endsWith('.google.com') || u.hostname === 'google.fr' || u.hostname.endsWith('.google.fr') || u.hostname === 'maps.app.goo.gl' || u.hostname === 'g.page');
  } catch { return false; }
}
const url = z.string().trim().max(1500).refine(googleUrl, 'Utilisez un lien Google en https.');
const optionalUrl = z.union([url, z.literal('')]).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(new Date(v).getTime()) && new Date(v).toISOString().slice(0,10) === v, 'Date invalide.');
export const profileInput = z.object({
  company: z.string().trim().min(1).max(200), contactName: z.string().trim().min(1).max(200),
  email: z.union([z.string().email().max(200), z.literal('')]).optional(), phone: z.string().trim().max(60).optional(), city: z.string().trim().max(120).optional(),
  mapsUrl: url, manageUrl: optionalUrl, reviewsUrl: optionalUrl, photosUrl: optionalUrl,
  accessConfirmed: z.boolean().default(false),
  startDate: date, reviewDays: z.number().int().min(1).max(90).default(1), photoDays: z.number().int().min(1).max(365).default(30), postDays: z.number().int().min(1).max(365).default(14), reportDays: z.number().int().min(1).max(365).default(30),
});
export const actionInput = z.object({ profileId: z.string().min(1), kind: z.enum(['ACCESS','AUDIT','INFO','REVIEWS','PHOTOS','POST','HOURS','REPORT','OTHER']), title: z.string().trim().min(1).max(300), detail: z.string().trim().max(4000).optional(), quantity: z.number().int().min(1).max(10000).nullable().optional(), dueDate: date, cadenceDays: z.number().int().min(1).max(365).nullable().optional() });
export const actionUpdate = z.object({ status: z.enum(['A_FAIRE','EN_ATTENTE','TERMINE']).optional(), dueDate: date.optional(), detail: z.string().trim().max(4000).optional() }).refine(v => Object.keys(v).length > 0);
export function initialActions(v: z.infer<typeof profileInput>) {
  const at = (day: string) => new Date(`${day}T12:00:00Z`);
  const rows = [
    ...(!v.accessConfirmed ? [{ kind: 'ACCESS', title: 'Obtenir l’accès gestionnaire', cadenceDays: null, due: v.startDate }] : []),
    { kind: 'AUDIT', title: 'Faire l’audit initial de la fiche', cadenceDays: null, due: v.startDate },
    { kind: 'INFO', title: 'Vérifier les catégories, services et informations', cadenceDays: null, due: v.startDate },
    { kind: 'REVIEWS', title: 'Vérifier les nouveaux avis et répondre', cadenceDays: v.reviewDays, due: v.startDate },
    { kind: 'PHOTOS', title: 'Demander et ajouter les photos du client', cadenceDays: v.photoDays, due: v.startDate },
    { kind: 'POST', title: 'Préparer une publication à valider', cadenceDays: v.postDays, due: addDays(v.startDate, v.postDays) },
    { kind: 'HOURS', title: 'Vérifier les horaires et fermetures à venir', cadenceDays: 30, due: v.startDate },
    { kind: 'REPORT', title: 'Préparer le bilan du mois', cadenceDays: v.reportDays, due: addDays(v.startDate, v.reportDays) },
  ];
  return rows.map(({ due, ...r }) => ({ ...r, dueDate: at(due), source: 'PLANIFIEE' }));
}
export function actionLink(action: { kind: string }, profile: { manageUrl?: string | null; reviewsUrl?: string | null; photosUrl?: string | null; mapsUrl: string }) {
  const exact = action.kind === 'REVIEWS' ? profile.reviewsUrl : action.kind === 'PHOTOS' ? profile.photosUrl : null;
  return { url: exact || profile.manageUrl || profile.mapsUrl, label: exact ? 'Ouvrir cette action dans Google' : profile.manageUrl ? 'Ouvrir la gestion Google' : 'Ouvrir la fiche Google' };
}
