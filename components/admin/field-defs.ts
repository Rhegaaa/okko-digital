import type { FieldDef } from '@/components/admin/entity-dialog';
import { SERVICE_OPTIONS, CLIENT_STATUS_LABELS, PROSPECT_STATUS_LABELS, PROJECT_STATUS_LABELS, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, QUOTE_STATUS_LABELS, NOTE_TYPE_LABELS, toOptions } from '@/lib/constants';

export type Option = { value: string; label: string };
const none = (label = '— Aucun —'): Option => ({ value: '', label });

export const clientFields: FieldDef[] = [
  { name: 'company', label: 'Entreprise', required: true, half: true },
  { name: 'contactName', label: 'Contact', required: true, half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Téléphone', half: true },
  { name: 'website', label: 'Site web', type: 'url', half: true },
  { name: 'city', label: 'Ville', half: true },
  { name: 'address', label: 'Adresse' },
  { name: 'services', label: 'Services', type: 'multiselect', options: SERVICE_OPTIONS },
  { name: 'status', label: 'Statut', type: 'select', options: toOptions(CLIENT_STATUS_LABELS), half: true },
  { name: 'stripeCustomerId', label: 'Identifiant client Stripe', half: true, placeholder: 'cus_…', hint: 'Permet de relier les abonnements et paiements Stripe.' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

export const prospectFields: FieldDef[] = [
  { name: 'company', label: 'Entreprise', required: true, half: true },
  { name: 'contactName', label: 'Contact', required: true, half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Téléphone', half: true },
  { name: 'service', label: 'Service envisagé', type: 'select', options: SERVICE_OPTIONS, half: true },
  { name: 'source', label: 'Source', half: true, placeholder: 'Bouche-à-oreille, site, LinkedIn…' },
  { name: 'status', label: 'Statut', type: 'select', options: toOptions(PROSPECT_STATUS_LABELS), half: true },
  { name: 'estimatedValue', label: 'Valeur estimée', type: 'euros', half: true },
  { name: 'nextAction', label: 'Prochaine action', half: true },
  { name: 'followUpDate', label: 'Relance le', type: 'date', half: true },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

export function projectFields(clients: Option[]): FieldDef[] {
  return [
    { name: 'name', label: 'Nom du projet', required: true },
    { name: 'clientId', label: 'Client', type: 'select', options: clients, required: true, half: true },
    { name: 'service', label: 'Service', type: 'select', options: SERVICE_OPTIONS, half: true },
    { name: 'status', label: 'Statut', type: 'select', options: toOptions(PROJECT_STATUS_LABELS), half: true },
    { name: 'budget', label: 'Budget', type: 'euros', half: true },
    { name: 'startDate', label: 'Début', type: 'date', half: true },
    { name: 'dueDate', label: 'Échéance', type: 'date', half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'notes', label: 'Notes internes', type: 'textarea' },
  ];
}

export function taskFields(clients: Option[], projects: Option[]): FieldDef[] {
  return [
    { name: 'title', label: 'Titre', required: true },
    { name: 'clientId', label: 'Client', type: 'select', options: [none(), ...clients], half: true },
    { name: 'projectId', label: 'Projet', type: 'select', options: [none(), ...projects], half: true },
    { name: 'priority', label: 'Priorité', type: 'select', options: toOptions(TASK_PRIORITY_LABELS), half: true },
    { name: 'status', label: 'Statut', type: 'select', options: toOptions(TASK_STATUS_LABELS), half: true },
    { name: 'dueDate', label: 'Échéance', type: 'date', half: true },
    { name: 'service', label: 'Service', type: 'select', options: [none(), ...SERVICE_OPTIONS], half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];
}

export function quoteFields(clients: Option[], prospects: Option[]): FieldDef[] {
  return [
    { name: 'title', label: 'Intitulé', required: true },
    { name: 'clientId', label: 'Client', type: 'select', options: [none(), ...clients], half: true },
    { name: 'prospectId', label: 'Prospect', type: 'select', options: [none(), ...prospects], half: true },
    { name: 'service', label: 'Service', type: 'select', options: SERVICE_OPTIONS, half: true },
    { name: 'amount', label: 'Montant HT', type: 'euros', half: true, required: true },
    { name: 'recurring', label: 'Montant mensuel récurrent', type: 'checkbox' },
    { name: 'status', label: 'Statut', type: 'select', options: toOptions(QUOTE_STATUS_LABELS), half: true },
    { name: 'issuedAt', label: 'Date d’émission', type: 'date', half: true },
    { name: 'validUntil', label: 'Valable jusqu’au', type: 'date', half: true },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ];
}

export function eventFields(clients: Option[], prospects: Option[]): FieldDef[] {
  return [
    { name: 'title', label: 'Titre', required: true },
    { name: 'startAt', label: 'Début', type: 'datetime', required: true, half: true },
    { name: 'endAt', label: 'Fin', type: 'datetime', half: true },
    { name: 'allDay', label: 'Journée entière', type: 'checkbox' },
    { name: 'kind', label: 'Type', type: 'select', options: ['RDV', 'Appel', 'Relance', 'Livraison', 'Autre'].map((v) => ({ value: v, label: v })), half: true },
    { name: 'clientId', label: 'Client', type: 'select', options: [none(), ...clients], half: true },
    { name: 'prospectId', label: 'Prospect', type: 'select', options: [none(), ...prospects], half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];
}

export const noteFields: FieldDef[] = [
  { name: 'type', label: 'Type', type: 'select', options: toOptions(NOTE_TYPE_LABELS), half: true },
  { name: 'content', label: 'Contenu', type: 'textarea', required: true },
];

export const showcaseFields: FieldDef[] = [
  { name: 'title', label: 'Titre', required: true },
  { name: 'clientName', label: 'Client', half: true },
  { name: 'service', label: 'Service', type: 'select', options: SERVICE_OPTIONS, half: true },
  { name: 'year', label: 'Année', half: true },
  { name: 'url', label: 'Lien du projet', type: 'url', half: true },
  { name: 'imageUrl', label: 'Image (URL)', type: 'url' },
  { name: 'summary', label: 'Résumé (une phrase)' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'published', label: 'Publier sur le site', type: 'checkbox' },
];
