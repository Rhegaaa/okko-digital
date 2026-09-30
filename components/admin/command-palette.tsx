'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, UserPlus, FolderKanban, CheckSquare, FileText, LayoutDashboard, CalendarDays, CreditCard, Wallet, Settings } from 'lucide-react';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

const PAGES = [
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

type Result = { type: string; label: string; sub: string; href: string };

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQ('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q.trim())}`, { signal: ctrl.signal });
        const data = await res.json().catch(() => []);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher un client, un prospect, un projet…" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>{loading ? 'Recherche…' : q.trim().length < 2 ? 'Tapez au moins deux caractères.' : 'Aucun résultat.'}</CommandEmpty>
        {results.length > 0 ? (
          <CommandGroup heading="Résultats">
            {results.map((r, i) => (
              <CommandItem key={`${r.href}-${i}`} value={`${r.type} ${r.label} ${r.sub} ${i}`} onSelect={() => go(r.href)}>
                <Search className="mr-2 h-4 w-4 text-[#999999]" />
                <span className="flex-1 truncate">{r.label}</span>
                <span className="ml-3 truncate text-xs text-[#999999]">{r.sub}</span>
                <span className="ml-3 rounded-full bg-[#F7F7F5] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#666666]">{r.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        <CommandGroup heading="Aller à">
          {PAGES.map((p) => (
            <CommandItem key={p.href} value={`page ${p.label}`} onSelect={() => go(p.href)}>
              <p.icon className="mr-2 h-4 w-4 text-[#999999]" strokeWidth={1.5} />
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
