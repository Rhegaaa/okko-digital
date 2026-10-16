import { growthBySlug } from '@/lib/growthpilot/public';
import { GrowthArticleView } from '@/components/site/growth-article';
import { notFound } from 'next/navigation';
import { SEO_PAGES, getSeoPage } from '@/lib/seo-pages-data';
import { SeoPageView } from '@/components/site/seo-page';
import { pageMeta } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return SEO_PAGES.filter(page => page.kind === 'guide').map(page => ({ slug: page.path.split('/').pop()! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/guides/${slug}`);
  if (!page || page.kind !== 'guide') {
    const row = await growthBySlug(slug);
    if (!row) return {};
    const meta = pageMeta({path:`/guides/${slug}`,title:row.title,description:row.description,article:true});
    return {...meta,openGraph:{...meta.openGraph,type:'article',publishedTime:row.publishedAt?.toISOString(),modifiedTime:row.updatedAt.toISOString()}};
  }
  return pageMeta({ path: page.path, title: page.title, description: page.description, article: true });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(`/guides/${slug}`);
  if (!page || page.kind !== 'guide') {
    const row = await growthBySlug(slug);
    if (!row) notFound();
    return <GrowthArticleView row={row} />;
  }
  return <SeoPageView page={page} />;
}
