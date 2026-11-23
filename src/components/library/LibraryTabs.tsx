'use client';

import type { LibraryCategory } from '@/hooks/useLibrary';
import {
  LibraryTabList,
  LibraryTabTrigger,
  libraryTabSizeClass,
} from '@/components/library/LibraryTabBar';

interface LibraryTabsProps {
  category: LibraryCategory;
  onChange: (next: LibraryCategory) => void;
}

const TABS: Array<{ value: LibraryCategory; label: string }> = [
  { value: 'books', label: 'Books' },
  { value: 'watchables', label: 'Movies & Series' },
];

const UNDERLINE_LAYOUT_ID = 'library-category-tab';

export default function LibraryTabs({ category, onChange }: LibraryTabsProps) {
  return (
    <LibraryTabList aria-label="Library category" className="grid w-full grid-cols-2">
      {TABS.map((tab) => (
        <LibraryTabTrigger
          key={tab.value}
          isActive={category === tab.value}
          onSelect={() => onChange(tab.value)}
          underlineLayoutId={UNDERLINE_LAYOUT_ID}
          className={libraryTabSizeClass}
        >
          {tab.label}
        </LibraryTabTrigger>
      ))}
    </LibraryTabList>
  );
}
