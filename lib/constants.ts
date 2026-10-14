export const SITE = {
  name: 'OKKO Digital',
  tagline: 'Votre fiche Google, entre de bonnes mains.',
  url: 'https://okko-digital.fr',
  email: 'contact@okko-digital.fr',
  city: 'Savigny (74520), France',
  legal: {
    owner: 'CATENACCIO LORENZO',
    form: 'Entreprise individuelle (micro-entreprise)',
    siren: '105 374 490',
    siret: '105 374 490 00016',
    address: '74520 Savigny, France',
    host: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    vat: 'TVA non applicable, art. 293 B du CGI',
  },
};

export const IMAGES = {
  heroRestaurant: '/images/hero_restaurant.jpg',
  artisanHands: '/images/artisan_hands.jpg',
  cafeOwner: '/images/cafe_owner.jpg',
  boulangerie: '/images/boulangerie.jpg',
  storefront: '/images/shop_storefront.jpg',
  workshop: '/images/workshop.jpg',
  florist: '/images/florist.jpg',
  barber: '/images/barber.jpg',
  phoneInHand: '/images/phone_in_hand.jpg',
  officeDesk: '/images/office_desk.jpg',
  teamMeeting: '/images/team_meeting.jpg',
  mechanic: '/images/garage_mechanic.jpg',
};

export const SERVICE_LABELS: Record<string, string> = {
  PRESENCE_LOCALE: 'Présence locale',
  SITE_WEB: 'Site web',
  AUTOMATISATION: 'Automatisation & IA',
  SOLUTION_METIER: 'Solution métier',
  AUTRE: 'Autre',
};

export const SERVICE_OPTIONS = Object.entries(SERVICE_LABELS).map(([value, label]) => ({ value, label }));

export const CLIENT_STATUS_LABELS: Record<string, string> = { ACTIF: 'Actif', EN_PAUSE: 'En pause', ANCIEN: 'Ancien' };
export const PROSPECT_STATUS_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  A_CONTACTER: 'À contacter',
  CONTACTE: 'Contacté',
  RENDEZ_VOUS: 'Rendez-vous',
  DEVIS_ENVOYE: 'Devis envoyé',
  GAGNE: 'Gagné',
  PERDU: 'Perdu',
};
export const PROSPECT_STATUS_ORDER = ['NOUVEAU', 'A_CONTACTER', 'CONTACTE', 'RENDEZ_VOUS', 'DEVIS_ENVOYE', 'GAGNE', 'PERDU'];
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  A_PREPARER: 'À préparer',
  EN_COURS: 'En cours',
  EN_ATTENTE_CLIENT: 'En attente client',
  A_VALIDER: 'À valider',
  TERMINE: 'Terminé',
};
export const TASK_STATUS_LABELS: Record<string, string> = { A_FAIRE: 'À faire', EN_COURS: 'En cours', TERMINE: 'Terminé' };
export const TASK_PRIORITY_LABELS: Record<string, string> = { NORMALE: 'Normale', IMPORTANTE: 'Importante', URGENTE: 'Urgente' };
export const QUOTE_STATUS_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  ENVOYE: 'Envoyé',
  ACCEPTE: 'Accepté',
  REFUSE: 'Refusé',
  EXPIRE: 'Expiré',
};
export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  ACTIF: 'Actif',
  PAIEMENT_EN_RETARD: 'Paiement en retard',
  ANNULE: 'Annulé',
  TERMINE: 'Terminé',
  INCOMPLET: 'Incomplet',
};
export const CONTACT_STATUS_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  TRAITE: 'Traité',
  CONVERTI: 'Converti',
  ARCHIVE: 'Archivé',
};
export const NOTE_TYPE_LABELS: Record<string, string> = {
  INTERNE: 'Note interne',
  APPEL: 'Appel',
  REUNION: 'Réunion',
  EMAIL: 'Email',
  AUTRE: 'Autre',
};

export const PLAN_LABELS: Record<string, string> = {
  REPUTATION: 'OKKO Réputation',
  PRESENCE: 'OKKO Présence',
  SECURITE: 'OKKO Sécurité',
};

export function toOptions(map: Record<string, string>) {
  return Object.entries(map ?? {}).map(([value, label]) => ({ value, label }));
}

export function formatEuro(cents?: number | null) {
  const v = (cents ?? 0) / 100;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: v % 1 === 0 ? 0 : 2 }).format(v);
}

export function formatDate(d?: Date | string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date?.getTime?.())) return '—';
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: 'short', year: 'numeric', ...(opts ?? {}) }).format(date);
}
