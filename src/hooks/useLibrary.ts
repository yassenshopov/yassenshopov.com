'use client';

import { useState, useEffect, useRef } from 'react';
import { libraryItems, LibraryItem } from '@/data/library';
import { 
  getCreatorLabel as getCreatorLabelUtil, 
  getStatusColor as getStatusColorUtil,
  getReadingTime as getReadingTimeUtil,
  getRelatedItems as getRelatedItemsUtil,
  getSeriesInfo as getSeriesInfoUtil,
  getRelationshipLabel as getRelationshipLabelUtil,
  calculateStatistics,
  exportToCSV as exportToCSVUtil,
  exportToJSON as exportToJSONUtil
} from '@/lib/library-utils';

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
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
    localStorage.setItem('library-favorites', JSON.stringify(favorites));
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
  const allGenres = [...new Set(libraryItems.flatMap(item => item.genre))].sort();

  // Filtering logic
  const filteredItems = libraryItems.filter(item => {
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    
    // Search functionality
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.director && item.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.creator && item.creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Genre filtering
    const genreMatch = selectedGenres.length === 0 || 
      selectedGenres.some(selectedGenre => item.genre.includes(selectedGenre));
    
    // Rating filtering
    const ratingMatch = item.rating >= ratingRange[0] && item.rating <= ratingRange[1];
    
    return typeMatch && statusMatch && searchMatch && genreMatch && ratingMatch;
  });

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
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

  // Utility functions - use imported utilities
  const getCreatorLabel = getCreatorLabelUtil;
  const getStatusColor = getStatusColorUtil;
  const getReadingTime = getReadingTimeUtil;

  // Favorites functionality
  const toggleFavorite = (itemId: string) => {
    setAnimatingHearts(prev => [...prev, itemId]);
    setTimeout(() => {
      setAnimatingHearts(prev => prev.filter(id => id !== itemId));
    }, 600);
    
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Statistics calculations
  const getStatistics = () => calculateStatistics(libraryItems);

  // Related items algorithm
  const getRelatedItems = (item: LibraryItem, limit: number = 4): LibraryItem[] => 
    getRelatedItemsUtil(item, libraryItems, limit);

  // Get series information for an item
  const getSeriesInfo = (item: LibraryItem) => getSeriesInfoUtil(item, libraryItems);

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
  };

  // Reset items to show when filters change
  useEffect(() => {
    setItemsToShow(12);
  }, [searchQuery, selectedType, selectedStatus, selectedGenres, ratingRange, sortBy]);

  // Get visible items for performance
  const visibleItems = sortedItems.slice(0, itemsToShow);

  const showMoreItems = () => {
    setItemsToShow(prev => Math.min(prev + 12, sortedItems.length));
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
    loadMoreRef,
    
    // Data
    allGenres,
    filteredItems,
    sortedItems,
    visibleItems,
    
    // Functions
    getCreatorLabel,
    getStatusColor,
    getReadingTime,
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