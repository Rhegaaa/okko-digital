export function GET() {
  return new Response('# OKKO Digital\n\nAgence indépendante spécialisée dans les fiches Google.\n\n- Site : https://okko-digital.fr\n- Contact : contact@okko-digital.fr\n- Prestations : optimisation des informations, accompagnement des avis authentiques, mise à jour et suivi de la fiche.\n- Tarifs : sur devis. Aucune position sur Google ni aucun volume de clients ne sont garantis.\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
