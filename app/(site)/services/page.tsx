import type { Metadata } from 'next';
import { SERVICES } from '@/lib/services-data';
import { ServicesIndex } from '@/components/services/services-index';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/services',
  title: 'Services digitaux pour TPE, artisans et commerçants — OKKO Digital',
  description: 'Présence locale et fiche Google, création de sites web, automatisation & IA, logiciels métier : quatre expertises au service des petites entreprises.',
});

export default function ServicesPage() {
  return <ServicesIndex services={SERVICES} />;
}
