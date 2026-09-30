import { cn } from '@/lib/utils';

const TONES: Record<string, string> = {
  // neutres
  NOUVEAU: 'bg-[#EEF2FF] text-[#3730A3]',
  A_CONTACTER: 'bg-[#FFF7ED] text-[#9A3412]',
  CONTACTE: 'bg-[#F7F7F5] text-[#444444]',
  RENDEZ_VOUS: 'bg-[#ECFEFF] text-[#155E75]',
  DEVIS_ENVOYE: 'bg-[#FEFCE8] text-[#854D0E]',
  GAGNE: 'bg-[#ECFDF5] text-[#065F46]',
  PERDU: 'bg-[#F7F7F5] text-[#888888]',
  ACTIF: 'bg-[#ECFDF5] text-[#065F46]',
  EN_PAUSE: 'bg-[#FEFCE8] text-[#854D0E]',
  ANCIEN: 'bg-[#F7F7F5] text-[#888888]',
  A_PREPARER: 'bg-[#F7F7F5] text-[#444444]',
  EN_COURS: 'bg-[#EEF2FF] text-[#3730A3]',
  EN_ATTENTE_CLIENT: 'bg-[#FFF7ED] text-[#9A3412]',
  A_VALIDER: 'bg-[#FEFCE8] text-[#854D0E]',
  TERMINE: 'bg-[#ECFDF5] text-[#065F46]',
  A_FAIRE: 'bg-[#F7F7F5] text-[#444444]',
  NORMALE: 'bg-[#F7F7F5] text-[#666666]',
  IMPORTANTE: 'bg-[#FFF7ED] text-[#9A3412]',
  URGENTE: 'bg-[#FEF2F2] text-[#991B1B]',
  BROUILLON: 'bg-[#F7F7F5] text-[#666666]',
  ENVOYE: 'bg-[#EEF2FF] text-[#3730A3]',
  ACCEPTE: 'bg-[#ECFDF5] text-[#065F46]',
  REFUSE: 'bg-[#FEF2F2] text-[#991B1B]',
  EXPIRE: 'bg-[#F7F7F5] text-[#888888]',
  PAIEMENT_EN_RETARD: 'bg-[#FEF2F2] text-[#991B1B]',
  ANNULE: 'bg-[#F7F7F5] text-[#888888]',
  INCOMPLET: 'bg-[#FEFCE8] text-[#854D0E]',
  TRAITE: 'bg-[#ECFDF5] text-[#065F46]',
  CONVERTI: 'bg-[#ECFDF5] text-[#065F46]',
  ARCHIVE: 'bg-[#F7F7F5] text-[#888888]',
  paid: 'bg-[#ECFDF5] text-[#065F46]',
  open: 'bg-[#FEFCE8] text-[#854D0E]',
  void: 'bg-[#F7F7F5] text-[#888888]',
  uncollectible: 'bg-[#FEF2F2] text-[#991B1B]',
  draft: 'bg-[#F7F7F5] text-[#666666]',
};

export function StatusBadge({ value, label, className }: { value?: string | null; label?: string; className?: string }) {
  const v = String(value ?? '');
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium', TONES[v] ?? 'bg-[#F7F7F5] text-[#666666]', className)}>{label ?? v}</span>;
}
