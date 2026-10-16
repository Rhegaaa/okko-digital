import { z } from 'zod';
export const articleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(12).max(100),
  title: z.string().min(25).max(85), description: z.string().min(90).max(180),
  intro: z.string().min(180).max(1800),
  sections: z.array(z.object({ heading: z.string().min(10).max(140), paragraphs: z.array(z.string().min(80).max(2500)).min(1).max(4), items: z.array(z.string().min(15).max(500)).max(8).default([]), sourceIds: z.array(z.string()).min(1).max(4) })).min(4).max(7),
  faq: z.array(z.object({ question: z.string().min(15).max(160), answer: z.string().min(80).max(1000) })).max(4).default([]),
  checklist: z.array(z.string().min(15).max(300)).min(3).max(7),
});
export type GrowthContent = z.infer<typeof articleSchema>;
export const SOURCES = [
  { id:'ranking',url:'https://support.google.com/business/answer/7091?hl=fr',title:'Google : classement local',facts:'Le classement local dépend notamment de la pertinence, de la distance et de la notoriété. Une agence ne peut pas garantir une position. Des informations exactes aident les internautes à comprendre une activité.' },
  { id:'reviews',url:'https://support.google.com/business/answer/3474122?hl=fr',title:'Google : demander des avis',facts:'Un établissement peut partager son lien de demande d’avis ou un QR code. Il demande des avis authentiques, sans offrir de contrepartie ni sélectionner seulement les clients satisfaits.' },
  { id:'reply',url:'https://support.google.com/business/answer/3474050?hl=fr',title:'Google : répondre aux avis',facts:'Les réponses aux avis sont publiques. Une réponse doit rester professionnelle et ne pas exposer les informations personnelles du client. Une réclamation sensible peut nécessiter un échange privé et une validation interne.' },
  { id:'hours',url:'https://support.google.com/business/answer/6303076?hl=fr',title:'Google : horaires exceptionnels',facts:'Les horaires exceptionnels servent à préciser les ouvertures et fermetures pour des dates particulières. Le gestionnaire vérifie les informations réelles de l’établissement avant une modification.' },
  { id:'managers',url:'https://support.google.com/business/answer/3403100?hl=fr',title:'Google : propriétaires et gestionnaires',facts:'Un propriétaire peut inviter un gestionnaire. Le client garde la propriété et ne transmet pas son mot de passe Google à une agence.' },
  { id:'photos',url:'https://support.google.com/business/answer/6103862?hl=fr',title:'Google : photos de l’établissement',facts:'Les photos doivent représenter réellement l’établissement, ses produits ou son activité. Le client fournit des visuels qu’il est autorisé à utiliser. Une agence peut les sélectionner et les organiser, sans inventer une réalisation.' },
] as const;
export function normalize(text:string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
export function plain(a:GrowthContent) { return [a.title,a.intro,...a.sections.flatMap(s=>[s.heading,...s.paragraphs,...s.items]),...a.faq.flatMap(f=>[f.question,f.answer]),...a.checklist].join(' '); }
export function similarity(a:string,b:string) {
  const shingles=(s:string)=>{const w=normalize(s).split(' ');return new Set(w.slice(0,-4).map((_,i)=>w.slice(i,i+5).join(' ')));};
  const x=shingles(a),y=shingles(b);return [...x].filter(s=>y.has(s)).length/Math.max(1,Math.min(x.size,y.size));
}
export function quality(raw:unknown, existing:{title:string;text:string}[], availableIds: string[]=SOURCES.map(s=>s.id)) {
  const parsed=articleSchema.safeParse(raw); if(!parsed.success)return {ok:false,issues:parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`),words:0};
  const a=parsed.data,text=plain(a),words=text.split(/\s+/).length;const issues:string[]=[];
  if(words<600||words>1800)issues.push('Longueur hors de la plage de lecture utile (600 à 1800 mots).');
  if(new Set(a.sections.map(s=>normalize(s.heading))).size!==a.sections.length)issues.push('Intertitres dupliqués.');
  if(a.sections.some(s=>s.sourceIds.some(id=>!availableIds.includes(id))))issues.push('Source absente ou non vérifiée.');
  if(new Set(a.sections.flatMap(s=>s.sourceIds)).size<2)issues.push('Au moins deux sources vérifiées sont nécessaires.');
  if(/<\/?[a-z!]|javascript:|https?:\/\//i.test(text))issues.push('HTML ou lien libre interdit dans le texte généré.');
  if(/\b\d+\s*(%|€|euros|clients|avis|jours|semaines|mois)\b/i.test(text))issues.push('Statistique, prix ou délai chiffré non sourcé.');
  if(/nous garantissons|classement garanti|position garantie|premi[eè]re? (place|position) assur[eé]e|notre client|nos clients|t[eé]moignage|[àa] (Paris|Lyon|Marseille|Annecy)|plombier|ma[çc]on|couvreur|b[aâ]timent/i.test(text))issues.push('Promesse, témoignage, ciblage géographique ou BTP interdit.');
  if(existing.some(e=>similarity(text,e.text)>.30||normalize(a.title)===normalize(e.title)))issues.push('Doublon ou cannibalisation avec une page existante.');
  const sentences=text.split(/[.!?]+/).map(normalize).filter(s=>s.split(' ').length>7);if(sentences.length-new Set(sentences).size>3)issues.push('Phrases répétées.');
  if(!/fiche|google|avis/i.test(a.title))issues.push('Titre hors du domaine de spécialité.');
  return {ok:!issues.length,issues,words};
}
export function frenchDay(date=new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
export function weekStart(date=new Date()) {const d=new Date(`${frenchDay(date)}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d;}
export function publicationDay(date=new Date()) {return [1,3,5].includes(new Date(`${frenchDay(date)}T12:00:00Z`).getUTCDay());}
