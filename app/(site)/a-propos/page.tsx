import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { AboutContent } from '@/components/site/about-content';

export const metadata: Metadata = pageMeta({
  path: '/a-propos',
  title: 'À propos — agence digitale indépendante en Haute-Savoie | OKKO Digital',
  description: 'OKKO Digital est une agence digitale indépendante basée en Haute-Savoie, au service des restaurants, artisans, commerces et indépendants.',
});

export default function AboutPage() {
  return <AboutContent />;
}
