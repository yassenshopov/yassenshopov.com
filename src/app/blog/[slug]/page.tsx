import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import blogData from '@/data/blog-posts.json';
import { BlogContent } from '@/components/blog/BlogContent';

export function generateStaticParams() {
  return blogData.posts.map((post) => ({
    slug: post.slug,
  }));
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

  // Calculate reading time based on content length (assuming 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
  };

  // Add reading time to post objects
  const postWithReadingTime = { ...post, readingTime: calculateReadingTime(post.content) };
  const prevPostWithReadingTime = prevPost ? { ...prevPost, readingTime: calculateReadingTime(prevPost.content) } : null;
  const nextPostWithReadingTime = nextPost ? { ...nextPost, readingTime: calculateReadingTime(nextPost.content) } : null;

  return (
    <Layout>
      <BlogContent 
        post={postWithReadingTime} 
        prevPost={prevPostWithReadingTime} 
        nextPost={nextPostWithReadingTime} 
      />
    </Layout>
  );
} 