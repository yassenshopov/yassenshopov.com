'use client';

import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronLeft,
  ChevronsRight,
  ListOrdered,
  Mail,
  Sparkles,
  CalendarDays,
  Type,
} from 'lucide-react';
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  InlineShareButtons,
  ShareRail,
  SharePopover,
} from '@/components/blog/BlogShare';
import { ReadingProgress } from '@/components/blog/ReadingProgress';

interface TocHeading {
  level: number;
  text: string;
  id: string;
}

/**
 * Builds and tracks a table of contents from the rendered article DOM. The
 * data layer is shared between the desktop sidebar and the mobile drawer, so
 * we keep it in a hook that does the DOM observation and IntersectionObserver
 * dance once.
 */
function useArticleHeadings(articleRef: React.RefObject<HTMLElement | null>) {
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

  return { headings, activeId };
}

interface TocListProps {
  headings: TocHeading[];
  activeId: string;
  onNavigate?: (id: string) => void;
}

/**
 * Renders a vertically stacked TOC with a left accent rail that highlights
 * the currently visible heading. Used by both the sticky desktop sidebar
 * and the mobile Sheet drawer.
 */
function TocList({ headings, activeId, onNavigate }: TocListProps) {
  if (headings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sections will appear here as you scroll.
      </p>
    );
  }

  const minLevel = Math.min(...headings.map((h) => h.level));

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate?.(id);
  };

  return (
    <nav aria-label="Table of contents" className="relative">
      {/* Vertical rail behind the list items */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-px bg-border"
      />
      <ul className="space-y-0.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indent = (heading.level - minLevel) * 12;
          return (
            <li key={heading.id} className="relative">
              {/* Active-state accent bar that sits on top of the rail */}
              <span
                aria-hidden
                className={`absolute left-0 top-1.5 bottom-1.5 w-px transition-colors ${
                  isActive ? 'bg-primary' : 'bg-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => handleClick(heading.id)}
                aria-current={isActive ? 'location' : undefined}
                title={heading.text}
                className={`block w-full text-left text-sm leading-snug py-1.5 pr-1 transition-colors ${
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ paddingLeft: `${12 + indent}px` }}
              >
                <span className="line-clamp-2">{heading.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Floating button (mobile + tablet) that opens a Sheet containing the TOC.
 * Hidden on lg+ since the sticky sidebar takes over.
 */
function MobileTocSheet({
  headings,
  activeId,
}: {
  headings: TocHeading[];
  activeId: string;
}) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open table of contents"
          className="lg:hidden fixed bottom-6 left-4 z-40 inline-flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ListOrdered className="h-4 w-4" />
          <span>Contents</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Table of Contents</SheetTitle>
          <SheetDescription>Jump to any section in this article.</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <TocList
            headings={headings}
            activeId={activeId}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
    <figure className="not-prose my-10">
      <div className="overflow-hidden rounded-xl border bg-black shadow-sm">
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
      {title && title !== 'YouTube video' && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground italic">
          {title}
        </figcaption>
      )}
    </figure>
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
 * Returns true when a hast node is a standalone `<img>` (the typical
 * `![alt](src)` markdown shape). The `p` override uses this to upgrade the
 * paragraph into a real `<figure>` with a caption.
 */
function isStandaloneImage(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const n = node as { type?: string; tagName?: string };
  return n.type === 'element' && n.tagName === 'img';
}

interface ImgHastProperties {
  src?: unknown;
  alt?: unknown;
}

/**
 * Renders a block-level <figure> for a standalone markdown image, with the
 * markdown alt text doubling as a visible <figcaption>.
 */
function MarkdownImageFigure({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const caption = alt.trim();
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border bg-muted">
        {/* Plain <img> here keeps us out of next/image's static-import
            requirements — markdown image paths can be arbitrary URLs that
            we don't know dimensions for ahead of time. The lazy/decoding
            hints capture most of the perf benefit anyway. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Detects `[![alt](thumb)](youtube-url)` markdown and upgrades it to a real
 * embedded YouTube player. Plain YouTube text links are left untouched so they
 * keep working as ordinary links. Also wraps standalone images in a <figure>
 * with a caption pulled from the markdown alt text.
 */
const markdownComponents: Components = {
  p({ node, children, ...rest }) {
    // Filter out whitespace-only text nodes so wrapping detection is robust.
    const kids = (node?.children ?? []).filter(
      (c) =>
        !(
          c.type === 'text' &&
          typeof (c as { value?: string }).value === 'string' &&
          /^\s*$/.test((c as { value: string }).value)
        )
    );

    // YouTube embed marker wrapped in <a><img/></a>: unwrap the <p> entirely
    // and let the <a> override render the embed (a <figure>).
    if (kids.length === 1 && isYouTubeEmbedNode(kids[0])) {
      return <>{children}</>;
    }

    // Standalone `![alt](src)` image: replace the <p> with a real <figure>.
    // We do this at the <p> layer (rather than in the <img> override) so
    // that inline-image cases inside prose still render as a plain inline
    // <img> without producing invalid <figure>-inside-<p> HTML.
    if (kids.length === 1 && isStandaloneImage(kids[0])) {
      const imgNode = kids[0] as { properties?: ImgHastProperties };
      const src =
        typeof imgNode.properties?.src === 'string'
          ? imgNode.properties.src
          : '';
      const alt =
        typeof imgNode.properties?.alt === 'string'
          ? imgNode.properties.alt
          : '';
      if (src) {
        return <MarkdownImageFigure src={src} alt={alt} />;
      }
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
    // External links open in a new tab; internal links stay in-place.
    const isExternal =
      typeof href === 'string' && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    // Standalone images are intercepted at the <p> layer above and rendered
    // as a <figure>; this override only fires for the rare inline-image case
    // (an `![alt](src)` mixed with other phrasing inside a paragraph), where
    // a plain inline <img> is the only valid HTML.
    const safeSrc = typeof src === 'string' ? src : '';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="inline-block align-middle rounded-md"
      />
    );
  },
};

interface BlogContentProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
  wordCount: number;
}

export function BlogContent({
  post,
  prevPost,
  nextPost,
  wordCount,
}: BlogContentProps) {
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
                  <p className="text-sm font-medium text-foreground">
                    {post.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
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
                <SharePopover
                  title={post.title}
                  description={post.description}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex gap-8 xl:gap-12 py-12 md:py-16">
          {/* Floating share rail (desktop) */}
          <aside
            className="hidden xl:block w-12 shrink-0"
            aria-label="Share this article"
          >
            <div className="sticky top-32">
              <ShareRail
                title={post.title}
                description={post.description}
              />
            </div>
          </aside>

          {/* Main Content */}
          <article
            ref={articleRef}
            className="flex-1 max-w-3xl xl:mx-auto"
          >
            <div
              className="
                prose prose-lg dark:prose-invert max-w-none
                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
                prose-h3:mt-10 prose-h3:mb-4
                prose-p:leading-[1.75]
                prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:opacity-90
                prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-md prose-blockquote:px-5 prose-blockquote:py-3
                prose-strong:text-foreground prose-strong:font-semibold
                prose-li:marker:text-primary/60
                prose-hr:my-12
              "
            >
              <ReactMarkdown
                rehypePlugins={[rehypeSlug]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* End-of-article footer rule */}
            <div
              aria-hidden
              className="mx-auto mt-12 flex items-center gap-3 text-muted-foreground/60"
            >
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-[0.22em]">
                End of article
              </span>
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
                  <h3
                    id="author-heading"
                    className="text-lg md:text-xl font-bold mb-2"
                  >
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
          <aside
            className="hidden lg:block w-64 shrink-0"
            aria-label="Article navigation"
          >
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    On this page
                  </h3>
                  {headings.length > 0 && (
                    <span className="text-[0.65rem] text-muted-foreground tabular-nums">
                      {headings.length}{' '}
                      {headings.length === 1 ? 'section' : 'sections'}
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
        <nav
          className="max-w-3xl mx-auto border-t pt-8 pb-16"
          aria-label="Adjacent articles"
        >
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
                    src={
                      prevPost.coverImage ||
                      '/resources/images/blog/default-cover.webp'
                    }
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    src={
                      nextPost.coverImage ||
                      '/resources/images/blog/default-cover.webp'
                    }
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
