import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import { format } from 'date-fns';
import blogData from '@/data/blog-posts.json';
import type { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogData.posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: BlogPostProps) {
  const post = blogData.posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-16">
          <KitNewsletterForm />
        </div>
      </article>
    </Layout>
  );
} 