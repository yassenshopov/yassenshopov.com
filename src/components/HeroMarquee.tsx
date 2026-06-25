'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MarqueeRowProps {
  images: string[];
  direction: 'left' | 'right';
  durationSec: number;
  tileClassName: string;
  sizes: string;
  imageClassName: string;
}

function MarqueeRow({
  images,
  direction,
  durationSec,
  tileClassName,
  sizes,
  imageClassName,
}: MarqueeRowProps) {
  // Duplicate items so translating -50% lands on an identical second copy → seamless loop.
  const items = [...images, ...images];

  return (
    <ul
      className={cn(
        'flex w-max items-center gap-3 md:gap-4 shrink-0 will-change-transform motion-reduce:animate-none',
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
      )}
      style={{ animationDuration: `${durationSec}s` }}
    >
      {items.map((src, i) => (
        <li
          key={`${src}-${i}`}
          className={cn(
            'relative shrink-0 overflow-hidden rounded-md border border-border/40',
            tileClassName
          )}
        >
          {/* These tiles are purely decorative (the whole marquee is aria-hidden),
              rendered at low opacity and duplicated, so we skip Next's image
              optimizer to avoid burning optimization quota on background art. */}
          <Image src={src} alt="" fill sizes={sizes} className={imageClassName} unoptimized />
        </li>
      ))}
    </ul>
  );
}

export interface HeroMarqueeProps {
  /** Thumbnails/covers to scroll. Rendering is purely decorative. */
  images: string[];
  /** Tailwind classes setting each tile's aspect ratio + responsive width (and any bg). */
  tileClassName: string;
  /** Per-tile responsive `sizes` hint for next/image. */
  sizes: string;
  /** Extra classes for the <Image> (e.g. `object-cover object-top`). */
  imageClassName?: string;
  /** [topRow, bottomRow] durations in seconds. Ignored when `durationStrategy` is set. */
  rowDurationsSec?: [number, number];
  /** Derive [topRow, bottomRow] durations from the image count (keeps pixel speed ~constant). */
  durationStrategy?: (count: number) => [number, number];
  /** Fraction of the list to rotate the second row by, so vertical neighbours don't repeat. */
  secondRowOffsetDivisor?: number;
  /** Optional spacer rendered between the two rows (e.g. the blog hero pushes them apart). */
  rowSpacerClassName?: string;
}

/**
 * Shared two-row infinite marquee used behind the blog, notion, projects, and
 * library heroes. Each surface only differs by tile size/aspect, the `sizes`
 * hint, and how row durations are chosen — everything else (seamless loop,
 * masked edges, reduced-motion handling) is identical and lives here.
 */
export function HeroMarquee({
  images,
  tileClassName,
  sizes,
  imageClassName = 'object-cover',
  rowDurationsSec = [120, 140],
  durationStrategy,
  secondRowOffsetDivisor = 3,
  rowSpacerClassName,
}: HeroMarqueeProps) {
  if (!images.length) return null;

  const offset = Math.max(1, Math.floor(images.length / secondRowOffsetDivisor));
  const row1 = images;
  const row2 = [...images.slice(offset), ...images.slice(0, offset)];

  const [row1Duration, row2Duration] = durationStrategy
    ? durationStrategy(images.length)
    : rowDurationsSec;

  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-20 overflow-hidden pointer-events-none flex flex-col justify-center gap-3 md:gap-4 opacity-30 dark:opacity-35"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <MarqueeRow
        images={row1}
        direction="left"
        durationSec={row1Duration}
        tileClassName={tileClassName}
        sizes={sizes}
        imageClassName={imageClassName}
      />
      {rowSpacerClassName && <div aria-hidden className={cn('shrink-0', rowSpacerClassName)} />}
      <MarqueeRow
        images={row2}
        direction="right"
        durationSec={row2Duration}
        tileClassName={tileClassName}
        sizes={sizes}
        imageClassName={imageClassName}
      />
    </div>
  );
}
