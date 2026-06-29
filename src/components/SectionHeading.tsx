import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** The heading text/content. */
  title: ReactNode;
  /** Accessible label for the heading row (`aria-label` on the wrapper). */
  label?: string;
  /** Optional small uppercase text shown after the divider. */
  aside?: ReactNode;
  /** Extra wrapper classes (e.g. a different bottom margin). */
  className?: string;
  /** Override the default `<h2>` typography. */
  headingClassName?: string;
  /** Override the default aside typography. */
  asideClassName?: string;
}

/**
 * The repeated "big heading + flex-1 hairline divider (+ optional aside)" row
 * used across the home, projects, blog, and library sections. Extracted from
 * ~10 hand-copied instances so the shared structure lives in one place.
 */
export function SectionHeading({
  title,
  label,
  aside,
  className,
  headingClassName,
  asideClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex items-end gap-6 mb-10', className)} aria-label={label}>
      <h2
        className={cn(
          'text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground',
          headingClassName
        )}
      >
        {title}
      </h2>
      <div className="flex-1 pb-2 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        {aside != null && (
          <span
            className={cn(
              'text-xs uppercase tracking-[0.18em] text-muted-foreground',
              asideClassName
            )}
          >
            {aside}
          </span>
        )}
      </div>
    </div>
  );
}
