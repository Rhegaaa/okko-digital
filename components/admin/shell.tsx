'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, CheckSquare, Users, UserPlus, FolderKanban, CreditCard, FileText, CalendarDays, Wallet, Settings, Search, Bell, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommandPalette } from '@/components/admin/command-palette';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Vue d’ensemble', href: '/control', icon: LayoutDashboard },
  { label: 'À faire', href: '/control/taches', icon: CheckSquare },
  { label: 'Clients', href: '/control/clients', icon: Users },
  { label: 'Prospects', href: '/control/prospects', icon: UserPlus },
  { label: 'Projets', href: '/control/projets', icon: FolderKanban },
  { label: 'Abonnements', href: '/control/abonnements', icon: CreditCard },
  { label: 'Devis', href: '/control/devis', icon: FileText },
  { label: 'Calendrier', href: '/control/calendrier', icon: CalendarDays },
  { label: 'Finances', href: '/control/finances', icon: Wallet },
  { label: 'Paramètres', href: '/control/parametres', icon: Settings },
];

export type NotificationItem = { id: string; title: string; message: string; link: string | null; read: boolean; createdAt: string };

export function AdminShell({ children, userName, notifications, unread }: { children: ReactNode; userName: string; notifications: NotificationItem[]; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmd((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  async function markAll() {
    try {
      await fetch('/api/admin/notifications/read-all', { method: 'POST' });
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  async function markOne(id: string, link?: string | null) {
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    } catch {
      /* ignore */
    }
    if (link) router.push(link);
    router.refresh();
  }

  const isActive = (href: string) => (href === '/control' ? pathname === '/control' : pathname?.startsWith(href));

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Navigation du back-office">
      <div className="flex h-14 items-center justify-between px-5">
        <Link href="/control" className="text-xs font-bold uppercase tracking-[0.22em] text-[#111111]">
          OKKO <span className="font-normal text-[#999999]">Control</span>
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <ul className="mt-2 flex-1 space-y-0.5 px-3">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link href={n.href} className={cn('flex items-center gap-3 rounded-[4px] px-3 py-2 text-sm transition-colors', isActive(n.href) ? 'bg-[#111111] text-white' : 'text-[#444444] hover:bg-[#EFEFEC] hover:text-[#111111]')} aria-current={isActive(n.href) ? 'page' : undefined}>
              <n.icon className="h-4 w-4" strokeWidth={1.5} />
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-[#E7E7E4] p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-sm text-[#666666] hover:bg-[#EFEFEC] hover:text-[#111111]">
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} /> Voir le site
        </Link>
        <button onClick={() => signOut({ redirectTo: '/control/connexion' })} className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2 text-sm text-[#666666] hover:bg-[#EFEFEC] hover:text-[#111111]">
          <LogOut className="h-4 w-4" strokeWidth={1.5} /> Se déconnecter
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-[#E7E7E4] bg-[#FAFAF8] lg:block">{sidebar}</aside>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-[#E7E7E4] bg-[#FAFAF8]">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#E7E7E4] bg-[#F7F7F5]/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-[4px] p-1.5 hover:bg-[#EFEFEC] lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </button>
            <button onClick={() => setCmd(true)} className="flex items-center gap-2 rounded-[4px] border border-[#E7E7E4] bg-white px-3 py-1.5 text-sm text-[#666666] hover:border-[#CFCFCB] sm:w-72">
              <Search className="h-4 w-4" strokeWidth={1.5} />
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="hidden rounded border border-[#E7E7E4] bg-[#F7F7F5] px-1.5 text-[10px] font-medium text-[#999999] sm:inline">⌘K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative rounded-[4px] p-2 hover:bg-[#EFEFEC]" aria-label={`Notifications (${unread} non lues)`}>
                  <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={1.5} />
                  {unread > 0 ? <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-medium text-white">{unread > 9 ? '9+' : unread}</span> : null}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-[6px] border-[#E7E7E4] p-0">
                <div className="flex items-center justify-between border-b border-[#E7E7E4] px-4 py-2.5">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unread > 0 ? (
                    <button onClick={markAll} className="text-xs text-[#666666] hover:text-[#111111]">
                      Tout marquer comme lu
                    </button>
                  ) : null}
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {(notifications ?? []).length === 0 ? <li className="px-4 py-8 text-center text-sm text-[#999999]">Rien de nouveau.</li> : null}
                  {(notifications ?? []).map((n) => (
                    <li key={n.id}>
                      <button onClick={() => markOne(n.id, n.link)} className={cn('flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-[#F7F7F5]', !n.read && 'bg-[#FBFBF9]')}>
                        <span className="flex w-full items-center gap-2 text-sm font-medium">
                          {!n.read ? <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" /> : null}
                          {n.title}
                        </span>
                        <span className="text-xs text-[#666666]">{n.message}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <span className="hidden text-sm text-[#666666] sm:inline">{userName}</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">{children}</main>
      </div>
      <CommandPalette open={cmd} onOpenChange={setCmd} />
    </div>
  );
}
