import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRID_BG: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
};

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-50" style={GRID_BG} />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 72%)',
        }}
      />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">Open to new projects</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-foreground">
            Curious how we&apos;d work together?
          </h2>
          <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground">
            From the first call to launch day, here&apos;s exactly what building with me looks like
            &mdash; the kind of work I take on, how I scope it, and the next step.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="group">
              <Link href="/work-with-me">
                See how I work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact-me#book">Book a call</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
