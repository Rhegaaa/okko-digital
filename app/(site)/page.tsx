import { GmbContact } from '@/components/site/gmb-contact';
import { gmbMarkup } from '@/lib/gmb-markup';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  path: '/',
  title: 'Agence Google My Business : fiches Google & avis | OKKO',
  description: 'Agence spécialisée Google Business Profile : audit, optimisation et gestion de fiche Google, réponses aux avis et supports NFC. Découvrez l’accompagnement OKKO.',
});

export default function HomePage() {
  return <><div dangerouslySetInnerHTML={{ __html: gmbMarkup }} /><GmbContact /></>;
}
