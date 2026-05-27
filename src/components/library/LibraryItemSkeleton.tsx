export default function LibraryItemSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-video w-full rounded-md bg-muted animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
