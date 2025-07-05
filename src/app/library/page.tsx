'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import LibraryHero from '@/components/library/LibraryHero';
import LibraryStats from '@/components/library/LibraryStats';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import LibraryModal from '@/components/library/LibraryModal';
import LibraryResults from '@/components/library/LibraryResults';
import { useLibrary } from '@/hooks/useLibrary';

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
    
    // Data
    allGenres,
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
    loadMoreRef,
    animatingHearts,
    copiedId,
    isTransitioning,
  } = useLibrary();

  const stats = getStatistics();

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && itemsToShow < sortedItems.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            showMoreItems();
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [sortedItems.length, itemsToShow, isLoadingMore, showMoreItems, loadMoreRef]);

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

  return (
    <Layout>
      {/* Hero Section */}
      <LibraryHero stats={stats} />

      {/* Statistics Dashboard */}
      <LibraryStats 
        showStats={showStats} 
        libraryItems={[]} // This should be passed from the hook
        stats={stats} 
      />

      {/* Floating Controls Menu */}
      <LibraryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showStats={showStats}
        setShowStats={setShowStats}
        allGenres={allGenres}
        sortedItemsLength={sortedItems.length}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
        onClearFilters={clearFilters}
      />

      {/* Simple Results Summary */}
      <LibraryResults 
        sortedItemsLength={sortedItems.length} 
        searchQuery={searchQuery} 
      />

      {/* Library Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}
          >
            {visibleItems.map((item, index) => (
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
                  onToggleFavorite={toggleFavorite}
                  onCopyTitle={handleCopy}
                  getCreatorLabel={getCreatorLabel}
                  getStatusColor={getStatusColor}
                  getReadingTime={getReadingTime}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Infinite Scroll Loading */}
          {visibleItems.length < sortedItems.length && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading more items...
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Scroll down to load more ({sortedItems.length - visibleItems.length} remaining)
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