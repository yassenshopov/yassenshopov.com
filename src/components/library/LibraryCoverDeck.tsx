'use client';

import { useState } from 'react';
import Image from 'next/image';

function layerOffset(index: number, total: number, spread: boolean) {
  const mid = (total - 1) / 2;
  const d = index - mid;
  const x = spread ? d * 34 : d * 10;
  return { x, zIndex: index };
}

interface LibraryCoverDeckProps {
  images: string[];
  alt: string;
}

/**
 * Stacked season posters for a series entry. Rests as a tight deck; fans out on
 * hover (pointer devices) or when the card receives focus-within.
 */
export default function LibraryCoverDeck({ images, alt }: LibraryCoverDeckProps) {
  const [spread, setSpread] = useState(false);
  const total = images.length;

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setSpread(true)}
      onMouseLeave={() => setSpread(false)}
      onFocus={() => setSpread(true)}
      onBlur={() => setSpread(false)}
    >
      {images.map((src, index) => {
        const { x, zIndex } = layerOffset(index, total, spread);
        return (
          <div
            key={src}
            className="pointer-events-none absolute inset-y-0 left-1/2 w-[38%] max-w-[9rem] overflow-hidden transition-transform duration-300 ease-out will-change-transform"
            style={{
              zIndex,
              transform: `translateX(calc(-50% + ${x}px))`,
            }}
          >
            <Image
              src={src}
              alt={`${alt} — poster ${index + 1}`}
              fill
              sizes="20vw"
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
