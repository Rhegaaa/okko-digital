import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = { title: 'OKKO Control', robots: { index: false, follow: false } };

export default function ControlRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${instrument.variable} ${mono.variable} font-sans`}>{children}</div>;
}
