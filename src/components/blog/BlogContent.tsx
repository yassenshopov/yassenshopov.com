'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Mail,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import {
  InlineShareButtons,
  ShareRail,
  SharePopover,
} from '@/components/blog/BlogShare';

interface TocHeading {
  level: number;
  text: string;
  id: string;
}

function TableOfContents({
  articleRef,
}: {
  articleRef: React.RefObject<HTMLElement | null>;
}) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Build the TOC straight from the rendered article DOM. rehype-slug gives
  // every heading a stable id, so what we read here is exactly what the user
  // sees and exactly what we link to.
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const collect = () => {
      const nodes = article.querySelectorAll<HTMLElement>(
        'h1[id], h2[id], h3[id]'
      );
      const fromArticle: TocHeading[] = Array.from(nodes)
        .map((node) => ({
          level: Number(node.tagName.substring(1)),
          text: (node.textContent || '').trim(),
          id: node.id,
        }))
        .filter((h) => h.text.length > 0);

      const permanent: TocHeading[] = [];
      if (document.getElementById('author-section')) {
        permanent.push({
          level: 2,
          text: 'About the Author',
          id: 'author-section',
        });
      }
      if (document.getElementById('newsletter-section')) {
        permanent.push({
          level: 2,
          text: 'Subscribe to Newsletter',
          id: 'newsletter-section',
        });
      }

      setHeadings((prev) => {
        const next = [...fromArticle, ...permanent];
        if (
          prev.length === next.length &&
          prev.every(
            (h, i) =>
              h.id === next[i].id &&
              h.text === next[i].text &&
              h.level === next[i].level
          )
        ) {
          return prev;
        }
        return next;
      });
    };

    collect();

    // ReactMarkdown can mount asynchronously; watch for late additions.
    const observer = new MutationObserver(collect);
    observer.observe(article, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [articleRef]);

  // Track the currently visible heading.
  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: [0, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const minLevel = headings.length
    ? Math.min(...headings.map((h) => h.level))
    : 1;

  return (
    <nav className="space-y-1">
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-medium text-base">Table of Contents</h3>
        <p className="text-sm text-muted-foreground mt-1">Jump to section</p>
      </div>
      {headings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sections yet.</p>
      ) : (
        headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            aria-current={activeId === heading.id ? 'location' : undefined}
            className={`group flex items-center w-full text-sm py-1 ${
              activeId === heading.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ paddingLeft: `${(heading.level - minLevel) * 16}px` }}
          >
            <span
              className={`mr-2 opacity-0 transition-opacity group-hover:opacity-100 ${
                activeId === heading.id ? 'opacity-100' : ''
              }`}
            >
              <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-left">{heading.text}</span>
          </button>
        ))
      )}
    </nav>
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
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em]">
            Newsletter
          </span>
        </div>
        <h4 className="text-sm font-semibold mb-1.5 leading-snug">
          Get Life Engineering&trade;
        </h4>
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

/**
 * Extracts a YouTube video id (and optional start time in seconds) from any of
 * the common URL shapes: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID,
 * youtube.com/shorts/ID. Returns null when the URL is not a YouTube video.
 */
function parseYouTubeUrl(
  href: string | undefined
): { videoId: string; start?: number } | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  let videoId: string | undefined;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') ?? undefined;
    } else {
      const m = url.pathname.match(/^\/(?:embed|shorts|v)\/([\w-]{6,})/);
      if (m) videoId = m[1];
    }
  } else if (host === 'youtu.be') {
    const m = url.pathname.match(/^\/([\w-]{6,})/);
    if (m) videoId = m[1];
  }
  if (!videoId) return null;

  const tParam = url.searchParams.get('t') ?? url.searchParams.get('start');
  const start = tParam ? Number(tParam.replace(/[^\d]/g, '')) : undefined;
  return { videoId, start: Number.isFinite(start) ? start : undefined };
}

function YouTubeEmbed({
  videoId,
  start,
  title,
}: {
  videoId: string;
  start?: number;
  title: string;
}) {
  const params = new URLSearchParams({ rel: '0' });
  if (start) params.set('start', String(start));
  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border bg-black shadow-sm">
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

/**
 * Returns true when a hast node represents the `[![alt](thumb)](youtube-url)`
 * markdown pattern that the `a` override upgrades into a <YouTubeEmbed>. The
 * `p` override uses this to skip the wrapping <p> so we don't emit a <div>
 * inside a <p> (invalid HTML, causes a React hydration error).
 */
function isYouTubeEmbedNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const n = node as {
    type?: string;
    tagName?: string;
    properties?: { href?: unknown };
    children?: Array<{ type?: string; tagName?: string; value?: string }>;
  };
  if (n.type !== 'element' || n.tagName !== 'a') return false;
  const href =
    typeof n.properties?.href === 'string' ? n.properties.href : undefined;
  if (!parseYouTubeUrl(href)) return false;
  const significant = (n.children ?? []).filter(
    (c) => !(c.type === 'text' && /^\s*$/.test(c.value ?? ''))
  );
  return (
    significant.length === 1 &&
    significant[0].type === 'element' &&
    significant[0].tagName === 'img'
  );
}

/**
 * Detects `[![alt](thumb)](youtube-url)` markdown and upgrades it to a real
 * embedded YouTube player. Plain YouTube text links are left untouched so they
 * keep working as ordinary links.
 */
const markdownComponents: Components = {
  p({ node, children, ...rest }) {
    // When a paragraph wraps only the YouTube-embed marker, the `a` override
    // below replaces it with a <div>-based <YouTubeEmbed>. Rendering that
    // inside a <p> is invalid HTML, so unwrap the paragraph in that case.
    const kids = (node?.children ?? []).filter(
      (c) =>
        !(
          c.type === 'text' &&
          typeof (c as { value?: string }).value === 'string' &&
          /^\s*$/.test((c as { value: string }).value)
        )
    );
    if (kids.length === 1 && isYouTubeEmbedNode(kids[0])) {
      return <>{children}</>;
    }
    return <p {...rest}>{children}</p>;
  },
  a({ href, children, ...rest }) {
    const yt = parseYouTubeUrl(href);
    if (yt) {
      const kids = Children.toArray(children).filter(
        (c) => !(typeof c === 'string' && c.trim() === '')
      );
      const onlyChild = kids.length === 1 ? kids[0] : null;
      const wrapsImage =
        onlyChild &&
        isValidElement<{ alt?: string }>(onlyChild) &&
        onlyChild.type === 'img';
      if (wrapsImage) {
        const alt =
          (onlyChild as React.ReactElement<{ alt?: string }>).props.alt ||
          'YouTube video';
        return (
          <YouTubeEmbed videoId={yt.videoId} start={yt.start} title={alt} />
        );
      }
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
};

interface BlogContentProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export function BlogContent({ post, prevPost, nextPost }: BlogContentProps) {
  const articleRef = useRef<HTMLElement>(null);

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
              <SharePopover title={post.title} description={post.description} />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex gap-8 xl:gap-12 py-16">
          {/* Floating share rail (desktop) */}
          <aside className="hidden xl:block w-12 shrink-0" aria-label="Share this article">
            <div className="sticky top-32">
              <ShareRail title={post.title} description={post.description} />
            </div>
          </aside>

          {/* Main Content */}
          <article ref={articleRef} className="flex-1 max-w-3xl xl:mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24">
              <ReactMarkdown
                rehypePlugins={[rehypeSlug]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Author Section */}
            <div id="author-section" className="mt-16 p-8 rounded-lg bg-card border">
              <div className="flex items-start gap-6">
                <Image
                  src="/resources/images/main_page/YassenShopov.jpg"
                  alt="Yassen Shopov"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-20 h-20"
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
          </article>

          {/* Sticky Sidebar: TOC + mini newsletter */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <TableOfContents articleRef={articleRef} />
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
              <h2
                id="share-heading"
                className="text-base font-semibold tracking-tight"
              >
                Found this useful? Pass it on.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sharing helps the right people find these ideas.
              </p>
            </div>
            <InlineShareButtons
              title={post.title}
              description={post.description}
            />
          </div>
        </section>

        {/* Newsletter CTA */}
        <NewsletterCTA />

        {/* Previous/Next Navigation */}
        <nav className="max-w-3xl mx-auto border-t pt-8 pb-16" aria-label="Article navigation">
          <div className="grid sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group relative flex items-stretch overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40"
              >
                <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={prevPost.coverImage || '/resources/images/blog/default-cover.webp'}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0 p-4">
                  <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground mb-1.5 uppercase tracking-[0.16em]">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Previous</span>
                  </div>
                  <p className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {prevPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" aria-hidden />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group relative flex items-stretch overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40 sm:col-start-2"
              >
                <div className="flex-1 min-w-0 p-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-[0.65rem] text-muted-foreground mb-1.5 uppercase tracking-[0.16em]">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {nextPost.title}
                  </p>
                </div>
                <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={nextPost.coverImage || '/resources/images/blog/default-cover.webp'}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" aria-hidden />
            )}
          </div>
        </nav>
      </div>
    </>
  );
} 