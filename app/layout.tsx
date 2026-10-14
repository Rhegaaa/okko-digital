import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { SITE } from '@/lib/constants';





export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'OKKO — Agence de fiches Google',
    template: '%s — OKKO Digital',
  },
  description:
    'OKKO optimise et gère les fiches Google des établissements.',
  applicationName: 'OKKO Digital',
  icons: { icon: '/gmb-assets/favicon.svg', shortcut: '/gmb-assets/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OKKO Digital',
    title: 'OKKO — Agence de fiches Google',
    description: 'Optimisation de fiches Google, avis clients et suivi de votre présence locale.',
    images: [{ url: '/gmb-assets/og.png', width: 1200, height: 630, alt: 'OKKO — Agence de fiches Google' }],
  },
  twitter: { card: 'summary_large_image', title: 'OKKO Digital', images: ['/gmb-assets/og.png'] },
  robots: { index: process.env.VERCEL_ENV !== 'preview', follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
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
