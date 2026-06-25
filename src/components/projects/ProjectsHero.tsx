'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectsHeroMarquee } from '@/components/projects/ProjectsHeroMarquee';

interface ProjectsHeroProps {
  projectCount: number;
  techCount: number;
  liveCount: number;
  thumbnails?: string[];
}

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function ProjectsHero({
  projectCount,
  techCount,
  liveCount,
  thumbnails = [],
}: ProjectsHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 600], [0, 120]);
  const gridY = useTransform(scrollY, [0, 600], [0, 60]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);
  const arrowOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  const safeBackgroundY = prefersReducedMotion ? 0 : backgroundY;
  const safeGridY = prefersReducedMotion ? 0 : gridY;
  const safeContentY = prefersReducedMotion ? 0 : contentY;
  const safeContentOpacity = prefersReducedMotion ? 1 : contentOpacity;

  return (
    <section
      id="projects-hero"
      className="relative isolate flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted scroll-mt-16 min-h-[30rem] md:min-h-[36rem]"
    >
      <ProjectsHeroMarquee thumbnails={thumbnails} />

      <motion.div
        aria-hidden
        style={{
          y: safeBackgroundY,
          backgroundImage:
            'radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--primary) 18%, transparent) 0%, transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 45%)',
        }}
        className="absolute inset-0 -z-10 opacity-40 will-change-transform"
      />
      <motion.div
        aria-hidden
        style={{ y: safeGridY }}
        className="absolute inset-0 bg-grid-white/10 -z-10 will-change-transform"
      />

      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'color-mix(in oklch, var(--background) 65%, transparent)',
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none mix-blend-hard-light opacity-95 dark:opacity-40 dark:mix-blend-overlay [.olive_&]:opacity-40 [.olive_&]:mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '220px 220px',
        }}
      />

      <motion.div
        style={{ y: safeContentY, opacity: safeContentOpacity }}
        className="container mx-auto px-4 py-12 md:py-16 will-change-transform"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium">
              Selected work by
              <span className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/resources/images/main_page/YassenShopov.jpg"
                  alt="Yassen Shopov"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </span>
              Yassen Shopov
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-2">
            Portfolio
          </h1>

          <p className="text-base md:text-xl text-muted-foreground font-medium mb-5">
            [apps &middot; dashboards &middot; MVPs]
          </p>

          <div className="mx-auto h-px w-full max-w-md bg-border mb-5" />

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-7 leading-relaxed">
            Dashboards, MVPs, UX cleanups, and data-driven interfaces built with React, Next.js and
            Tailwind &mdash; shipped, live, and in real hands.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            <Button size="lg" className="group" onClick={() => scrollToId('contact')}>
              Book a call
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToId('selected-work')}
            >
              Browse the work
            </Button>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] md:text-xs text-muted-foreground uppercase tracking-[0.18em]">
            <span>
              <span className="text-foreground font-semibold">{projectCount}</span> Projects
            </span>
            <span aria-hidden className="text-border">
              &bull;
            </span>
            <span>
              <span className="text-foreground font-semibold">{techCount}</span> Technologies
            </span>
            <span aria-hidden className="text-border">
              &bull;
            </span>
            <span>
              <span className="text-foreground font-semibold">{liveCount}</span> Shipped &amp; live
            </span>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId('selected-work')}
        style={{ opacity: arrowOpacity }}
        aria-label="Scroll to the work"
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.22em]">See the work</span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/60 backdrop-blur-sm group-hover:border-primary"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
