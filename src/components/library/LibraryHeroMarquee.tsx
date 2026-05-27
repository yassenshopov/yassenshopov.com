'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MarqueeRowProps {
  images: string[];
  direction?: 'left' | 'right';
  durationSec?: number;
}

function MarqueeRow({ images, direction = 'left', durationSec = 140 }: MarqueeRowProps) {
  const items = [...images, ...images];

  return (
    <ul
      className={cn(
        'flex w-max items-center gap-3 md:gap-4 shrink-0 will-change-transform motion-reduce:animate-none',
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
      )}
      style={{ animationDuration: `${durationSec}s` }}
    >
      {items.map((src, i) => (
        <li
          key={`${src}-${i}`}
          className="relative aspect-[2/3] w-[6rem] sm:w-[7rem] md:w-[8.5rem] shrink-0 rounded-md overflow-hidden border border-border/40 bg-black"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 768px) 136px, (min-width: 640px) 112px, 96px"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

interface LibraryHeroMarqueeProps {
  covers: string[];
}

// Tuned so the marquee scrolls at roughly the same pixels/second regardless of
// how many covers are in the library. The animation translates by -50% of the
// doubled track, so the on-screen distance per cycle grows with the cover count;
// the duration has to grow with it to keep visual speed constant.
const SECONDS_PER_COVER = 3.2;
const MIN_DURATION_SEC = 80;
const MAX_DURATION_SEC = 600;

export function LibraryHeroMarquee({ covers }: LibraryHeroMarqueeProps) {
  if (!covers.length) return null;

  // Offset the second row so vertical neighbours don't repeat
  const offset = Math.max(1, Math.floor(covers.length / 2));
  const row1 = covers;
  const row2 = [...covers.slice(offset), ...covers.slice(0, offset)];

  const baseDuration = Math.min(
    MAX_DURATION_SEC,
    Math.max(MIN_DURATION_SEC, covers.length * SECONDS_PER_COVER),
  );
  // Keep the original 160 / 180 ratio so the rows scroll at slightly
  // different speeds and don't visually sync up.
  const row1Duration = baseDuration;
  const row2Duration = baseDuration * 1.125;

  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-20 overflow-hidden pointer-events-none flex flex-col justify-center gap-3 md:gap-4 opacity-30 dark:opacity-35"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <MarqueeRow images={row1} direction="left" durationSec={row1Duration} />
      <MarqueeRow images={row2} direction="right" durationSec={row2Duration} />
    </div>
  );
}
