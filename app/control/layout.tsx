import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'OKKO Control', robots: { index: false, follow: false } };

export default function ControlRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
