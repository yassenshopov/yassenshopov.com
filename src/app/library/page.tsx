'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Layout from '@/components/Layout';
import LibraryHero from '@/components/library/LibraryHero';
import LibraryTabs from '@/components/library/LibraryTabs';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import LibraryModal from '@/components/library/LibraryModal';
import LibraryResults from '@/components/library/LibraryResults';
import LibraryItemSkeleton from '@/components/library/LibraryItemSkeleton';
import LibraryTableOfContents, {
  type LibraryTocSection,
  libraryTocSectionId,
} from '@/components/library/LibraryTableOfContents';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';
import type { LibraryItem } from '@/data/library';

const UNDATED_KEY = 'undated';

interface LibraryOccurrence {
  item: LibraryItem;
  yearKey: string;
  /**
   * Total entries across all years for this item. `> 1` means the card
   * represents a re-read / re-watch and the card should show a badge.
   */
  totalEntries: number;
  /** True when this occurrence corresponds to the most recent entry. */
  isLatestEntry: boolean;
}

/**
 * Expand each item into one occurrence per year it has a reading/watch entry.
 * Items without entries (wishlist/watchlist) fall into the `UNDATED_KEY`
 * bucket. Re-reads naturally appear in multiple year sections.
 */
function toOccurrences(items: LibraryItem[]): LibraryOccurrence[] {
  const out: LibraryOccurrence[] = [];

  for (const item of items) {
    const entries = item.entries ?? [];
    const totalEntries = entries.length;

    if (totalEntries === 0) {
      out.push({ item, yearKey: UNDATED_KEY, totalEntries: 0, isLatestEntry: true });
      continue;
    }

    // Pick the latest entry once so each occurrence can flag itself.
    const latestTimestamp = Math.max(
      ...entries.map((entry) => {
        const d = entry.dateCompleted || entry.dateStarted;
        return d ? new Date(d).getTime() : 0;
      }),
    );

    const seen = new Set<string>();
    for (const entry of entries) {
      const dateStr = entry.dateCompleted || entry.dateStarted;
      const yearKey = dateStr ? new Date(dateStr).getFullYear().toString() : UNDATED_KEY;
      // Multiple entries inside the same calendar year collapse to a single card.
      if (seen.has(yearKey)) continue;
      seen.add(yearKey);
      const entryTimestamp = dateStr ? new Date(dateStr).getTime() : 0;
      out.push({
        item,
        yearKey,
        totalEntries,
        isLatestEntry: entryTimestamp === latestTimestamp,
      });
    }
  }

  return out;
}

function groupOccurrencesByYear(
  occurrences: LibraryOccurrence[],
): Record<string, LibraryOccurrence[]> {
  return occurrences.reduce<Record<string, LibraryOccurrence[]>>((acc, occ) => {
    (acc[occ.yearKey] ||= []).push(occ);
    return acc;
  }, {});
}

function sortYearKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    if (a === UNDATED_KEY) return 1;
    if (b === UNDATED_KEY) return -1;
    return Number(b) - Number(a);
  });
}

