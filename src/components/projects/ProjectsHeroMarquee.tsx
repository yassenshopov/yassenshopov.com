'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MarqueeRowProps {
  images: string[];
  direction?: 'left' | 'right';
  durationSec?: number;
}

function MarqueeRow({ images, direction = 'left', durationSec = 120 }: MarqueeRowProps) {
  // Duplicate items so translating -50% lands on an identical second copy → seamless loop
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
          className="relative aspect-video w-[20rem] sm:w-[24rem] md:w-[30rem] shrink-0 rounded-md overflow-hidden border border-border/40 bg-card"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 768px) 480px, (min-width: 640px) 384px, 320px"
            className="object-cover object-top"
          />
        </li>
      ))}
    </ul>
  );
}

interface ProjectsHeroMarqueeProps {
  thumbnails: string[];
}

export function ProjectsHeroMarquee({ thumbnails }: ProjectsHeroMarqueeProps) {
  if (!thumbnails.length) return null;

  // Vary the second row's order so vertical neighbours don't repeat
  const row1 = thumbnails;
  const offset = Math.max(1, Math.floor(thumbnails.length / 3));
  const row2 = [...thumbnails.slice(offset), ...thumbnails.slice(0, offset)];

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
      <MarqueeRow images={row1} direction="left" durationSec={120} />
      <MarqueeRow images={row2} direction="right" durationSec={140} />
    </div>
  );
}
