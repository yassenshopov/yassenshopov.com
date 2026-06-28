import Layout from '@/components/Layout';
import LibraryItemSkeleton from '@/components/library/LibraryItemSkeleton';

// Shown while the library route segment streams in. Mirrors the card grid so
// the transition doesn't jump.
export default function LibraryLoading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 h-12 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <LibraryItemSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
