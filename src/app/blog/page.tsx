import React from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { getAllPosts, type ResolvedPost } from '@/lib/blog';
import { BlogHero } from '@/components/blog/BlogHero';
import { SectionHeading } from '@/components/SectionHeading';
import { formatDate } from '@/lib/format-date';

export default function BlogPage() {
  // Already sorted newest-first by the data module (no in-place mutation).
  const posts = getAllPosts();

  const thumbnails = posts
    .map((post) => post.coverImage)
    .filter((src): src is string => Boolean(src));

  // Group posts by year while preserving the date-desc order.
  const postsByYear = posts.reduce<Record<string, ResolvedPost[]>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    (acc[year] ||= []).push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  const content = (
    <>
      <BlogHero thumbnails={thumbnails} />

      {/* Blog Posts Grid */}
      <section id="blog-posts" className="py-24 bg-background scroll-mt-16">
        <div className="container mx-auto px-4 space-y-16">
          {years.map((year) => (
            <div key={year}>
              <SectionHeading
                title={year}
                label={`Posts from ${year}`}
                className="mb-8"
                headingClassName="text-5xl md:text-6xl"
                aside={`${postsByYear[year].length} ${
                  postsByYear[year].length === 1 ? 'post' : 'posts'
                }`}
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {postsByYear[year].map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden group border-0 shadow-none transition-colors duration-300 h-full flex flex-col">
                      <div className="relative aspect-video">
                        <Image
                          src={post.coverImage || '/resources/images/blog/default-cover.webp'}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <div className="p-6 flex flex-col grow">
                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 grow">{post.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  return <Layout>{content}</Layout>;
}
