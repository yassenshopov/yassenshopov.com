import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HomeSelectedWorkGrid } from '@/components/home/HomeSelectedWorkGrid';

export function HomeSelectedWork() {
  return (
    <section id="selected-work" className="bg-muted/60 py-12 md:py-16 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Projects
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-0.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              See all
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-3 md:p-4">
            <HomeSelectedWorkGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
