'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface LibraryTocSection {
  /** Stable key (year as string, or "undated"). */
  key: string;
  /** Visible label, e.g. "2026" or "Wishlist". */
  label: string;
  /** Number of items in this section. */
  count: number;
  /**
   * Cumulative count of items in `allSortedItems` up to and including this
   * section (i.e. the number of items that must be rendered for this section
   * to be fully visible).
   */
  cumulativeCount: number;
}

interface LibraryTableOfContentsProps {
  sections: LibraryTocSection[];
  onJumpTo: (cumulativeCount: number) => void;
}

export function libraryTocSectionId(key: string): string {
  return `library-section-${key}`;
}

export default function LibraryTableOfContents({
  sections,
  onJumpTo,
}: LibraryTableOfContentsProps) {
  const [activeKey, setActiveKey] = useState<string>('');
  // Holds a section we wanted to scroll to but whose element wasn't in the
  // DOM yet — we'll retry once the page has rendered more items.
  const pendingScrollKey = useRef<string | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the topmost intersecting section so the active marker
        // tracks reading order rather than the last one to flip in.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible.length > 0) {
          const id = visible[0].target.id;
          const key = id.replace(/^library-section-/, '');
          setActiveKey(key);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    sections.forEach((section) => {
      const el = document.getElementById(libraryTocSectionId(section.key));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

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
    onJumpTo(section.cumulativeCount);
    const el = document.getElementById(libraryTocSectionId(section.key));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      pendingScrollKey.current = section.key;
    }
  };

  if (sections.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 lg:right-8 z-40 hidden md:block group">
      {/* Minimal lines (default) */}
      <div className="absolute right-0 top-0 group-hover:opacity-0 group-hover:invisible transition-[opacity,visibility] duration-300 bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-xl">
        <nav className="space-y-3" aria-label="Library sections">
          {sections.map((section) => {
            const isActive = activeKey === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => handleJump(section)}
                className="block h-[2px] rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? 'var(--primary)'
                    : 'var(--muted-foreground)',
                  opacity: isActive ? 1 : 0.3,
                  width: isActive ? '20px' : '12px',
                }}
                aria-label={`Jump to ${section.label}`}
              />
            );
          })}
        </nav>
      </div>

      {/* Expanded panel (hover) */}
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-[opacity,visibility] duration-300 bg-card rounded-lg p-4 shadow-xl min-w-[200px]">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
          On this page
        </h3>
        <nav className="space-y-1" aria-label="Library sections">
          {sections.map((section) => {
            const isActive = activeKey === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => handleJump(section)}
                className={[
                  'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                ].join(' ')}
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'rotate-90' : ''
                  }`}
                />
                <span className="flex-1 text-left tabular-nums">
                  {section.label}
                </span>
                <span
                  className={[
                    'text-[10px] font-semibold tabular-nums',
                    isActive ? 'text-primary' : 'text-muted-foreground/70',
                  ].join(' ')}
                >
                  {section.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
