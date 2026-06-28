'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const HomeHeroSky = dynamic(() =>
  import('@/components/home/HomeHeroSky').then((mod) => mod.HomeHeroSky)
);

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function HomeHero() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0.55]);
  const arrowOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  const safeContentY = prefersReducedMotion ? 0 : contentY;
  const safeContentOpacity = prefersReducedMotion ? 1 : contentOpacity;

  return (
    <section
      id="home-hero"
      className="relative isolate flex items-center overflow-hidden scroll-mt-16 min-h-[calc(100vh-4rem)]"
    >
      <HomeHeroSky />

      <motion.div
        style={{ y: safeContentY, opacity: safeContentOpacity }}
        className="container mx-auto px-4 py-16 md:py-20 will-change-transform"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/25 text-white mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium">
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
              <span aria-hidden className="text-white/50">
                &bull;
              </span>
              <span className="inline-flex items-center gap-1 text-white/80">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Sofia, Bulgaria
                <span
                  role="img"
                  aria-label="Bulgaria"
                  className="ml-0.5 inline-block h-3 w-[18px] rounded-[2px] ring-1 ring-white/30"
                  style={{
                    background:
                      'linear-gradient(to bottom, #ffffff 0 33.33%, #00966e 33.33% 66.66%, #d62612 66.66% 100%)',
                  }}
                />
              </span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-white mb-4">
            I design &amp; build
            <br />
            web products that ship.
          </h1>

          <p className="text-base md:text-xl text-white/80 font-medium mb-5">
            MVPs, web apps &amp; dashboards &mdash; shipped, not stuck in Figma.
          </p>

          <div className="mx-auto h-px w-full max-w-md bg-white/30 mb-7" />

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Button asChild size="lg" className="group bg-white text-neutral-900 hover:bg-white/90">
              <Link href="/contact-me#book">
                Book a call
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link href="/projects">See my work</Link>
            </Button>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] md:text-xs text-white/70 uppercase tracking-[0.18em]">
            <span>
              <span className="text-white font-semibold">6+</span> Years of exp
            </span>
            <span aria-hidden className="text-white/30">
              &bull;
            </span>
            <span>
              <span className="text-white font-semibold">20+</span> Projects
            </span>
            <span aria-hidden className="text-white/30">
              &bull;
            </span>
            <span>Worked in startups and enterprise</span>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId('what-i-do')}
        style={{ opacity: arrowOpacity }}
        aria-label="Scroll to what I do"
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.22em]">Take a look</span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm group-hover:border-white"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
