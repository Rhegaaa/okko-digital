import Link from 'next/link';
import { SITE } from '@/lib/constants';

const COLS = [
  {
    title: 'Expertises',
    links: [
      { href: '/services/presence-locale', label: 'Présence locale' },
      { href: '/services/sites-web', label: 'Sites web' },
      { href: '/services/automatisation', label: 'Automatisation & IA' },
      { href: '/services/solutions-metier', label: 'Solutions métier' },
    ],
  },
  {
    title: 'OKKO',
    links: [
      { href: '/realisations', label: 'Réalisations' },
      { href: '/a-propos', label: 'À propos' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="theme-dark relative overflow-hidden bg-[#111111] text-white" role="contentinfo">
      <div className="okko-container relative pb-10 pt-24 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow tracking-[0.22em]">
              OKKO <span className="font-normal opacity-60">DIGITAL</span>
            </p>
            <p className="display-sm mt-8 max-w-md text-white/90">Le digital au service de votre entreprise.</p>
            <a href={`mailto:${SITE.email}`} className="link-underline mt-10 inline-block text-sm text-white/70 hover:text-white" suppressHydrationWarning>
              {SITE.email}
            </a>
          </div>
          {COLS.map((c) => (
            <div key={c.title} className="md:col-span-3">
              <p className="eyebrow mb-6 text-white/40">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline text-sm text-white/75 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 select-none overflow-hidden border-t border-white/10 pt-8 md:mt-32" aria-hidden>
          <p className="whitespace-nowrap text-[clamp(4rem,17vw,15rem)] font-medium leading-[0.85] tracking-[-0.05em] text-white/[0.06]">OKKO DIGITAL</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 OKKO Digital — {SITE.city}</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/control" className="hover:text-white">
              Espace admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
