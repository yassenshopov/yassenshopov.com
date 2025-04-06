"use client";

import Layout from '@/components/Layout';
import NotionTemplatesList, { templates } from '@/components/NotionTemplatesList';
import { NotionHero } from '@/components/notion/NotionHero';

export default function NotionTemplatesPage() {
  return (
    <Layout>
      <NotionHero templateCount={templates.length} />
      <NotionTemplatesList />
    </Layout>
  );
} 