import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import dynamic from 'next/dynamic';

const BlogContent = dynamic(() =>
  import('@/components/blog/BlogContent').then((mod) => mod.BlogContent)
);
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = getPostBySlug(slug);
  if (!resolved) return {};
  const { post } = resolved;

  return {
    title: post.title.replace(/\s*[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]+\s*$/u, ''),
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : undefined,
      url: `/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = getPostBySlug(slug);

  if (!resolved) {
    notFound();
  }

  const { post, prevPost, nextPost } = resolved;

  const jsonLd = [
    blogPostingJsonLd({ ...post, wordCount: post.wordCount }),
    breadcrumbJsonLd([
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: post.title, href: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent post={post} prevPost={prevPost} nextPost={nextPost} wordCount={post.wordCount} />
    </Layout>
  );
}
