'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LibraryModalCoverCarouselProps {
  images: string[];
  alt: string;
  onActiveImageChange?: (src: string) => void;
  fallbackIcon?: React.ReactNode;
}

const slideEase = [0.32, 0.72, 0, 1] as const;

export default function LibraryModalCoverCarousel({
  images,
  alt,
  onActiveImageChange,
  fallbackIcon,
}: LibraryModalCoverCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduceMotion = useReducedMotion();
  const total = images.length;
  const hasMultiple = total > 1;

  useEffect(() => {
    setIndex(0);
    setDirection(0);
  }, [images]);

  const active = images[index];

  useEffect(() => {
    if (active) onActiveImageChange?.(active);
  }, [active, onActiveImageChange]);

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => (i + delta + total) % total);
  };

  const slideTransition = reduceMotion ? { duration: 0 } : { duration: 0.32, ease: slideEase };

  const offset = reduceMotion ? 0 : 48;

  return (
    <div className="w-full max-w-[14rem] sm:max-w-[15.5rem] md:max-w-none">
      <div
        className={`relative w-44 h-[17.5rem] sm:w-52 sm:h-[21rem] md:w-56 md:h-[22.5rem] overflow-hidden ${
          active ? '' : 'bg-muted dark:bg-black'
        }`}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {active ? (
            <motion.div
              key={active}
              custom={direction}
              className="absolute inset-0"
              initial={{
                opacity: 0,
                x: direction === 0 ? 0 : direction > 0 ? offset : -offset,
                scale: reduceMotion ? 1 : 0.94,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: direction === 0 ? 0 : direction > 0 ? -offset : offset,
                scale: reduceMotion ? 1 : 0.94,
              }}
              transition={slideTransition}
            >
              <Image
                src={active}
                alt={hasMultiple ? `${alt} — poster ${index + 1}` : alt}
                fill
                sizes="(min-width: 768px) 224px, 176px"
                className="object-contain"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              className="absolute inset-0 flex items-center justify-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={slideTransition}
            >
              {fallbackIcon}
            </motion.div>
          )}
        </AnimatePresence>

        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Previous poster"
              className="absolute left-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/90 shadow-none"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Next poster"
              className="absolute right-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/90 shadow-none"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {hasMultiple && (
        <p className="mt-2 text-center text-[10px] font-medium tabular-nums text-muted-foreground md:text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: slideEase }}
              className="inline-block"
            >
              {index + 1} / {total}
            </motion.span>
          </AnimatePresence>
        </p>
      )}
    </div>
  );
}
