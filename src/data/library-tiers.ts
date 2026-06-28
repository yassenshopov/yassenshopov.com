import tiersData from './library-tiers.json';
import type { LibraryItem } from './library';

/**
 * Tier assignments are stored separately from the library items themselves so a
 * single work can be ranked independently on each board. Each board keeps an
 * ordered list of item ids per tier (including the catch-all `unranked` row),
 * which captures both *which* tier an item sits in and its *position* within
 * that row. There is intentionally no link to an item's star rating — tiers are
 * a wholly separate, manually-curated ranking.
 */
export type TierBoardId = 'fiction' | 'nonfiction' | 'movies' | 'series' | 'anime-manga';

export const UNRANKED_TIER = 'unranked';

/** Ordered item ids keyed by tier id (`s`..`d`, plus `unranked`). */
export type BoardTiers = Record<string, string[]>;
export type TierData = Record<TierBoardId, BoardTiers>;

export interface TierDefinition {
  id: string;
  label: string;
  colorClass: string;
}

/** The ranked tier rows, highest to lowest. No correlation to star ratings. */
export const TIERS: TierDefinition[] = [
  { id: 's', label: 'S', colorClass: 'bg-rose-500' },
  { id: 'a', label: 'A', colorClass: 'bg-orange-500' },
  { id: 'b', label: 'B', colorClass: 'bg-amber-400' },
  { id: 'c', label: 'C', colorClass: 'bg-lime-500' },
  { id: 'd', label: 'D', colorClass: 'bg-sky-500' },
];

/** All row keys in render order, ranked tiers followed by the unranked pool. */
export const TIER_KEYS: string[] = [...TIERS.map((t) => t.id), UNRANKED_TIER];

/** Quick lookup of a tier definition by its id. */
export const TIER_BY_ID: Record<string, TierDefinition> = Object.fromEntries(
  TIERS.map((t) => [t.id, t])
);

export const TIER_BOARDS: Array<{ id: TierBoardId; label: string }> = [
  { id: 'fiction', label: 'Fiction Books' },
  { id: 'nonfiction', label: 'Nonfiction Books' },
  { id: 'movies', label: 'Movies' },
  { id: 'series', label: 'Series' },
  { id: 'anime-manga', label: 'Anime & Manga' },
];

/**
 * Explicit membership for the Anime & Manga board. Anime series carry no
 * distinguishing genre in the data, so the set is curated by hand; manga are
 * the books tagged with the "Manga" genre. Edit freely as the library grows.
 */
export const ANIME_MANGA_IDS = new Set<string>([
  // Anime (series)
  '88',
  '114',
  '115',
  '117',
  '118',
  '119',
  '120',
  '121',
  '122',
  '123',
  '124',
  '125',
  '126',
  '127',
  '136',
  // Manga (books)
  'choujin-x',
  'ext-tokyo-ghoul-re',
  'ext-tokyo-ghoul',
  'goodnight-punpun',
]);

function emptyBoard(): BoardTiers {
  return Object.fromEntries(TIER_KEYS.map((k) => [k, []]));
}

/**
 * Normalize one board's saved tiers from the raw JSON: keep only known tier
 * keys, coerce each to an array, and drop any non-string ids. This is a
 * deliberate, Zod-free boundary check — `library-tiers.ts` is imported by
 * client components (e.g. `TierBadge`), so pulling in Zod here would re-bloat
 * the bundle we just trimmed on the library routes.
 */
function normalizeBoard(raw: unknown): BoardTiers {
  const board = emptyBoard();
  if (!raw || typeof raw !== 'object') return board;
  const source = raw as Record<string, unknown>;
  for (const key of TIER_KEYS) {
    const value = source[key];
    if (Array.isArray(value)) {
      board[key] = value.filter((id): id is string => typeof id === 'string');
    }
  }
  return board;
}

const rawData = (tiersData ?? {}) as Record<string, unknown>;

export const tierData: TierData = Object.fromEntries(
  TIER_BOARDS.map((b) => [b.id, normalizeBoard(rawData[b.id])])
) as TierData;

/**
 * Whether an item can appear on a given board. Anime/manga items live only on
 * their dedicated board. Books are intentionally *not* auto-split into
 * fiction/nonfiction — both book boards expose the full book catalogue in their
 * unranked pool so the split is curated by hand while ranking.
 */
export function itemMatchesBoard(item: LibraryItem, boardId: TierBoardId): boolean {
  if (ANIME_MANGA_IDS.has(item.id)) return boardId === 'anime-manga';
  switch (boardId) {
    case 'fiction':
    case 'nonfiction':
      return item.type === 'book';
    case 'movies':
      return item.type === 'movie';
    case 'series':
      return item.type === 'series';
    case 'anime-manga':
      return false;
  }
}

/**
 * The tier an item is ranked in, searched across every board (an item is
 * realistically only ranked on one). Returns the tier id (`s`..`d`) or null
 * when the item is unranked everywhere.
 */
export function getItemTier(itemId: string, data: TierData = tierData): string | null {
  for (const { id } of TIER_BOARDS) {
    const tiers = data[id];
    if (!tiers) continue;
    for (const t of TIERS) {
      if (tiers[t.id]?.includes(itemId)) return t.id;
    }
  }
  return null;
}

/**
 * Build the complete, ordered tier lists for a board: saved order first
 * (filtered to items actually on the board), with any not-yet-placed items
 * appended to the unranked row so newly-added works always surface.
 */
export function materializeBoard(items: LibraryItem[], saved: BoardTiers | undefined): BoardTiers {
  const boardIds = new Set(items.map((i) => i.id));
  const result = emptyBoard();
  const placed = new Set<string>();

  for (const key of TIER_KEYS) {
    const ids = (saved?.[key] ?? []).filter((id) => boardIds.has(id) && !placed.has(id));
    ids.forEach((id) => placed.add(id));
    result[key] = ids;
  }

  for (const item of items) {
    if (!placed.has(item.id)) result[UNRANKED_TIER].push(item.id);
  }

  return result;
}
