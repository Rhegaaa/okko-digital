'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'dark' | 'light' | 'link';

type Props = {
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  size?: 'md' | 'lg';
  disabled?: boolean;
  arrow?: boolean;
};

/**
 * Bouton signature OKKO : fond qui se révèle horizontalement, texte qui glisse,
 * flèche dans un cercle qui se déplace, effet magnétique subtil sur desktop.
 */
export function OkkoButton({ href, onClick, type = 'button', children, variant = 'primary', external, className, size = 'md', disabled, arrow = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined' || !window.matchMedia?.('(pointer: fine)')?.matches) return;
    const rect = ref.current?.getBoundingClientRect?.();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (variant === 'link') {
    const inner = (
      <span className={cn('group inline-flex items-center gap-2 text-sm font-medium tracking-tight', className)}>
        <span className="link-underline">{children}</span>
        <span className="relative h-4 w-4 overflow-hidden">
          <ArrowRight className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-okko group-hover:translate-x-5" strokeWidth={1.75} />
          <ArrowRight className="absolute inset-0 h-4 w-4 -translate-x-5 transition-transform duration-500 ease-okko group-hover:translate-x-0" strokeWidth={1.75} />
        </span>
      </span>
    );
    if (href) return <Link href={href} className="inline-flex">{inner}</Link>;
    return <button type={type} onClick={onClick} className="inline-flex">{inner}</button>;
  }

  const base = cn(
    'group relative isolate inline-flex items-center gap-4 overflow-hidden rounded-full font-medium tracking-tight select-none',
    'transition-[color,transform] duration-500 ease-okko focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    size === 'lg' ? 'h-16 pl-8 pr-2 text-base' : 'h-12 pl-6 pr-1.5 text-sm',
    disabled && 'pointer-events-none opacity-50',
  );

  const palette: Record<Exclude<Variant, 'link'>, { btn: string; fill: string; circle: string; circleHover: string }> = {
    primary: {
      btn: 'bg-[#111111] text-white hover:text-[#111111] ring-1 ring-[#111111]',
      fill: 'bg-white',
      circle: 'bg-white text-[#111111]',
      circleHover: 'group-hover:bg-[#111111] group-hover:text-white',
    },
    secondary: {
      btn: 'bg-transparent text-[#111111] hover:text-white ring-1 ring-[#111111]/70',
      fill: 'bg-[#111111]',
      circle: 'bg-[#111111] text-white',
      circleHover: 'group-hover:bg-white group-hover:text-[#111111]',
    },
    dark: {
      btn: 'bg-[#111111] text-white hover:text-[#111111] ring-1 ring-white/20',
      fill: 'bg-white',
      circle: 'bg-white text-[#111111]',
      circleHover: 'group-hover:bg-[#111111] group-hover:text-white',
    },
    light: {
      btn: 'bg-white text-[#111111] hover:text-white ring-1 ring-white',
      fill: 'bg-[#111111]',
      circle: 'bg-[#111111] text-white',
      circleHover: 'group-hover:bg-white group-hover:text-[#111111]',
    },
  };
  const p = palette[variant];
  const Icon = external ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      <span aria-hidden className={cn('absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-okko group-hover:scale-x-100', p.fill)} />
      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-500 ease-okko group-hover:-translate-y-[110%]">{children}</span>
        <span aria-hidden className="absolute left-0 top-0 block translate-y-[110%] transition-transform duration-500 ease-okko group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {arrow && (
        <span className={cn('relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-500 ease-okko', size === 'lg' ? 'h-12 w-12' : 'h-9 w-9', p.circle, p.circleHover)}>
          <Icon className={cn('absolute transition-transform duration-500 ease-okko group-hover:translate-x-8', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} strokeWidth={1.75} />
          <Icon className={cn('absolute -translate-x-8 transition-transform duration-500 ease-okko group-hover:translate-x-0', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} strokeWidth={1.75} />
        </span>
      )}
    </>
  );

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className={cn('inline-flex', className)}>
      {href ? (
        <Link href={href} className={cn(base, p.btn)} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          {content}
        </Link>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={cn(base, p.btn)}>
          {content}
        </button>
      )}
    </motion.div>
  );
}
