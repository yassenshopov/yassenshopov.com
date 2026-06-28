'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

// Route-level error boundary. Catches render/runtime errors thrown by the
// segment below it and offers a recovery path instead of a blank screen.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to the browser console / any monitoring hooked into it.
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-xl">
          <p className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Something went wrong
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            This page hit a snag
          </h1>
          <p className="text-muted-foreground text-lg">
            An unexpected error occurred while rendering this page. You can try again, or head back
            home.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono">Reference: {error.digest}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button onClick={reset} size="lg" className="group">
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Take me home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
