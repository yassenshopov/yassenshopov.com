'use client';

interface LibraryResultsProps {
  sortedItemsLength: number;
  searchQuery: string;
  isLoading?: boolean;
}

export default function LibraryResults({ sortedItemsLength, searchQuery, isLoading = false }: LibraryResultsProps) {
  return (
    <div className="text-lg font-medium text-foreground">
      <div className="flex items-center gap-2">
        {sortedItemsLength} {sortedItemsLength === 1 ? 'item' : 'items'}
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {searchQuery && <span className="text-primary"> matching "{searchQuery}"</span>}
      {sortedItemsLength === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search terms
        </p>
      )}
    </div>
  );
} 