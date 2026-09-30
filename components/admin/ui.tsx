import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">{title}</h1>
        {description ? <p className="mt-1 text-sm text-[#666666]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className, title, actions }: { children: ReactNode; className?: string; title?: string; actions?: ReactNode }) {
  return (
    <section className={cn('rounded-[6px] border border-[#E7E7E4] bg-white', className)}>
      {title || actions ? (
        <header className="flex items-center justify-between gap-4 border-b border-[#E7E7E4] px-5 py-3.5">
          {title ? <h2 className="text-sm font-semibold text-[#111111]">{title}</h2> : <span />}
          {actions}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon?: React.ComponentType<{ className?: string; strokeWidth?: number }> }) {
  return (
    <div className="rounded-[6px] border border-[#E7E7E4] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[#666666]">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-[#999999]" strokeWidth={1.5} /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111111]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#666666]">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-[#E7E7E4] px-6 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F5] text-[#666666]">
        <Inbox className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <p className="mt-4 text-sm font-medium text-[#111111]">{title}</p>
      {text ? <p className="mt-1 max-w-sm text-sm text-[#666666]">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn('whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#666666] first:pl-0 last:pr-0', className)}>{children}</th>;
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('px-3 py-3 align-middle text-[#111111] first:pl-0 last:pr-0', className)}>{children}</td>;
}

export const btn = {
  primary: 'inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333] disabled:opacity-50',
  secondary: 'inline-flex items-center gap-2 rounded-[4px] border border-[#E7E7E4] bg-white px-3.5 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#F7F7F5] disabled:opacity-50',
  ghost: 'inline-flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-sm text-[#666666] transition-colors hover:bg-[#F7F7F5] hover:text-[#111111] disabled:opacity-50',
  danger: 'inline-flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-sm text-[#8A1C1C] transition-colors hover:bg-[#FBF0F0] disabled:opacity-50',
};

export const input = 'w-full rounded-[4px] border border-[#E7E7E4] bg-white px-3 py-2 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#999999] focus:border-[#111111]';
