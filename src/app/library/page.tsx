'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, RefreshCw, Search, X } from 'lucide-react';
import Layout from '@/components/Layout';
import LibraryHero from '@/components/library/LibraryHero';
import LibraryStats from '@/components/library/LibraryStats';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import LibraryModal from '@/components/library/LibraryModal';
import LibraryResults from '@/components/library/LibraryResults';
import LibraryItemSkeleton from '@/components/library/LibraryItemSkeleton';
import FilterBadges from '@/components/library/FilterBadges';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';

export default function LibraryPage() {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
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
    showMoreItems,
    showThisYearOnly,
    setShowThisYearOnly,
    isLoadingExternal,
    
    // Data
    allGenres,
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
    loadMoreRef,
    animatingHearts,
    copiedId,
    isTransitioning,
  } = useLibrary();

  const stats = getStatistics(sortedItems);

  // Handle category click from LibraryHero
  const handleCategoryClick = (type: string) => {
    if (type === 'thisYear') {
      setShowThisYearOnly(true);
    } else {
      setShowThisYearOnly(false);
      setSelectedType(type);
    }
  };

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && itemsToShow < allSortedItems.length) {
          setIsLoadingMore(true);
          showMoreItems();
          setIsLoadingMore(false);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [allSortedItems.length, itemsToShow, isLoadingMore, showMoreItems, loadMoreRef]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Modal navigation
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

      // Global shortcuts (when no modal is open)
      if (event.target instanceof HTMLInputElement) return; // Don't interfere with input fields
      
      switch (event.key) {
        case '/':
          event.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'g':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setViewMode('grid');
          }
          break;
        case 'l':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setViewMode('list');
          }
          break;
        case 's':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setShowStats(!showStats);
          }
          break;
        case 'f':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setRatingRange([5, 5]);
            setSelectedStatus('completed');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, sortedItems, showStats, setViewMode, setShowStats, setRatingRange, setSelectedStatus, navigateToItem, setSelectedItem]);

  useEffect(() => {
    function checkAndLoadMore() {
      if (
        hasMoreItems &&
        loadMoreRef.current &&
        loadMoreRef.current.getBoundingClientRect().top < window.innerHeight
      ) {
        showMoreItems();
      }
    }
    checkAndLoadMore();
    window.addEventListener('resize', checkAndLoadMore);
    return () => window.removeEventListener('resize', checkAndLoadMore);
  }, [hasMoreItems, showMoreItems, loadMoreRef]);

  return (
    <Layout>
      {/* Hero Section */}
      <LibraryHero 
        stats={stats} 
        onCategoryClick={handleCategoryClick} 
        isLoading={isLoadingExternal}
      />

      {/* Statistics Dashboard */}
      <LibraryStats 
        showStats={showStats} 
        libraryItems={sortedItems} 
        stats={stats} 
        isLoading={isLoadingExternal}
      />

      {/* Floating Controls Menu */}
      <LibraryFilters
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        showStats={showStats}
        setShowStats={setShowStats}
        allGenres={allGenres}
        sortedItemsLength={sortedItems.length}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
        onClearFilters={clearFilters}
      />

      {/* Results Summary, Filter Badges, Search, and View Toggle */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <LibraryResults 
              sortedItemsLength={allSortedItems.length} 
              searchQuery={searchQuery} 
              isLoading={isLoadingExternal}
            />
            
            {/* Filter Badges */}
            <div className="mt-3">
              <FilterBadges
                searchQuery={searchQuery}
                selectedType={selectedType}
                selectedStatus={selectedStatus}
                selectedGenres={selectedGenres}
                ratingRange={ratingRange}
                showThisYearOnly={showThisYearOnly}
                onRemoveThisYear={() => setShowThisYearOnly(false)}
                onRemoveSearch={() => setSearchQuery('')}
                onRemoveType={() => setSelectedType('all')}
                onRemoveStatus={() => setSelectedStatus('all')}
                onRemoveGenre={(genre) => setSelectedGenres(prev => prev.filter(g => g !== genre))}
                onRemoveRating={() => setRatingRange([1, 5])}
              />
            </div>
          </div>
          
          {/* Search, Sort, and View Toggle */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search library..."
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
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">View:</span>
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Library Items */}
      <section className="pt-2 pb-16">
        <div className="container mx-auto px-2 sm:px-4">
          {isLoadingExternal && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading library items...
              </div>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" : "space-y-4"}
          >
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <LibraryItemCard
                  item={item}
                  viewMode={viewMode}
                  favorites={favorites}
                  animatingHearts={animatingHearts}
                  copiedId={copiedId}
                  onItemClick={setSelectedItem}
                  onToggleFavorite={(id, title) => toggleFavorite(id, title)}
                  getCreatorLabel={getCreatorLabel}
                  getStatusColor={getStatusColor}
                />
              </motion.div>
            ))}
            {isLoadingMore && Array.from({ length: 3 }).map((_, i) => (
              <LibraryItemSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
            ))}
          </motion.div>
          
          {/* Infinite Scroll Loading */}
          {hasMoreItems && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading more items...
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Scroll down to load more
                </div>
              )}
            </div>
          )}
          
          {sortedItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No items found matching your filters.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal for detailed view */}
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