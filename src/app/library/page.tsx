'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, X } from 'lucide-react';
import Layout from '@/components/Layout';
import LibraryHero from '@/components/library/LibraryHero';
import LibraryTabs from '@/components/library/LibraryTabs';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import LibraryModal from '@/components/library/LibraryModal';
import LibraryResults from '@/components/library/LibraryResults';
import LibraryItemSkeleton from '@/components/library/LibraryItemSkeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';

export default function LibraryPage() {
  const {
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
    showMoreItems,
    sortedItems,
    allSortedItems,
    hasMoreItems,
    allItems,
    getCreatorLabel,
    getStatusColor,
    toggleFavorite,
    getStatistics,
    getRelatedItems,
    getSeriesInfo,
    getRelationshipLabel,
    navigateToItem,
    loadMoreRef,
    animatingHearts,
    copiedId,
    isTransitioning,
  } = useLibrary();

  const overallStats = getStatistics(allItems);

  const bookCount = allItems.filter((i) => i.type === 'book').length;
  const watchableCount = allItems.filter((i) => i.type === 'movie' || i.type === 'series').length;

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

      switch (event.key) {
        case '/': {
          event.preventDefault();
          const searchInput = document.querySelector(
            'input[placeholder*="Search"]',
          ) as HTMLInputElement | null;
          searchInput?.focus();
          break;
        }
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, setViewMode, navigateToItem, setSelectedItem]);

  return (
    <Layout>
      <LibraryHero stats={overallStats} />

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

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">View:</span>
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
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

      <section className="pt-2 pb-16">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'
                : 'space-y-4'
            }
          >
            {sortedItems.map((item) => (
              <LibraryItemCard
                key={item.id}
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
            ))}
            {isLoadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <LibraryItemSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
              ))}
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
