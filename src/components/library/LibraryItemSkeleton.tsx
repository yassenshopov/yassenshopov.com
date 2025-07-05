export default function LibraryItemSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  return viewMode === 'grid' ? (
    <div className="rounded-lg bg-muted animate-pulse h-80 w-full" />
  ) : (
    <div className="rounded-lg bg-muted animate-pulse h-24 w-full" />
  );
} 