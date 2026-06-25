import { LibraryItem, LibraryEntry, getLatestEntry } from '@/data/library';

/**
 * Years (descending) in which this item has a recorded reading/watch.
 * Returns an empty array for wishlist items so callers can fall back to an
 * "undated" bucket.
 */
export const getEntryYears = (item: LibraryItem): number[] => {
  if (!item.entries || item.entries.length === 0) return [];
  const years = new Set<number>();
  for (const entry of item.entries) {
    const date = entry.dateCompleted || entry.dateStarted;
    if (!date) continue;
    years.add(new Date(date).getFullYear());
  }
  return [...years].sort((a, b) => b - a);
};

/**
 * Pulls the entry that corresponds to a given year, useful when an item is
 * rendered once per year it was engaged with.
 */
export const getEntryForYear = (item: LibraryItem, year: number): LibraryEntry | undefined => {
  if (!item.entries) return undefined;
  return item.entries.find((entry) => {
    const date = entry.dateCompleted || entry.dateStarted;
    if (!date) return false;
    return new Date(date).getFullYear() === year;
  });
};

/** Re-exported so consumers don't need to reach into `@/data/library`. */
export { getLatestEntry };

export const getCreatorLabel = (item: LibraryItem): string => {
  switch (item.type) {
    case 'book':
      return item.author || '';
    case 'movie':
      return item.director || '';
    case 'series':
      return item.creator || '';
    default:
      return '';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20';
    case 'on-pause':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20';
    case 'dnf':
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20';
    case 'want-to-read':
    case 'want-to-watch':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20';
  }
};

export const getSeriesInfo = (item: LibraryItem, allItems: LibraryItem[]) => {
  if (!item.series) return null;

  const seriesItems = allItems
    .filter((i) => i.series === item.series)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  return {
    name: item.series,
    items: seriesItems,
    currentIndex: seriesItems.findIndex((i) => i.id === item.id),
    totalItems: seriesItems.length,
  };
};

export const getRelationshipLabel = (fromItem: LibraryItem, toItem: LibraryItem): string => {
  if (!fromItem.relationships) return 'Related';

  const { relationships } = fromItem;

  if (relationships.adaptations?.includes(toItem.id)) {
    return toItem.type === 'movie' ? 'Movie Adaptation' : 'TV Adaptation';
  }
  if (relationships.basedOn?.includes(toItem.id)) {
    return 'Based on';
  }
  if (relationships.sequel === toItem.id) {
    return 'Sequel';
  }
  if (relationships.prequel === toItem.id) {
    return 'Prequel';
  }
  if (relationships.sameUniverse?.includes(toItem.id)) {
    return 'Same Universe';
  }
  if (fromItem.series && toItem.series === fromItem.series) {
    if ((toItem.seriesOrder || 0) > (fromItem.seriesOrder || 0)) {
      return 'Next in Series';
    } else if ((toItem.seriesOrder || 0) < (fromItem.seriesOrder || 0)) {
      return 'Previous in Series';
    }
    return 'Same Series';
  }

  return 'Related';
};

export const getRelatedItems = (
  item: LibraryItem,
  allItems: LibraryItem[],
  limit: number = 4
): LibraryItem[] => {
  if (!item) return [];

  const otherItems = allItems.filter((other) => other.id !== item.id);
  const relatedItems: LibraryItem[] = [];

  // First, get explicitly related items from relationships
  if (item.relationships) {
    const explicitRelated = [
      ...(item.relationships.adaptations || []),
      ...(item.relationships.basedOn || []),
      ...(item.relationships.related || []),
      ...(item.relationships.sameUniverse || []),
      ...(item.relationships.sequel ? [item.relationships.sequel] : []),
      ...(item.relationships.prequel ? [item.relationships.prequel] : []),
    ];

    explicitRelated.forEach((id) => {
      const relatedItem = allItems.find((i) => i.id === id);
      if (relatedItem && !relatedItems.find((r) => r.id === relatedItem.id)) {
        relatedItems.push(relatedItem);
      }
    });
  }

  // Add items from the same series
  if (item.series) {
    const seriesItems = allItems.filter(
      (other) => other.series === item.series && other.id !== item.id
    );
    seriesItems.forEach((seriesItem) => {
      if (!relatedItems.find((r) => r.id === seriesItem.id)) {
        relatedItems.push(seriesItem);
      }
    });
  }

  // If we have enough related items, return them sorted by series order
  if (relatedItems.length >= limit) {
    return relatedItems.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0)).slice(0, limit);
  }

  // Otherwise, fall back to similarity scoring for remaining slots
  const remainingSlots = limit - relatedItems.length;
  const excludeIds = new Set(relatedItems.map((r) => r.id));
  const candidateItems = otherItems.filter((other) => !excludeIds.has(other.id));

  const scoredItems = candidateItems.map((other) => {
    let score = 0;

    // Same type bonus
    if (other.type === item.type) score += 3;

    // Genre overlap (highest weight)
    const genreOverlap = item.genre.filter((g) => other.genre.includes(g)).length;
    score += genreOverlap * 4;

    // Similar rating (within 1 star)
    if (other.rating != null && item.rating != null && Math.abs(other.rating - item.rating) <= 1) {
      score += 2;
    }

    // Same creator/author
    const itemCreator = getCreatorLabel(item);
    const otherCreator = getCreatorLabel(other);
    if (itemCreator && otherCreator && itemCreator === otherCreator) score += 5;

    // Same status
    if (other.status === item.status) score += 1;

    // Recent completion bonus (within 6 months)
    if (item.dateCompleted && other.dateCompleted) {
      const itemDate = new Date(item.dateCompleted);
      const otherDate = new Date(other.dateCompleted);
      const monthsDiff =
        Math.abs(itemDate.getTime() - otherDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsDiff <= 6) score += 1;
    }

    return { item: other, score };
  });

  const additionalItems = scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, remainingSlots)
    .map((scored) => scored.item);

  return [...relatedItems, ...additionalItems];
};

export const calculateStatistics = (items: LibraryItem[]) => {
  const completed = items.filter((item) => item.status === 'completed');
  const books = completed.filter((item) => item.type === 'book');
  const movies = completed.filter((item) => item.type === 'movie');
  const series = completed.filter((item) => item.type === 'series');

  const ratedItems = completed.filter((item) => item.rating != null);
  const avgRating = ratedItems.length
    ? ratedItems.reduce((sum, item) => sum + (item.rating ?? 0), 0) / ratedItems.length
    : 0;
  const genreCount = completed.reduce(
    (acc, item) => {
      item.genre.forEach((genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    },
    {} as { [key: string]: number }
  );

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const thisYear = new Date().getFullYear();
  const thisYearItems = completed.filter((item) => {
    const completedYear = item.dateCompleted ? new Date(item.dateCompleted).getFullYear() : null;
    const startedYear = item.dateStarted ? new Date(item.dateStarted).getFullYear() : null;
    return completedYear === thisYear || startedYear === thisYear;
  });

  return {
    totalCompleted: completed.length,
    books: books.length,
    movies: movies.length,
    series: series.length,
    avgRating,
    topGenres,
    thisYear: thisYearItems.length,
    fiveStarCount: completed.filter((item) => item.rating === 5).length,
  };
};
