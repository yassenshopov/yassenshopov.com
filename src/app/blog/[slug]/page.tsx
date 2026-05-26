import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import blogData from '@/data/blog-posts.json';
import { BlogContent } from '@/components/blog/BlogContent';
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return blogData.posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title.replace(/\s*[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]+\s*$/u, ''),
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : undefined,
      url: `/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const currentIndex = blogData.posts.findIndex((post) => post.slug === resolvedParams.slug);
  const post = blogData.posts[currentIndex];
  const prevPost = currentIndex < blogData.posts.length - 1 ? blogData.posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogData.posts[currentIndex - 1] : null;

  if (!post) {
    notFound();
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
  };

  const wordCount = post.content.trim().split(/\s+/).length;

  const postWithReadingTime = { ...post, readingTime: calculateReadingTime(post.content) };
  const prevPostWithReadingTime = prevPost ? { ...prevPost, readingTime: calculateReadingTime(prevPost.content) } : null;
  const nextPostWithReadingTime = nextPost ? { ...nextPost, readingTime: calculateReadingTime(nextPost.content) } : null;

  const jsonLd = [
    blogPostingJsonLd({ ...post, wordCount }),
    breadcrumbJsonLd([
      { name: "Home", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: post.title, href: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent
        post={postWithReadingTime}
        prevPost={prevPostWithReadingTime}
        nextPost={nextPostWithReadingTime}
      />
    </Layout>
  );
}
