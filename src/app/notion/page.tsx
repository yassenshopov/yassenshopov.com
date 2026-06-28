import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { NotionHero } from '@/components/notion/NotionHero';
import { templates, isFree } from '@/data/notion-templates';

const NotionTemplatesList = dynamic(() => import('@/components/NotionTemplatesList'));

export default function NotionTemplatesPage() {
  const thumbnails = templates.map((t) => t.image);
  const freeCount = templates.filter((t) => isFree(t.price)).length;
  const categoryCount = new Set(templates.flatMap((t) => t.categories)).size;

  return (
    <Layout>
      <NotionHero
        templateCount={templates.length}
        freeCount={freeCount}
        categoryCount={categoryCount}
        thumbnails={thumbnails}
      />
      <NotionTemplatesList />
    </Layout>
  );
}
