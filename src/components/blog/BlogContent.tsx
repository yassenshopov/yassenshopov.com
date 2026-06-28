'use client';

import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronLeft,
  ChevronsRight,
  Mail,
  Sparkles,
  CalendarDays,
  Type,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InlineShareButtons, ShareRail, SharePopover } from '@/components/blog/BlogShare';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { useArticleHeadings, TocList, MobileTocSheet } from '@/components/blog/blog-toc';
import { markdownComponents } from '@/components/blog/markdown-renderers';

/**
 * Floating "back to top" button that fades in once the reader has scrolled
 * past the hero. Lives bottom-right and shares vertical space with the
 * mobile TOC button (which is bottom-left), so they never collide.
 */
function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:text-primary ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

function NewsletterCTA() {
  return (
    <section
      id="newsletter-section"
      aria-labelledby="newsletter-heading"
      className="relative max-w-3xl mx-auto my-12 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-primary/10 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span className="text-[0.7rem] md:text-xs font-medium uppercase tracking-[0.18em]">
              Life Engineering&trade;
            </span>
          </div>

          <h2
            id="newsletter-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight mb-3 max-w-md"
          >
            Enjoyed this? Get the next one in your inbox.
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6 leading-relaxed">
            A personal letter full of stories, reflections and insights &mdash; written to expand
            your vision and inspire how you think, live and create.
          </p>

          <div className="w-full max-w-md">
            <KitNewsletterForm variant="inline" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.7rem] md:text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Weekly
            </span>
            <span className="hidden sm:inline text-border" aria-hidden>
              &bull;
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              No spam &mdash; unsubscribe anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarNewsletterCard() {
  const scrollToNewsletter = () => {
    const el = document.getElementById('newsletter-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl"
      />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 text-primary mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em]">Newsletter</span>
        </div>
        <h4 className="text-sm font-semibold mb-1.5 leading-snug">Get Life Engineering&trade;</h4>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Weekly letters on intentional living, building, and thinking.
        </p>
        <button
          type="button"
          onClick={scrollToNewsletter}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}

interface BlogContentProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
  wordCount: number;
}

export function BlogContent({ post, prevPost, nextPost, wordCount }: BlogContentProps) {
  const articleRef = useRef<HTMLElement>(null);
  const { headings, activeId } = useArticleHeadings(articleRef);

  const formattedWordCount = useMemo(
    () => new Intl.NumberFormat('en-US').format(wordCount),
    [wordCount]
  );

  return (
    <>
      <ReadingProgress />

      {/* Hero Section */}
      <section
        aria-labelledby="article-title"
        className="relative isolate overflow-hidden bg-gradient-to-b from-background to-muted/40 pt-8 md:pt-12"
      >
        {post.coverImage && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-15 dark:opacity-25 [.olive_&]:opacity-20"
              unoptimized
            />
            {/* Top-down fade so the navbar area stays clean, plus a strong
                bottom fade so the article body emerges from the hero. */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
            {/* Soft brand glow to tie the hero to the blog index aesthetic */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 80% 0%, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 55%)',
              }}
            />
          </div>
        )}

        <div className="container relative mx-auto px-4 pb-12 md:pb-16">
          {/* Breadcrumb / back link */}
          <div className="mb-8 md:mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>All posts</span>
            </Link>
          </div>

          <div className="max-w-3xl">
            {/* Tags */}
            {post.tags.length > 0 && (
              <ul className="mb-5 flex flex-wrap items-center gap-1.5">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[0.7rem] font-medium text-primary">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <h1
              id="article-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1] text-foreground mb-5"
            >
              {post.title}
            </h1>

            <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed mb-7">
              {post.description}
            </p>

            {/* Meta row: author + date + reading time + word count + share */}
            <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
                  <Image
                    src="/resources/images/main_page/YassenShopov.jpg"
                    alt={post.author}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">
                    <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                    <span aria-hidden> · </span>
                    <span>
                      {formatDistanceToNow(new Date(post.date), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {post.readingTime && (
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5" />
                  {formattedWordCount} words
                </span>
                <SharePopover title={post.title} description={post.description} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex gap-8 xl:gap-12 py-12 md:py-16">
          {/* Floating share rail (desktop) */}
          <aside className="hidden xl:block w-12 shrink-0" aria-label="Share this article">
            <div className="sticky top-32">
              <ShareRail title={post.title} description={post.description} />
            </div>
          </aside>

          {/* Main Content */}
          <article ref={articleRef} className="flex-1 max-w-3xl xl:mx-auto">
            <div
              className="
                prose prose-lg dark:prose-invert max-w-none
                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
                prose-h3:mt-10 prose-h3:mb-4
                prose-p:leading-[1.75]
                prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:opacity-90
                prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-md prose-blockquote:px-5 prose-blockquote:py-3
                [&_blockquote_p:first-of-type::before]:content-none [&_blockquote_p:last-of-type::after]:content-none
                prose-strong:text-foreground prose-strong:font-semibold
                prose-li:marker:text-primary/60
                prose-hr:my-12
              "
            >
              <ReactMarkdown rehypePlugins={[rehypeSlug]} components={markdownComponents}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* End-of-article footer rule */}
            <div
              aria-hidden
              className="mx-auto mt-12 flex items-center gap-3 text-muted-foreground/60"
            >
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-[0.22em]">End of article</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Author Section */}
            <section
              id="author-section"
              aria-labelledby="author-heading"
              className="mt-12 scroll-mt-24 rounded-2xl border bg-card p-6 md:p-7"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <Image
                  src="/resources/images/main_page/YassenShopov.jpg"
                  alt="Yassen Shopov"
                  width={72}
                  height={72}
                  className="h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full object-cover ring-2 ring-background"
                />
                <div className="flex-1">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    Written by
                  </p>
                  <h3 id="author-heading" className="text-lg md:text-xl font-bold mb-2">
                    Yassen Shopov
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Exploring the intersection of productivity, technology, and personal
                    development. Building tools and sharing insights to help others live more
                    intentionally.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/about">More about me</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/blog" className="group">
                        Browse all posts
                        <ChevronsRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* Sticky Sidebar: TOC + mini newsletter (desktop only) */}
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Article navigation">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    On this page
                  </h3>
                  {headings.length > 0 && (
                    <span className="text-[0.65rem] text-muted-foreground tabular-nums">
                      {headings.length} {headings.length === 1 ? 'section' : 'sections'}
                    </span>
                  )}
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                  <TocList headings={headings} activeId={activeId} />
                </div>
              </div>
              <SidebarNewsletterCard />
            </div>
          </aside>
        </div>

        {/* Share Section */}
        <section
          aria-labelledby="share-heading"
          className="max-w-3xl mx-auto border-t border-b py-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="share-heading" className="text-base font-semibold tracking-tight">
                Found this useful? Pass it on.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sharing helps the right people find these ideas.
              </p>
            </div>
            <InlineShareButtons title={post.title} description={post.description} />
          </div>
        </section>

        {/* Newsletter CTA */}
        <NewsletterCTA />

        {/* Previous/Next Navigation */}
        <nav className="max-w-3xl mx-auto border-t pt-8 pb-16" aria-label="Adjacent articles">
          <p className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Keep reading
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group relative flex items-stretch overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={prevPost.coverImage || '/resources/images/blog/default-cover.webp'}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-[0.65rem] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Previous</span>
                  </div>
                  <p className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {prevPost.title}
                  </p>
                  <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                    <time dateTime={prevPost.date}>
                      {format(new Date(prevPost.date), 'MMM d, yyyy')}
                    </time>
                    {prevPost.readingTime && (
                      <>
                        <span aria-hidden> · </span>
                        <span>{prevPost.readingTime}</span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" aria-hidden />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group relative flex items-stretch overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-sm sm:col-start-2"
              >
                <div className="flex-1 min-w-0 p-4 text-right">
                  <div className="mb-1.5 flex items-center justify-end gap-2 text-[0.65rem] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {nextPost.title}
                  </p>
                  <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                    <time dateTime={nextPost.date}>
                      {format(new Date(nextPost.date), 'MMM d, yyyy')}
                    </time>
                    {nextPost.readingTime && (
                      <>
                        <span aria-hidden> · </span>
                        <span>{nextPost.readingTime}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={nextPost.coverImage || '/resources/images/blog/default-cover.webp'}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" aria-hidden />
            )}
          </div>
        </nav>
      </div>

      {/* Floating helpers */}
      <MobileTocSheet headings={headings} activeId={activeId} />
      <BackToTopButton />
    </>
  );
}
