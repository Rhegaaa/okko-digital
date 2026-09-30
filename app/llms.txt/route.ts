import { SITE } from '@/lib/constants';
import { SERVICES } from '@/lib/services-data';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# OKKO Digital',
    '',
    '> Agence digitale indépendante basée à Savigny (74520, Haute-Savoie, France). OKKO Digital accompagne les TPE, PME, artisans, commerçants et indépendants : présence locale et fiche Google, création de sites web, automatisation & IA, solutions métier sur mesure.',
    '',
    'Méthode de travail : Comprendre → Concevoir → Mettre en place → Accompagner. Tarifs sur devis, après un premier échange.',
    '',
    '## Services',
    ...SERVICES.map((s) => `- [${s.metaTitle.replace(/ — OKKO Digital$/, '')}](${SITE.url}/services/${s.slug}): ${s.metaDescription}`),
    '',
    '## Pages',
    `- [Accueil](${SITE.url}/)`,
    `- [Tous les services](${SITE.url}/services)`,
    `- [À propos](${SITE.url}/a-propos)`,
    `- [Contact et demande de devis](${SITE.url}/contact)`,
    '',
    '## Contact',
    `- Email : ${SITE.email}`,
    '- Zone : Haute-Savoie et toute la France (à distance)',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