export default function LibraryPage() {
  const {
    category,
    setCategory,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    itemsToShow,
    isLoadingMore,
    showMoreItems,
    sortedItems,
    allSortedItems,
    hasMoreItems,
    allItems,
    getCreatorLabel,
    getStatusColor,
    getStatistics,
    getRelatedItems,
    getSeriesInfo,
    getRelationshipLabel,
    navigateToItem,
    loadMoreRef,
    isTransitioning,
    revealItemsUpTo,
  } = useLibrary();

  const overallStats = getStatistics(allItems);

  const bookCount = allItems.filter((i) => i.type === 'book').length;
  const movieCount = allItems.filter((i) => i.type === 'movie').length;
  const seriesCount = allItems.filter((i) => i.type === 'series').length;
  const watchableCount = movieCount + seriesCount;

  // The hero strip should reflect the whole catalog (matching the tabs and the
  // marquee), not just completed items. `getStatistics` filters to completed,
  // so we override the type counts here while keeping its derived fields.
  const heroStats = {
    ...overallStats,
    books: bookCount,
    movies: movieCount,
    series: seriesCount,
  };

  const heroCovers = allItems
    .map((item) => item.coverImage)
    .filter((src): src is string => Boolean(src));

  // Flatten items to per-year occurrences so re-reads/re-watches appear in
  // every year they happened. Pagination still operates on items (via
  // `sortedItems`), so a book with three entries contributes one slot to the
  // infinite-scroll counter but three cards in the rendered grid.
  const visibleByYear = groupOccurrencesByYear(toOccurrences(sortedItems));
  const visibleYearKeys = sortYearKeys(Object.keys(visibleByYear));

  const undatedLabel = category === 'books' ? 'To Read' : 'Watchlist';
  const labelForYear = (key: string) => (key === UNDATED_KEY ? undatedLabel : key);

  // Build ToC sections from the full filtered list so users can jump to a
  // year even before infinite scroll has loaded it.
  const allByYear = groupOccurrencesByYear(toOccurrences(allSortedItems));
  const allYearKeys = sortYearKeys(Object.keys(allByYear));
  const tocSections: LibraryTocSection[] = (() => {
    let cumulative = 0;
    return allYearKeys.map((key) => {
      const count = allByYear[key].length;
      cumulative += count;
      return {
        key,
        label: labelForYear(key),
        count,
        cumulativeCount: cumulative,
      };
    });
  })();

  // Infinite scroll
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && itemsToShow < allSortedItems.length) {
          showMoreItems();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [allSortedItems.length, itemsToShow, isLoadingMore, showMoreItems, loadMoreRef]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedItem) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          navigateToItem('prev');
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          navigateToItem('next');
        } else if (event.key === 'Escape') {
          setSelectedItem(null);
        }
        return;
      }

      if (event.target instanceof HTMLInputElement) return;

      if (event.key === '/') {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]',
        ) as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, navigateToItem, setSelectedItem]);

  return (
    <Layout>
      <LibraryHero stats={heroStats} covers={heroCovers} />

      {tocSections.length > 1 && (
        <LibraryTableOfContents
          sections={tocSections}
          onJumpTo={revealItemsUpTo}
        />
      )}

      <LibraryTabs
        category={category}
        onChange={setCategory}
        bookCount={bookCount}
        watchableCount={watchableCount}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <LibraryResults
            sortedItemsLength={allSortedItems.length}
            searchQuery={searchQuery}
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${category === 'books' ? 'books' : 'movies & series'}…`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      <section className="pt-2 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {visibleYearKeys.map((yearKey) => {
              const occurrencesInYear = visibleByYear[yearKey];
              const isUndated = yearKey === UNDATED_KEY;
              const heading = labelForYear(yearKey);
              const ariaLabel = isUndated
                ? `${heading} items`
                : `Items from ${yearKey}`;

              return (
                <div key={yearKey} id={libraryTocSectionId(yearKey)} className="scroll-mt-24">
                  <div className="flex items-end gap-6 mb-8" aria-label={ariaLabel}>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
                      {heading}
                    </h2>
                    <div className="flex-1 pb-2 flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {occurrencesInYear.length}{' '}
                        {occurrencesInYear.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                    {occurrencesInYear.map((occ) => (
                      <LibraryItemCard
                        key={`${occ.item.id}-${occ.yearKey}`}
                        item={occ.item}
                        onItemClick={setSelectedItem}
                        getCreatorLabel={getCreatorLabel}
                        entryYear={isUndated ? undefined : Number(occ.yearKey)}
                        totalEntries={occ.totalEntries}
                        isLatestEntry={occ.isLatestEntry}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LibraryItemSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            )}
          </motion.div>

          {hasMoreItems && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading more items…
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Scroll down to load more</div>
              )}
            </div>
          )}

          {sortedItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No {category === 'books' ? 'books' : 'movies or series'} found
                {searchQuery ? ` matching "${searchQuery}"` : ''}.
              </p>
              {searchQuery && (
                <p className="text-muted-foreground text-sm mt-2">
                  Try a different search term.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <LibraryModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNavigate={navigateToItem}
        isTransitioning={isTransitioning}
        sortedItems={sortedItems}
        getCreatorLabel={getCreatorLabel}
        getStatusColor={getStatusColor}
        getRelatedItems={getRelatedItems}
        getSeriesInfo={getSeriesInfo}
        getRelationshipLabel={getRelationshipLabel}
        onSelectItem={setSelectedItem}
      />
    </Layout>
  );
}
