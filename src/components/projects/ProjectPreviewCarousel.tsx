'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const HOVER_KICKOFF_MS = 120;
const WIPE_MS = 650;
/** Pause after each wipe finishes before the next advance. */
const HOLD_MS = 500;
const CYCLE_MS = WIPE_MS + HOLD_MS;

type ProjectPreviewCarouselProps = {
  images: string[];
  title: string;
  hovering?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
};

export function ProjectPreviewCarousel({
  images,
  title,
  hovering = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  className,
  imageClassName,
}: ProjectPreviewCarouselProps) {
  const [index, setIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [wipeAway, setWipeAway] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const indexRef = useRef(0);
  const wipeBusyRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const kickoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (kickoffRef.current) {
      clearTimeout(kickoffRef.current);
      kickoffRef.current = null;
    }
  }, []);

  const resetSlide = useCallback(() => {
    indexRef.current = 0;
    wipeBusyRef.current = false;
    setIndex(0);
    setOutgoingIndex(null);
    setWipeAway(false);
  }, []);

  const advance = useCallback(() => {
    if (images.length <= 1 || wipeBusyRef.current) return;

    wipeBusyRef.current = true;
    const from = indexRef.current;
    const to = (from + 1) % images.length;
    indexRef.current = to;

    setOutgoingIndex(from);
    setWipeAway(false);
    setIndex(to);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setWipeAway(true));
    });
  }, [images.length]);

  const handleWipeEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== 'clip-path') return;
      if (!wipeAway) return;
      wipeBusyRef.current = false;
      setOutgoingIndex(null);
      setWipeAway(false);
    },
    [wipeAway]
  );

  useEffect(() => {
    if (!hovering || prefersReducedMotion || images.length <= 1) {
      clearTimer();
      if (!hovering) resetSlide();
      return;
    }

    kickoffRef.current = setTimeout(() => {
      advance();
      intervalRef.current = setInterval(advance, CYCLE_MS);
    }, HOVER_KICKOFF_MS);

    return clearTimer;
  }, [hovering, images.length, prefersReducedMotion, clearTimer, advance, resetSlide]);

  if (images.length === 0) {
    return <div className={cn('relative aspect-[5/3] w-full bg-muted', className)} />;
  }

  const animating = hovering && !prefersReducedMotion && images.length > 1;
  const currentSrc = images[index];

  return (
    <div
      className={cn(
        'relative aspect-[5/3] w-full overflow-hidden rounded-md border border-border/50 bg-muted',
        className
      )}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-700 ease-out',
          animating && 'scale-[1.02]'
        )}
      >
        {currentSrc ? (
          <Image
            key={`base-${currentSrc}`}
            src={currentSrc}
            alt={`${title} preview`}
            fill
            sizes={sizes}
            className={cn('object-cover object-top', imageClassName)}
          />
        ) : null}

        {outgoingIndex !== null && images[outgoingIndex] ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] transition-[clip-path] ease-in-out motion-reduce:transition-none"
            style={{
              clipPath: wipeAway ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)',
              transitionDuration: `${WIPE_MS}ms`,
            }}
            onTransitionEnd={handleWipeEnd}
          >
            <Image
              src={images[outgoingIndex]}
              alt=""
              fill
              sizes={sizes}
              className={cn('object-cover object-top', imageClassName)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
