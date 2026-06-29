import Layout from '@/components/Layout';

// Shown while the blog route segment streams in.
export default function BlogLoading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 h-12 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`blog-skeleton-${i}`}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <div className="aspect-16/10 w-full animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
