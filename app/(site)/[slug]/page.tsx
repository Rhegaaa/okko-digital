import { notFound } from 'next/navigation';
import { SEO_PAGES, getSeoPage } from '@/lib/seo-pages-data';
import { SeoPageView } from '@/components/site/seo-page';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return SEO_PAGES.filter(page => page.kind === 'service').map(page => ({ slug: page.path.slice(1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/${slug}`);
  if (!page || page.kind !== 'service') return {};
  return pageMeta({ path: page.path, title: page.title, description: page.description });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/${slug}`);
  if (!page || page.kind !== 'service') notFound();
  return <SeoPageView page={page} />;
}
