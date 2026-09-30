import { IMAGES } from '@/lib/constants';

export type ServiceSlug = 'presence-locale' | 'sites-web' | 'automatisation' | 'solutions-metier';

export type ServiceData = {
  slug: ServiceSlug;
  number: string;
  serviceType: 'PRESENCE_LOCALE' | 'SITE_WEB' | 'AUTOMATISATION' | 'SOLUTION_METIER';
  name: string;
  title: [string, string];
  metaTitle: string;
  metaDescription: string;
  intro: string;
  image: string;
  imageAlt: string;
  problem: { title: string; text: string };
  offers: { title: string; text: string }[];
  forWho: string[];
  deliverables: string[];
  cta: string;
  dark: boolean;
};

export const SERVICES: ServiceData[] = [
  {
    slug: 'presence-locale',
    number: '01',
    serviceType: 'PRESENCE_LOCALE',
    name: 'Présence locale',
    title: ['Être trouvé,', 'avant d’être choisi.'],
    metaTitle: 'Fiche Google & présence locale en Haute-Savoie — OKKO Digital',
    metaDescription: 'Fiche Google optimisée, avis clients, plaques NFC et QR code : soyez visible et rassurant pour les clients qui vous cherchent près de chez vous.',
    intro: 'Aujourd’hui, la première visite se fait sur un téléphone. Votre fiche Google, vos avis, vos horaires : c’est votre vitrine avant la vitrine. Nous la rendons complète, vivante et rassurante.',
    image: IMAGES.storefront,
    imageAlt: 'Devanture d’un commerce indépendant en centre-ville',
    problem: {
      title: 'Une fiche incomplète fait fuir sans bruit.',
      text: 'Horaires faux, photos anciennes, avis sans réponse : chaque détail compte quand un client hésite entre vous et le voisin. La plupart des établissements ne s’en rendent même pas compte.',
    },
    offers: [
      { title: 'Fiche Google complète et optimisée', text: 'Catégories, description, horaires, services, photos professionnelles, publications régulières. Tout ce qui fait qu’on vous choisit.' },
      { title: 'Gestion des avis', text: 'Collecte simplifiée auprès de vos clients satisfaits, réponses soignées à chaque avis, suivi dans le temps.' },
      { title: 'Plaques NFC et QR code', text: 'Un support élégant sur votre comptoir ou votre porte. Un geste, et votre client laisse un avis ou vous retrouve en ligne.' },
      { title: 'Suivi mensuel', text: 'Un point régulier, en langage clair, sur ce qui progresse et ce que nous ajustons.' },
    ],
    forWho: ['Restaurants et cafés', 'Commerces de proximité', 'Artisans et professions libérales', 'Salons, instituts, garages'],
    deliverables: ['Audit initial de votre visibilité locale', 'Fiche Google mise à jour et enrichie', 'Supports NFC / QR livrés et installés', 'Rapport mensuel simple'],
    cta: 'Demander un audit',
    dark: false,
  },
  {
    slug: 'sites-web',
    number: '02',
    serviceType: 'SITE_WEB',
    name: 'Sites web',
    title: ['Un site qui', 'inspire confiance.'],
    metaTitle: 'Création de site internet en Haute-Savoie — OKKO Digital',
    metaDescription: 'Sites vitrines et e-commerce sur mesure, rapides, lisibles et pensés pour convertir. Conçus et hébergés avec soin, maintenus dans la durée.',
    intro: 'Votre site n’a pas besoin d’être spectaculaire. Il doit être clair, rapide et donner envie de vous contacter. Nous concevons des sites sobres et efficaces, que vos clients comprennent en trois secondes.',
    image: IMAGES.cafeOwner,
    imageAlt: 'Propriétaire d’un café consultant son site sur une tablette',
    problem: {
      title: 'Un site date vite. Un mauvais site coûte cher.',
      text: 'Trop lent, illisible sur mobile, sans message clair : un site mal conçu renvoie une image que vous ne méritez pas. Et il ne ramène aucun client.',
    },
    offers: [
      { title: 'Site vitrine sur mesure', text: 'Une structure pensée pour votre activité, des textes travaillés avec vous, une mise en page qui respire.' },
      { title: 'Boutique en ligne', text: 'Vendre vos produits ou réserver vos prestations, avec un parcours simple et un paiement sécurisé.' },
      { title: 'Performance et référencement', text: 'Un site rapide, accessible, structuré pour être compris par Google et par vos visiteurs.' },
      { title: 'Hébergement et maintenance', text: 'Nous nous occupons de la technique, des mises à jour et de la sécurité. Vous n’y pensez plus.' },
    ],
    forWho: ['Indépendants et TPE', 'Restaurants et hébergements', 'Artisans et créateurs', 'Associations et professions libérales'],
    deliverables: ['Maquette validée avant développement', 'Site responsive livré et mis en ligne', 'Formation courte à la prise en main', 'Suivi et évolutions dans le temps'],
    cta: 'Parler de mon site',
    dark: false,
  },
  {
    slug: 'automatisation',
    number: '03',
    serviceType: 'AUTOMATISATION',
    name: 'Automatisation & IA',
    title: ['Moins de tâches,', 'plus de métier.'],
    metaTitle: 'Automatisation & IA pour TPE et PME — OKKO Digital',
    metaDescription: 'Relances, emails, synchronisation d’outils, réponses assistées par IA : nous automatisons ce qui vous fait perdre du temps, sans rien vous imposer.',
    intro: 'Ressaisir, relancer, transférer, vérifier : ces petites tâches grignotent vos journées. Nous les rendons automatiques, une par une, avec des outils simples et une IA utilisée là où elle est utile.',
    image: IMAGES.officeDesk,
    imageAlt: 'Bureau d’un indépendant avec ordinateur et carnet',
    problem: {
      title: 'Ce n’est pas votre travail de faire du copier-coller.',
      text: 'Chaque demande qui arrive par email, formulaire ou téléphone déclenche la même chaîne manuelle. Une partie se perd. Le reste vous vole vos soirées.',
    },
    offers: [
      { title: 'Traitement des demandes', text: 'Chaque demande est enregistrée, qualifiée et suivie automatiquement. Accusé de réception immédiat, rien ne se perd.' },
      { title: 'Relances et rappels', text: 'Devis sans réponse, rendez-vous à confirmer, factures à encaisser : les relances partent au bon moment, sans vous.' },
      { title: 'Synchronisation de vos outils', text: 'Agenda, facturation, messagerie, tableur : vos outils se parlent enfin, sans double saisie.' },
      { title: 'Assistance par IA', text: 'Réponses pré-rédigées, tri des messages, résumés : une aide discrète, toujours sous votre contrôle.' },
    ],
    forWho: ['Artisans qui gèrent seuls leurs devis', 'Commerces avec des demandes récurrentes', 'Cabinets et professions libérales', 'Toute équipe qui ressaisit trop'],
    deliverables: ['Cartographie de vos tâches répétitives', 'Automatisations mises en place et testées', 'Documentation claire pour votre équipe', 'Ajustements au fil de l’usage'],
    cta: 'Étudier mon automatisation',
    dark: true,
  },
  {
    slug: 'solutions-metier',
    number: '04',
    serviceType: 'SOLUTION_METIER',
    name: 'Solutions métier',
    title: ['Un logiciel fait', 'pour votre métier.'],
    metaTitle: 'Logiciel métier sur mesure pour TPE — OKKO Digital',
    metaDescription: 'Applications de gestion sur mesure pour TPE et indépendants : clients, planning, devis, suivi d’activité. Un outil qui s’adapte à vous, pas l’inverse.',
    intro: 'Les logiciels du marché sont faits pour tout le monde, donc pour personne. Quand votre activité a ses propres règles, nous construisons un outil qui les respecte : ni plus, ni moins.',
    image: IMAGES.workshop,
    imageAlt: 'Atelier d’artisan avec outils et plans de travail',
    problem: {
      title: 'Vous vous adaptez à l’outil. Ça devrait être l’inverse.',
      text: 'Tableurs qui débordent, logiciels trop complexes, abonnements empilés : vous passez plus de temps à contourner vos outils qu’à les utiliser.',
    },
    offers: [
      { title: 'Gestion clients et suivi', text: 'Une fiche par client, l’historique complet, les prochaines actions. Simple et à jour.' },
      { title: 'Planning et interventions', text: 'Organisez vos rendez-vous, chantiers ou prestations, avec une vue claire pour toute l’équipe.' },
      { title: 'Devis, factures, encaissements', text: 'Générez vos documents en quelques clics, suivez ce qui est signé, payé ou à relancer.' },
      { title: 'Tableaux de bord', text: 'Les chiffres qui comptent pour vous, lisibles d’un coup d’œil, sans passer par un tableur.' },
    ],
    forWho: ['Artisans et entreprises du bâtiment', 'Prestataires de services', 'Commerces multi-sites', 'Structures avec des processus spécifiques'],
    deliverables: ['Cahier des besoins rédigé avec vous', 'Prototype validé avant développement', 'Application livrée, hébergée et sécurisée', 'Accompagnement et évolutions'],
    cta: 'Parler de mon besoin',
    dark: false,
  },
];

export function getService(slug?: string): ServiceData | undefined {
  return SERVICES.find((s) => s?.slug === slug);
}
