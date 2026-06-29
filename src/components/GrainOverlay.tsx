import type { CSSProperties } from 'react';

// Two procedural film-grain textures, previously inlined as ~600-char data URIs
// in nine different files. `hero` is the high-contrast 220px noise used behind
// page heroes; `card` is the softer 160px noise multiplied over coloured cards.
const HERO_GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const CARD_GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

interface GrainOverlayProps {
  /** `hero` (default) is the page-hero noise; `card` is the on-card noise. */
  variant?: 'hero' | 'card';
  /** Positioning / blend-mode / opacity classes for this particular usage. */
  className?: string;
  style?: CSSProperties;
}

/**
 * Decorative film-grain overlay. Render it as a positioned, `aria-hidden`
 * sibling; callers own the layout/blend classes via `className`.
 */
export function GrainOverlay({ variant = 'hero', className, style }: GrainOverlayProps) {
  const isHero = variant === 'hero';
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url("${isHero ? HERO_GRAIN_URL : CARD_GRAIN_URL}")`,
        ...(isHero ? { backgroundSize: '220px 220px' } : null),
        ...style,
      }}
    />
  );
}
