"use client";

import Layout from '@/components/Layout';
import NotionTemplatesList, { templates } from '@/components/NotionTemplatesList';
import { NotionHero } from '@/components/notion/NotionHero';

const isFree = (price: string) => price === '0$' || price === '$0' || price === '0';

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
