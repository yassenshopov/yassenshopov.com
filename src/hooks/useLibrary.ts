'use client';

import { useState, useEffect, useRef } from 'react';
import { libraryItems, LibraryItem, loadAllLibraryItems } from '@/data/library';
import { 
  getCreatorLabel as getCreatorLabelUtil, 
  getStatusColor as getStatusColorUtil,
  getRelatedItems as getRelatedItemsUtil,
  getSeriesInfo as getSeriesInfoUtil,
  getRelationshipLabel as getRelationshipLabelUtil,
  calculateStatistics,
  exportToCSV as exportToCSVUtil,
  exportToJSON as exportToJSONUtil
} from '@/lib/library-utils';
import { toast } from 'sonner';

export function useLibrary() {
  // State
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title' | 'date'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatingHearts, setAnimatingHearts] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showThisYearOnly, setShowThisYearOnly] = useState(false);
  const [allLibraryItems, setAllLibraryItems] = useState<LibraryItem[]>(libraryItems);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastToastRef = useRef<{id: string, action: 'like' | 'unlike', time: number} | null>(null);

  // Load external library items
  useEffect(() => {
    const loadExternalItems = async () => {
      setIsLoadingExternal(true);
      try {
        // Add a small delay to show loading state for better UX
        const loadPromise = loadAllLibraryItems();
        
        // Show loading for at least 500ms to prevent flash
        const [items] = await Promise.all([
          loadPromise,
          new Promise(resolve => setTimeout(resolve, 500))
        ]);
        
        setAllLibraryItems(items);
      } catch (error) {
        console.warn('Failed to load external library items, using internal only:', error);
        setAllLibraryItems(libraryItems);
      } finally {
        setIsLoadingExternal(false);
      }
    };

    loadExternalItems();
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('library-favorites');
    const savedViewMode = localStorage.getItem('library-view-mode');
    const savedSortBy = localStorage.getItem('library-sort-by');
    const savedShowStats = localStorage.getItem('library-show-stats');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedViewMode) setViewMode(savedViewMode as 'grid' | 'list');
    if (savedSortBy) setSortBy(savedSortBy as any);
    if (savedShowStats) setShowStats(JSON.parse(savedShowStats));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('library-favorites', JSON.stringify(favorites));
    } catch (e) {
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
    localStorage.setItem('library-show-stats', JSON.stringify(showStats));
  }, [showStats]);

  // Get all unique genres for filtering
  const allGenres = [...new Set(allLibraryItems.flatMap(item => item.genre))].sort();

  // Filtering logic
  const filteredItems = allLibraryItems.filter(item => {
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    
    // Search functionality
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.director && item.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.creator && item.creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.series && item.series.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Genre filtering
    const genreMatch = selectedGenres.length === 0 || 
      selectedGenres.some(selectedGenre => item.genre.includes(selectedGenre));
    
    // Rating filtering (FIX: include items with null/undefined rating)
    const ratingMatch = item.rating == null || (item.rating >= ratingRange[0] && item.rating <= ratingRange[1]);

    // This year filtering
    let thisYearMatch = true;
    if (showThisYearOnly) {
      const year = new Date().getFullYear();
      const completedYear = item.dateCompleted ? new Date(item.dateCompleted).getFullYear() : null;
      const startedYear = item.dateStarted ? new Date(item.dateStarted).getFullYear() : null;
      thisYearMatch = completedYear === year || startedYear === year;
    }
    
    return typeMatch && statusMatch && searchMatch && genreMatch && ratingMatch && thisYearMatch;
  });

  // Sorting logic
  const allSortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        const dateA = new Date(a.dateCompleted || a.dateStarted || '1900-01-01');
        const dateB = new Date(b.dateCompleted || b.dateStarted || '1900-01-01');
        return dateB.getTime() - dateA.getTime();
      case 'recent':
      default:
        return parseInt(b.id) - parseInt(a.id);
    }
  });
  const sortedItems = allSortedItems.slice(0, itemsToShow);
  const hasMoreItems = allSortedItems.length > itemsToShow;

  // Utility functions - use imported utilities
  const getCreatorLabel = getCreatorLabelUtil;
  const getStatusColor = getStatusColorUtil;

  // Favorites functionality
  const toggleFavorite = (itemId: string, itemTitle?: string) => {
    setFavorites(prev => {
      const isLiking = !prev.includes(itemId);
      const now = Date.now();
      const last = lastToastRef.current;
      const action = isLiking ? 'like' : 'unlike';
      if (!last || last.id !== itemId || last.action !== action || now - last.time > 1000) {
        if (isLiking) {
          toast.success(`Added to favorites: "${itemTitle || 'Item'}" (saved on this device only)`);
        } else {
          toast(`Removed from favorites: "${itemTitle || 'Item'}" (saved on this device only)`);
        }
        lastToastRef.current = {id: itemId, action, time: now};
      }
      if (isLiking) {
        setAnimatingHearts(ah => [...ah, itemId]);
        setTimeout(() => {
          setAnimatingHearts(ah => ah.filter(id => id !== itemId));
        }, 600);
      }
      return isLiking
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId);
    });
  };

  // Statistics calculations
  const getStatistics = () => calculateStatistics(allLibraryItems);

  // Related items algorithm
  const getRelatedItems = (item: LibraryItem, limit: number = 4): LibraryItem[] => 
    getRelatedItemsUtil(item, allLibraryItems, limit);

  // Get series information for an item
  const getSeriesInfo = (item: LibraryItem) => getSeriesInfoUtil(item, allLibraryItems);

  // Get relationship type display text
  const getRelationshipLabel = (fromItem: LibraryItem, toItem: LibraryItem): string => 
    getRelationshipLabelUtil(fromItem, toItem);

  // Navigation functions
  const navigateToItem = (direction: 'prev' | 'next') => {
    if (!selectedItem || isTransitioning) return;
    
    const currentIndex = sortedItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : sortedItems.length - 1;
    } else {
      newIndex = currentIndex < sortedItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setIsTransitioning(true);
    
    requestAnimationFrame(() => {
      setSelectedItem(sortedItems[newIndex]);
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
  };

  // Export functionality
  const exportToCSV = () => exportToCSVUtil(sortedItems);
  const exportToJSON = () => exportToJSONUtil(sortedItems, {
    search: searchQuery,
    type: selectedType,
    status: selectedStatus,
    genres: selectedGenres,
    ratingRange
  }, getStatistics());

  // Copy functionality
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setRatingRange([1, 5]);
    setSelectedType('all');
    setSelectedStatus('all');
    setShowThisYearOnly(false);
  };

  // Load more items
  const showMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setItemsToShow(prev => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  return {
    // State
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    favorites,
    showStats,
    setShowStats,
    selectedGenres,
    setSelectedGenres,
    ratingRange,
    setRatingRange,
    itemsToShow,
    isLoadingMore,
    isTransitioning,
    animatingHearts,
    copiedId,
    showThisYearOnly,
    setShowThisYearOnly,
    isLoadingExternal,
    loadMoreRef,

    // Data
    allGenres,
    filteredItems,
    sortedItems,
    allSortedItems,
    hasMoreItems,

    // Functions
    getCreatorLabel,
    getStatusColor,
    toggleFavorite,
    getStatistics,
    getRelatedItems,
    getSeriesInfo,
    getRelationshipLabel,
    navigateToItem,
    exportToCSV,
    exportToJSON,
    handleCopy,
    clearFilters,
    showMoreItems,
  };
} 