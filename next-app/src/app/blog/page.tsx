import React from 'react';
import { compareDesc } from 'date-fns';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import blogData from '@/data/blog-posts.json';
import type { BlogPost } from '@/types/blog';

export default function BlogPage() {
  const posts = blogData.posts.sort((a: BlogPost, b: BlogPost) => 
    compareDesc(new Date(a.date), new Date(b.date))
  );

  const content = (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, ideas, and insights on productivity, personal development, and life engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video">
                  <Image
                    src={post.coverImage || '/resources/images/blog/default-cover.webp'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{post.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  return <Layout>{content}</Layout>;
} 