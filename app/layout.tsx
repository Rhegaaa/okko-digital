import type { Metadata } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { SITE } from '@/lib/constants';


export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

function baseUrl() {
  try {
    return new URL(process.env.NEXTAUTH_URL ?? SITE.url);
  } catch {
    return new URL(SITE.url);
  }
}

export const metadata: Metadata = {
  metadataBase: baseUrl(),
  title: {
    default: 'OKKO — Agence de fiches Google',
    template: '%s — OKKO Digital',
  },
  description:
    'OKKO optimise et gère les fiches Google des établissements locaux en Haute-Savoie et dans le Genevois.',
  applicationName: 'OKKO Digital',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OKKO Digital',
    title: 'OKKO — Agence de fiches Google',
    description: 'Optimisation de fiches Google, avis clients et suivi de votre présence locale.',
    images: [{ url: '/gmb-assets/og.png', width: 1200, height: 630, alt: 'OKKO — Agence de fiches Google' }],
  },
  twitter: { card: 'summary_large_image', title: 'OKKO Digital', images: ['/gmb-assets/og.png'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${instrument.variable} ${mono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
          {/* IMPORTANT: Do not remove — handles chunk loading race conditions in the dev server */}
          <ChunkLoadErrorHandler />
        </ThemeProvider>
      </body>
    </html>
  );
}
