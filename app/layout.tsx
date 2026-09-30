import type { Metadata } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { SITE } from '@/lib/constants';
import { GoogleAnalytics } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_ENABLED = Boolean(GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX');

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
    default: 'OKKO Digital — Le digital au service de votre entreprise',
    template: '%s — OKKO Digital',
  },
  description:
    'OKKO Digital accompagne les TPE, PME, artisans et commerçants : présence locale Google, sites web, automatisation & IA, solutions métier sur mesure.',
  applicationName: 'OKKO Digital',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OKKO Digital',
    title: 'OKKO Digital — Le digital au service de votre entreprise',
    description: 'Présence locale, sites web, automatisation & IA, solutions métier. Pour les entreprises locales qui veulent des outils qui fonctionnent.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'OKKO Digital' }],
  },
  twitter: { card: 'summary_large_image', title: 'OKKO Digital', images: ['/og-image.png'] },
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
      {GA_ENABLED && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
