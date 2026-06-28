'use client';

import { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface TocHeading {
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
export function useArticleHeadings(articleRef: React.RefObject<HTMLElement | null>) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Build the TOC straight from the rendered article DOM. rehype-slug gives
  // every heading a stable id, so what we read here is exactly what the user
  // sees and exactly what we link to.
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const collect = () => {
      const nodes = article.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id]');
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
            (h, i) => h.id === next[i].id && h.text === next[i].text && h.level === next[i].level
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
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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
export function TocList({ headings, activeId, onNavigate }: TocListProps) {
  if (headings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Sections will appear here as you scroll.</p>
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
      <span aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-border" />
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
export function MobileTocSheet({
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
          <TocList headings={headings} activeId={activeId} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
