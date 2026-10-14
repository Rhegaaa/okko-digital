import { notFound, permanentRedirect } from 'next/navigation';

const LEGACY_EQUIVALENTS: Record<string, string> = {
  'presence-locale': '/optimisation-fiche-google',
  'fiche-google': '/optimisation-fiche-google',
  'avis-google': '/gestion-avis-google',
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (LEGACY_EQUIVALENTS[slug]) permanentRedirect(LEGACY_EQUIVALENTS[slug]);
  notFound();
}
