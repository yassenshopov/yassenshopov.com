// Static art-page data. No hooks or components, so it's safe to import from
// both the server page and its client islands.

export const TOTAL_IMAGES = 24;

export const artworks = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
  const n = i + 1;
  return {
    src: `/resources/images/art/img${n}.webp`,
    alt: `Yassen Shopov digital artwork #${n}`,
  };
});

export const INSTAGRAM_URL = 'https://www.instagram.com/kofiscrib/';
export const COMMISSION_EMAIL = 'yassenshopov00@gmail.com';

export type CommissionPieceType = 'character' | 'illustration' | 'cover' | 'other';

export const PIECE_OPTIONS: { value: CommissionPieceType; label: string }[] = [
  { value: 'character', label: 'Character art' },
  { value: 'illustration', label: 'Full illustration' },
  { value: 'cover', label: 'Cover / banner' },
  { value: 'other', label: 'Other' },
];

// Four floating hero thumbnails. Indices map to the `artworks` array; the
// staggered `baseY` offsets give the grid a gentle masonry-like stagger.
export const HERO_TILES: { idx: number; baseY: number }[] = [
  { idx: 0, baseY: 24 },
  { idx: 6, baseY: -8 },
  { idx: 12, baseY: 24 },
  { idx: 18, baseY: -8 },
];
