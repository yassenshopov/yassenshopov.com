'use client';

import { useState, useEffect, useRef } from 'react';
import { libraryItems, LibraryItem } from '@/data/library';
import {
  getCreatorLabel as getCreatorLabelUtil,
  getStatusColor as getStatusColorUtil,
  getRelatedItems as getRelatedItemsUtil,
  getSeriesInfo as getSeriesInfoUtil,
  getRelationshipLabel as getRelationshipLabelUtil,
  calculateStatistics,
} from '@/lib/library-utils';
import { toast } from 'sonner';

export type LibraryCategory = 'books' | 'watchables';

const ITEMS_PER_PAGE = 12;

export function useLibrary() {
  const [category, setCategory] = useState<LibraryCategory>('books');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title' | 'date'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatingHearts, setAnimatingHearts] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastToastRef = useRef<{ id: string; action: 'like' | 'unlike'; time: number } | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('library-favorites');
    const savedViewMode = localStorage.getItem('library-view-mode');
    const savedSortBy = localStorage.getItem('library-sort-by');
    const savedCategory = localStorage.getItem('library-category');

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedViewMode) setViewMode(savedViewMode as 'grid' | 'list');
    if (savedSortBy) setSortBy(savedSortBy as any);
    if (savedCategory === 'books' || savedCategory === 'watchables') setCategory(savedCategory);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('library-favorites', JSON.stringify(favorites));
    } catch {
      // Silently ignore QuotaExceededError
    }
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('library-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('library-sort-by', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('library-category', category);
    setItemsToShow(ITEMS_PER_PAGE);
  }, [category]);

  // Filter to the active category (books vs movies+series)
  const itemsInCategory = libraryItems.filter((item) =>
    category === 'books' ? item.type === 'book' : item.type === 'movie' || item.type === 'series',
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

  // Sorting logic
  const allSortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date': {
        const dateA = new Date(a.dateCompleted || a.dateStarted || '1900-01-01');
        const dateB = new Date(b.dateCompleted || b.dateStarted || '1900-01-01');
        return dateB.getTime() - dateA.getTime();
      }
      case 'recent':
      default: {
        const aId = parseInt(a.id, 10);
        const bId = parseInt(b.id, 10);
        if (isNaN(aId) && isNaN(bId)) return a.id.localeCompare(b.id);
        if (isNaN(aId)) return 1;
        if (isNaN(bId)) return -1;
        return bId - aId;
      }
    }
  });
  const sortedItems = allSortedItems.slice(0, itemsToShow);
  const hasMoreItems = allSortedItems.length > itemsToShow;

  const getCreatorLabel = getCreatorLabelUtil;
  const getStatusColor = getStatusColorUtil;

  const toggleFavorite = (itemId: string, itemTitle?: string) => {
    setFavorites((prev) => {
      const isLiking = !prev.includes(itemId);
      const now = Date.now();
      const last = lastToastRef.current;
      const action: 'like' | 'unlike' = isLiking ? 'like' : 'unlike';
      if (!last || last.id !== itemId || last.action !== action || now - last.time > 1000) {
        if (isLiking) {
          toast.success(`Added to favorites: "${itemTitle || 'Item'}" (saved on this device only)`);
        } else {
          toast(`Removed from favorites: "${itemTitle || 'Item'}" (saved on this device only)`);
        }
        lastToastRef.current = { id: itemId, action, time: now };
      }
      if (isLiking) {
        setAnimatingHearts((ah) => [...ah, itemId]);
        setTimeout(() => {
          setAnimatingHearts((ah) => ah.filter((id) => id !== itemId));
        }, 600);
      }
      return isLiking ? [...prev, itemId] : prev.filter((id) => id !== itemId);
    });
  };

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

  return {
    // State
    category,
    setCategory,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    favorites,
    itemsToShow,
    isLoadingMore,
    isTransitioning,
    animatingHearts,
    copiedId,
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
    toggleFavorite,
    getStatistics,
    getRelatedItems,
    getSeriesInfo,
    getRelationshipLabel,
    navigateToItem,
    showMoreItems,
  };
}
