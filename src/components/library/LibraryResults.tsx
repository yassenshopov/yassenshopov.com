'use client';

interface LibraryResultsProps {
  sortedItemsLength: number;
  searchQuery: string;
}

export default function LibraryResults({ sortedItemsLength, searchQuery }: LibraryResultsProps) {
  return (
    <section className="py-8 text-center">
      <div className="text-lg font-medium text-foreground">
        {sortedItemsLength} {sortedItemsLength === 1 ? 'item' : 'items'}
        {searchQuery && <span className="text-primary"> matching "{searchQuery}"</span>}
      </div>
      {sortedItemsLength === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search terms
        </p>
      )}
    </section>
  );
} 