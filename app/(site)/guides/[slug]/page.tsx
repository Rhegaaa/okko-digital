import { notFound } from 'next/navigation';
import { SEO_PAGES, getSeoPage } from '@/lib/seo-pages-data';
import { SeoPageView } from '@/components/site/seo-page';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return SEO_PAGES.filter(page => page.kind === 'guide').map(page => ({ slug: page.path.split('/').pop()! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/guides/${slug}`);
  if (!page || page.kind !== 'guide') return {};
  return pageMeta({ path: page.path, title: page.title, description: page.description, article: true });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/guides/${slug}`);
  if (!page || page.kind !== 'guide') notFound();
  return <SeoPageView page={page} />;
}
