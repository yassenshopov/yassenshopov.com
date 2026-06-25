'use client';

import { useState, useEffect, useRef } from 'react';
import { libraryItems, LibraryItem, getLatestEntry } from '@/data/library';
import {
  getCreatorLabel as getCreatorLabelUtil,
  getStatusColor as getStatusColorUtil,
  getRelatedItems as getRelatedItemsUtil,
  getSeriesInfo as getSeriesInfoUtil,
  getRelationshipLabel as getRelationshipLabelUtil,
  calculateStatistics,
} from '@/lib/library-utils';

/**
 * Most recent engagement timestamp for an item — the completion date of the
 * latest entry, falling back to its start date. Returns 0 for items with no
 * entries (wishlist/watchlist) so they sort to the bottom.
 */
function latestEntryTimestamp(item: LibraryItem): number {
  const latest = item.entries ? getLatestEntry(item.entries) : undefined;
  const dateStr = latest?.dateCompleted || latest?.dateStarted;
  return dateStr ? new Date(dateStr).getTime() : 0;
}

export type LibraryCategory = 'books' | 'watchables';

const ITEMS_PER_PAGE = 12;

export function useLibrary() {
  const [category, setCategory] = useState<LibraryCategory>('books');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem('library-category');
    if (savedCategory === 'books' || savedCategory === 'watchables') setCategory(savedCategory);
  }, []);

  useEffect(() => {
    localStorage.setItem('library-category', category);
    setItemsToShow(ITEMS_PER_PAGE);
  }, [category]);

  // Filter to the active category (books vs movies+series)
  const itemsInCategory = libraryItems.filter((item) =>
    category === 'books' ? item.type === 'book' : item.type === 'movie' || item.type === 'series'
  );

  // Filtering logic - search only
  const filteredItems = itemsInCategory.filter((item) => {
    if (searchQuery === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.director && item.director.toLowerCase().includes(q)) ||
      (item.creator && item.creator.toLowerCase().includes(q)) ||
      (item.series && item.series.toLowerCase().includes(q)) ||
      item.genre.some((g) => g.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  });

  // Sort by the latest entry across all engagements, newest first. A re-read
  // in 2026 of a book first read in 2022 sorts ahead of a 2025 first-read.
  const allSortedItems = [...filteredItems].sort(
    (a, b) => latestEntryTimestamp(b) - latestEntryTimestamp(a)
  );
  const sortedItems = allSortedItems.slice(0, itemsToShow);
  const hasMoreItems = allSortedItems.length > itemsToShow;

  const getCreatorLabel = getCreatorLabelUtil;
  const getStatusColor = getStatusColorUtil;

  const getStatistics = (items?: LibraryItem[]) => calculateStatistics(items || libraryItems);

  const getRelatedItems = (item: LibraryItem, limit: number = 4): LibraryItem[] =>
    getRelatedItemsUtil(item, libraryItems, limit);

  const getSeriesInfo = (item: LibraryItem) => getSeriesInfoUtil(item, libraryItems);

  const getRelationshipLabel = (fromItem: LibraryItem, toItem: LibraryItem): string =>
    getRelationshipLabelUtil(fromItem, toItem);

  const navigateToItem = (direction: 'prev' | 'next') => {
    if (!selectedItem || isTransitioning) return;

    const currentIndex = sortedItems.findIndex((item) => item.id === selectedItem.id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : sortedItems.length - 1;
    } else {
      newIndex = currentIndex < sortedItems.length - 1 ? currentIndex + 1 : 0;
    }

    setIsTransitioning(true);
    requestAnimationFrame(() => {
      setSelectedItem(sortedItems[newIndex]);
      requestAnimationFrame(() => setIsTransitioning(false));
    });
  };

  const showMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setItemsToShow((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  };

  // Ensure at least `count` items are rendered. Rounded up to the next page
  // boundary so the section we're jumping to is fully visible (and so the
  // infinite-scroll cadence stays consistent afterwards).
  const revealItemsUpTo = (count: number) => {
    setItemsToShow((prev) => {
      if (count <= prev) return prev;
      const next = Math.ceil(count / ITEMS_PER_PAGE) * ITEMS_PER_PAGE;
      return Math.min(next, allSortedItems.length);
    });
  };

  return {
    // State
    category,
    setCategory,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    itemsToShow,
    isLoadingMore,
    isTransitioning,
    loadMoreRef,

    // Data
    filteredItems,
    sortedItems,
    allSortedItems,
    hasMoreItems,
    allItems: libraryItems,

    // Functions
    getCreatorLabel,
    getStatusColor,
    getStatistics,
    getRelatedItems,
    getSeriesInfo,
    getRelationshipLabel,
    navigateToItem,
    showMoreItems,
    revealItemsUpTo,
  };
}
