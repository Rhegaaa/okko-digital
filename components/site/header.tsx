'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

const SERVICES = [
  { href: '/services/presence-locale', label: 'Présence locale' },
  { href: '/services/sites-web', label: 'Sites web' },
  { href: '/services/automatisation', label: 'Automatisation & IA' },
  { href: '/services/solutions-metier', label: 'Solutions métier' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled((window?.scrollY ?? 0) > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const darkRoute = pathname === '/services/automatisation';
  const onDark = (dark || darkRoute) && !scrolled && !open;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-5" role="banner">
        <motion.nav
          aria-label="Navigation principale"
          className={cn(
            'flex w-full max-w-[1200px] items-center justify-between rounded-full px-5 transition-[background-color,box-shadow,backdrop-filter,color] duration-500 ease-okko md:px-6',
            scrolled && !open ? 'bg-white/80 text-[#111111] shadow-[0_8px_30px_-16px_rgba(17,17,17,0.25)] backdrop-blur-xl' : 'bg-transparent',
            onDark || open ? 'text-white' : 'text-[#111111]',
          )}
          animate={{ height: scrolled ? 56 : 64 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link href="/" className="eyebrow relative z-[60] text-[0.75rem] tracking-[0.22em]" aria-label="OKKO Digital — accueil">
            OKKO <span className="font-normal opacity-70">DIGITAL</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith?.(l.href));
              return (
                <li key={l.href}>
                  <Link href={l.href} className={cn('link-underline text-[0.8125rem] font-medium tracking-tight transition-opacity', active ? 'opacity-100' : 'opacity-70 hover:opacity-100')}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                'group hidden h-9 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-medium transition-colors duration-500 ease-okko md:inline-flex',
                onDark ? 'bg-white text-[#111111] hover:bg-white/90' : 'bg-[#111111] text-white hover:bg-[#2a2a2a]',
              )}
            >
              Demander un devis
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-okko group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <button
              type="button"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={cn('absolute left-0 top-0 block h-px w-6 bg-current transition-transform duration-500 ease-okko', open && 'top-1.5 rotate-45')} />
                <span className={cn('absolute bottom-0 left-0 block h-px w-6 bg-current transition-transform duration-500 ease-okko', open && 'bottom-1.5 -rotate-45')} />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="theme-dark fixed inset-0 z-40 flex flex-col bg-[#111111] text-white"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.8, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="grain relative flex h-full flex-col px-6 pb-10 pt-28">
              <ul className="flex flex-col gap-1">
                {LINKS.map((l, i) => (
                  <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.9, ease: EASE }}>
                    <Link href={l.href} className="group flex items-baseline justify-between border-b border-white/10 py-4">
                      <span className="display-md font-medium">{l.label}</span>
                      <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-8">
                <p className="eyebrow mb-3 text-white/40">Expertises</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {SERVICES.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="text-sm text-white/75 hover:text-white">
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.8 }} className="mt-auto flex flex-col gap-4">
                <Link href="/contact" className="flex h-14 items-center justify-center rounded-full bg-white text-sm font-medium text-[#111111]">
                  Demander un devis
                </Link>
                <a href={`mailto:${SITE.email}`} className="text-center text-sm text-white/50" suppressHydrationWarning>
                  {SITE.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
