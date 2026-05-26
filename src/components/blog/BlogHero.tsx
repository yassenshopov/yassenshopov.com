'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { BookOpen, CalendarDays, ChevronDown } from 'lucide-react';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { BlogHeroMarquee } from '@/components/blog/BlogHeroMarquee';

interface BlogHeroProps {
  thumbnails?: string[];
}

export function BlogHero({ thumbnails = [] }: BlogHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Subtle parallax: background glow drifts down faster, content drifts up a touch
  const backgroundY = useTransform(scrollY, [0, 600], [0, 120]);
  const gridY = useTransform(scrollY, [0, 600], [0, 60]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);
  const arrowOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  // Disable parallax if the user prefers reduced motion
  const safeBackgroundY = prefersReducedMotion ? 0 : backgroundY;
  const safeGridY = prefersReducedMotion ? 0 : gridY;
  const safeContentY = prefersReducedMotion ? 0 : contentY;
  const safeContentOpacity = prefersReducedMotion ? 1 : contentOpacity;

  const handleScrollDown = () => {
    const target = document.getElementById('blog-posts');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="newsletter"
      className="relative isolate flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted scroll-mt-16 min-h-[calc(100vh-4rem)]"
    >
      {/* Infinite marquee of blog thumbnails behind everything */}
      <BlogHeroMarquee thumbnails={thumbnails} />

      {/* Soft brand glow accents with parallax */}
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

      {/* Flat overlay: uniformly dims the marquee across the whole hero */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'color-mix(in oklch, var(--background) 65%, transparent)',
        }}
      />

      {/* Grain / noise texture spread evenly across the hero */}
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
        className="container mx-auto px-4 py-10 md:py-14 will-change-transform"
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium">
              A blog series by
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

          {/* Title with TM mark */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-2">
            <span className="relative inline-block">
              Life Engineering
              <sup className="absolute -top-1 -right-4 md:-right-6 text-[0.6rem] md:text-sm font-medium text-muted-foreground tracking-normal">
                TM
              </sup>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-muted-foreground font-medium mb-5">
            [official blog &amp; newsletter]
          </p>

          {/* Divider */}
          <div className="mx-auto h-px w-full max-w-md bg-border mb-5" />

          {/* Description */}
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
            Receive a personal letter full of stories, reflections and insights &mdash; written to
            expand your vision, fuel your creativity, and inspire the way you think, live and
            create.
          </p>

          {/* Newsletter form */}
          <div className="max-w-xl mx-auto mb-4">
            <KitNewsletterForm variant="inline" />
          </div>

          {/* Cadence */}
          <div className="inline-flex items-center gap-2 text-[0.7rem] md:text-xs text-muted-foreground uppercase tracking-[0.18em]">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>A new letter in your inbox every week</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll-down indicator */}
      <motion.button
        onClick={handleScrollDown}
        style={{ opacity: arrowOpacity }}
        aria-label="Scroll to blog posts"
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.22em]">Read the latest</span>
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
