'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const UNDERLINE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 34 };

/** Shared tab label sizing for library + tier list bars. */
export const libraryTabSizeClass = 'px-4 py-3 text-sm sm:py-4 sm:text-base';

interface LibraryTabListProps {
  'aria-label': string;
  className?: string;
  children: ReactNode;
}

export function LibraryTabList({
  'aria-label': ariaLabel,
  className,
  children,
}: LibraryTabListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('border-y border-border bg-background font-heading', className)}
    >
      {children}
    </div>
  );
}

interface LibraryTabTriggerProps {
  isActive: boolean;
  onSelect: () => void;
  /** Unique per tab bar so the underline animates between tabs on the same page. */
  underlineLayoutId: string;
  className?: string;
  children: ReactNode;
}

export function LibraryTabTrigger({
  isActive,
  onSelect,
  underlineLayoutId,
  className,
  children,
}: LibraryTabTriggerProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onSelect}
      className={cn(
        'relative flex items-center justify-center',
        'font-bold tracking-tighter leading-none',
        'outline-hidden transition-colors',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        isActive
          ? 'text-primary bg-primary/5'
          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
        className
      )}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId={underlineLayoutId}
          transition={UNDERLINE_SPRING}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-primary"
        />
      )}
    </button>
  );
}
