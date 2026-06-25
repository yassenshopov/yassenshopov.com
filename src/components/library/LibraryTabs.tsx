'use client';

import { BookOpen, Clapperboard } from 'lucide-react';
import type { LibraryCategory } from '@/hooks/useLibrary';

interface LibraryTabsProps {
  category: LibraryCategory;
  onChange: (next: LibraryCategory) => void;
  bookCount: number;
  watchableCount: number;
}

const TABS: Array<{
  value: LibraryCategory;
  label: string;
  icon: typeof BookOpen;
  countKey: 'bookCount' | 'watchableCount';
}> = [
  { value: 'books', label: 'Books', icon: BookOpen, countKey: 'bookCount' },
  { value: 'watchables', label: 'Movies & Series', icon: Clapperboard, countKey: 'watchableCount' },
];

export default function LibraryTabs({
  category,
  onChange,
  bookCount,
  watchableCount,
}: LibraryTabsProps) {
  const counts = { bookCount, watchableCount };

  return (
    <div
      role="tablist"
      aria-label="Library category"
      className="w-full grid grid-cols-2 border-y bg-background"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = category === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={[
              'relative flex items-center justify-center gap-3 px-4 py-5 sm:py-6',
              'text-xs sm:text-sm font-bold uppercase tracking-[0.18em] transition-colors',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
            ].join(' ')}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{tab.label}</span>
            <span
              className={[
                'ml-1 text-[10px] sm:text-xs font-semibold tracking-normal',
                isActive ? 'text-primary' : 'text-muted-foreground/70',
              ].join(' ')}
            >
              {counts[tab.countKey]}
            </span>
            {isActive && (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}
