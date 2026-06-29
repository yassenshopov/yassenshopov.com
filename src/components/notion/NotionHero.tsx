'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HeroMarquee } from '@/components/HeroMarquee';
import { GrainOverlay } from '@/components/GrainOverlay';

interface NotionHeroProps {
  templateCount: number;
  freeCount: number;
  categoryCount: number;
  thumbnails?: string[];
}

export function NotionHero({
  templateCount,
  freeCount,
  categoryCount,
  thumbnails = [],
}: NotionHeroProps) {
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

  const handleScrollDown = () => {
    const target = document.getElementById('templates');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="notion-hero"
      className="relative isolate flex items-center overflow-hidden bg-linear-to-b from-background via-background to-muted scroll-mt-16 min-h-112 md:min-h-136"
    >
      <HeroMarquee
        images={thumbnails}
        tileClassName="aspect-video w-[20rem] sm:w-[24rem] md:w-120 bg-card"
        sizes="(min-width: 768px) 480px, (min-width: 640px) 384px, 320px"
      />

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

      <GrainOverlay className="absolute inset-0 -z-10 pointer-events-none mix-blend-hard-light opacity-95 dark:opacity-40 dark:mix-blend-overlay in-[.olive]:opacity-40 in-[.olive]:mix-blend-overlay" />

      <motion.div
        style={{ y: safeContentY, opacity: safeContentOpacity }}
        className="container mx-auto px-4 py-12 md:py-16 will-change-transform"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium">
              A template library by
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
            Notion Templates
          </h1>

          <p className="text-base md:text-xl text-muted-foreground font-medium mb-5">
            [dashboards &amp; productivity systems]
          </p>

          <div className="mx-auto h-px w-full max-w-md bg-border mb-5" />

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
            Carefully crafted systems to organise your finances, studies, work and life &mdash; drop
            them into your workspace and start the moment you duplicate.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] md:text-xs text-muted-foreground uppercase tracking-[0.18em]">
            <span>
              <span className="text-foreground font-semibold">{templateCount}</span> Templates
            </span>
            <span aria-hidden className="text-border">
              &bull;
            </span>
            <span>
              <span className="text-foreground font-semibold">{freeCount}</span> Free
            </span>
            <span aria-hidden className="text-border">
              &bull;
            </span>
            <span>
              <span className="text-foreground font-semibold">{categoryCount}</span> Categories
            </span>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={handleScrollDown}
        style={{ opacity: arrowOpacity }}
        aria-label="Scroll to templates"
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.22em]">
          Browse the collection
        </span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/60 backdrop-blur-xs group-hover:border-primary"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
