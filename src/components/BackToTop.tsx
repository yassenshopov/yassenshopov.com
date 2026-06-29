'use client';

import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      Back to top
      <ArrowUp
        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
