'use client';

import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export interface LibraryTocSection {
  /** Stable key (year as string, or "undated"). */
  key: string;
  /** Visible label, e.g. "2026" or "Wishlist". */
  label: string;
  /** Number of items in this section. */
  count: number;
  /**
   * How many items from the start of `allSortedItems` must be paginated in so
   * every card in this year section can render.
   */
  itemsToReveal: number;
}

interface LibraryTableOfContentsProps {
  sections: LibraryTocSection[];
  /** Year keys currently rendered in the list (infinite scroll). */
  mountedSectionKeys: string[];
  onJumpTo: (itemsToReveal: number) => void;
}

/** Sticky header offset + scroll-margin on section wrappers. */
const SCROLL_MARKER_PX = 112;

export function libraryTocSectionId(key: string): string {
  return `library-section-${key}`;
}

const panelEase = [0.32, 0.72, 0, 1] as const;

export default function LibraryTableOfContents({
  sections,
  mountedSectionKeys,
  onJumpTo,
}: LibraryTableOfContentsProps) {
  const [activeKey, setActiveKey] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);
  // Holds a section we wanted to scroll to but whose element wasn't in the
  // DOM yet — we'll retry once the page has rendered more items.
  const pendingScrollKey = useRef<string | null>(null);

  /**
   * Scroll-spy: last section whose top has crossed the marker line (reading
   * top-to-bottom). IntersectionObserver on whole year blocks fails because tall
   * sections stay "intersecting" long after their heading has scrolled past.
   */
  const syncActiveSection = useCallback(() => {
    if (sections.length === 0) return;

    let crossed: string | null = null;
    let firstMounted: string | null = null;

    for (const section of sections) {
      const el = document.getElementById(libraryTocSectionId(section.key));
      if (!el) continue;
      if (!firstMounted) firstMounted = section.key;
      if (el.getBoundingClientRect().top <= SCROLL_MARKER_PX) {
        crossed = section.key;
      }
    }

    const next = crossed ?? firstMounted;
    if (next) {
      setActiveKey((prev) => (prev === next ? prev : next));
    }
  }, [sections]);

  useEffect(() => {
    syncActiveSection();
  }, [syncActiveSection, mountedSectionKeys]);

  useEffect(() => {
    const scheduleSync = () => {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = null;
        syncActiveSection();
      });
    };

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);
    return () => {
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      if (scrollRaf.current !== null) cancelAnimationFrame(scrollRaf.current);
    };
  }, [syncActiveSection]);

  // Retry a pending scroll after the page has revealed more items.
  useEffect(() => {
    if (!pendingScrollKey.current) return;
    const id = libraryTocSectionId(pendingScrollKey.current);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      pendingScrollKey.current = null;
    }
  });

  const handleJump = (section: LibraryTocSection) => {
    onJumpTo(section.itemsToReveal);
    const el = document.getElementById(libraryTocSectionId(section.key));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      pendingScrollKey.current = section.key;
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    setExpanded(false);
  };

  if (sections.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="fixed top-24 right-4 lg:right-8 z-40 hidden md:block outline-none"
      tabIndex={0}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={handleBlur}
    >
      <div className="relative">
        {/* Compact decorative rail — in-flow so the fixed anchor keeps a stable size. */}
        <motion.div
          aria-hidden
          className="pointer-events-none rounded-lg border border-border bg-card/85 py-2.5 pl-2 pr-2 backdrop-blur-xs shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto"
          initial={false}
          animate={{
            opacity: expanded ? 0 : 1,
            scale: expanded ? 0.96 : 1,
          }}
          transition={{ duration: 0.18, ease: panelEase }}
        >
          <nav
            aria-label="Library sections"
            className="relative flex flex-col items-end gap-[11px] pr-0.5"
          >
            <span aria-hidden className="absolute right-0 top-0 bottom-0 w-px bg-border/80" />
            {sections.map((section) => {
              const isActive = activeKey === section.key;
              return (
                <span
                  key={section.key}
                  className="relative flex h-[3px] w-7 items-center justify-end"
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-primary"
                    />
                  )}
                  <span
                    className="block rounded-full transition-all duration-300 ease-out"
                    style={{
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                      opacity: isActive ? 1 : 0.4,
                      height: isActive ? '3px' : '2px',
                      width: isActive ? '18px' : '11px',
                    }}
                  />
                </span>
              );
            })}
          </nav>
        </motion.div>

        {/* Interactive panel — expands from the rail (top-right origin). */}
        <motion.div
          className="absolute right-0 top-0 z-10 flex max-h-[calc(100vh-8rem)] w-[200px] flex-col rounded-lg border border-border bg-card p-3 shadow-sm"
          style={{ transformOrigin: 'top right', pointerEvents: expanded ? 'auto' : 'none' }}
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            scale: expanded ? 1 : 0.88,
            x: expanded ? 0 : 14,
          }}
          transition={{ duration: 0.22, ease: panelEase }}
        >
          <nav
            className="flex flex-col gap-px overflow-y-auto -mx-1 px-1"
            aria-label="Library sections"
          >
            {sections.map((section) => {
              const isActive = activeKey === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => handleJump(section)}
                  className={[
                    'flex min-h-9 items-center gap-1.5 w-full px-2 py-1 text-sm leading-tight rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  ].join(' ')}
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`}
                    aria-hidden
                  />
                  <span className="flex-1 text-left tabular-nums">{section.label}</span>
                  <span
                    className={[
                      'text-[11px] font-semibold tabular-nums',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    ].join(' ')}
                  >
                    {section.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </motion.div>
      </div>
    </div>
  );
}
