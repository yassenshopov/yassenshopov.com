'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Share2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Components } from 'react-markdown';

function TableOfContents({ content }: { content: string }) {
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    // Include both markdown-generated and HTML headings
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], #author-section, #newsletter-section');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  // Extract headings from both markdown and HTML content
  const extractHeadings = (content: string) => {
    const headings = [];
    
    // Extract Markdown headings
    const markdownHeadings = content.split('\n')
      .filter(line => /^#{1,3}\s+[^#\n]+/.test(line))
      .map(line => {
        const level = (line.match(/^#+/) || ['#'])[0].length;
        const text = line.replace(/^#+\s+/, '').trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { level, text, id };
      });
    
    // Extract HTML h2 elements
    const htmlHeadingRegex = /<h2[^>]*>(.*?)<\/h2>/g;
    const htmlHeadings = Array.from(content.matchAll(htmlHeadingRegex))
      .map(match => {
        const text = match[1].replace(/<[^>]+>/g, '').trim(); // Remove any nested HTML tags
        return {
          level: 2,
          text,
          id: text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        };
      });

    // Combine and sort headings by their position in the content
    headings.push(...markdownHeadings, ...htmlHeadings);
    
    return headings.filter(heading => heading.text && heading.text.length > 0);
  };

  const contentHeadings = extractHeadings(content);

  // Add permanent sections
  const allSections = [
    ...contentHeadings,
    { level: 2, text: "About the Author", id: "author-section" },
    { level: 2, text: "Subscribe to Newsletter", id: "newsletter-section" },
  ];

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="space-y-1">
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-medium text-base">Table of Contents</h3>
        <p className="text-sm text-muted-foreground mt-1">Jump to section</p>
      </div>
      {allSections.map((heading, index) => (
        <button
          key={index}
          onClick={() => scrollToHeading(heading.id)}
          className={`group flex items-center w-full text-sm py-1 ${
            activeHeading === heading.id
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
        >
          <span className={`mr-2 opacity-0 transition-opacity group-hover:opacity-100 ${
            activeHeading === heading.id ? "opacity-100" : ""
          }`}>
            <ChevronRight className="w-3 h-3" />
          </span>
          <span className="text-left">{heading.text}</span>
        </button>
      ))}
    </nav>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} className="group">
      <Share2 className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}

interface BlogContentProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export function BlogContent({ post, prevPost, nextPost }: BlogContentProps) {
  // Custom components for ReactMarkdown
  const components: Components = {
    h1: ({ children }) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return <h3 id={id}>{children}</h3>;
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end bg-gradient-to-b from-background to-muted">
        {post.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        )}
        <div className="container relative z-10 mx-auto px-4 pb-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex gap-16 py-16">
          {/* Main Content */}
          <article className="flex-1 max-w-3xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown components={components}>{post.content}</ReactMarkdown>
            </div>

            {/* Author Section */}
            <div id="author-section" className="mt-16 p-8 rounded-lg bg-card border">
              <div className="flex items-start gap-6">
                <Image
                  src="/resources/images/yassen.webp"
                  alt="Yassen Shopov"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">Written by Yassen Shopov</h3>
                  <p className="text-muted-foreground mb-4">
                    Exploring the intersection of productivity, technology, and personal development.
                    Building tools and sharing insights to help others live more intentionally.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/about">More about me</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div id="newsletter-section" className="mt-16">
              <KitNewsletterForm />
            </div>
          </article>

          {/* Table of Contents Sidebar */}
          <div className="hidden lg:block w-64 relative">
            <div className="sticky top-24 rounded-lg border bg-card p-6">
              <TableOfContents content={post.content} />
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="max-w-3xl mx-auto border-t py-8">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="font-medium">Share this article:</span>
            <ShareButton />
          </div>
        </div>

        {/* Previous/Next Navigation */}
        <nav className="max-w-3xl mx-auto border-t py-8 mb-16">
          <div className="flex justify-between gap-8">
            {prevPost && (
              <Link 
                href={`/blog/${prevPost.slug}`}
                className="group flex-1"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Previous Article
                </div>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="group flex-1 text-right"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                  Next Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
} 