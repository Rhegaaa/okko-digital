import { GmbContact } from '@/components/site/gmb-contact';
import { gmbMarkup } from '@/lib/gmb-markup';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  path: '/',
  title: 'OKKO — Agence de fiches Google',
  description: 'OKKO optimise et gère votre fiche Google : informations, services, photos, avis clients et suivi. Agence indépendante.',
});

export default function HomePage() {
  return <><div dangerouslySetInnerHTML={{ __html: gmbMarkup }} /><GmbContact /></>;
}
