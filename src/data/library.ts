export type ReadingStatus = 'completed' | 'in-progress' | 'on-pause' | 'dnf';
export type WishlistStatus = 'want-to-read' | 'want-to-watch';
export type LibraryStatus = ReadingStatus | WishlistStatus;

/**
 * A single engagement with a work — one reading, watch, or attempt.
 * Items can have multiple entries to capture re-reads / re-watches across
 * years, each with their own rating, notes, and status.
 */
export interface LibraryEntry {
  dateStarted?: string;
  dateCompleted?: string;
  status: ReadingStatus;
  rating?: number | null;
  notes?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author?: string;
  director?: string;
  creator?: string;
  type: 'book' | 'movie' | 'series';
  rating: number | null;
  status: LibraryStatus;
  dateCompleted?: string;
  dateStarted?: string;
  notes?: string;
  entries?: LibraryEntry[];
  year?: number;
  topics?: string[];
  externalUrl?: string;
  genre: string[];
  description: string;
  coverImage?: string;
  series?: string;
  seriesOrder?: number;
  relationships?: {
    adaptations?: string[];
    basedOn?: string[];
    sequel?: string;
    prequel?: string;
    related?: string[];
    sameUniverse?: string[];
  };
  links?: {
    goodreads?: string;
    amazon?: string;
    imdb?: string;
    netflix?: string;
    spotify?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Timestamp for a single entry — its completion date, falling back to start
 * date. Returns 0 when undated so such entries sort last.
 *
 * NOTE: This module is intentionally free of the `library-items.json` import
 * and Zod so it stays safe to pull into client components (types + pure
 * helpers only). The validated catalogue is loaded server-side in
 * `library.server.ts`.
 */
export function entryTimestamp(entry: LibraryEntry): number {
  const date = entry.dateCompleted || entry.dateStarted;
  return date ? new Date(date).getTime() : 0;
}

/**
 * Latest entry by completion date (falling back to start date). Used to derive
 * the work-level summary fields on `LibraryItem`.
 */
export function getLatestEntry(entries: LibraryEntry[]): LibraryEntry | undefined {
  if (entries.length === 0) return undefined;
  return [...entries].sort((a, b) => entryTimestamp(b) - entryTimestamp(a))[0];
}

/**
 * Most recent engagement timestamp for a whole item — the latest entry's
 * completion date (falling back to its start date). Returns 0 for items with
 * no entries (wishlist/watchlist) so they sort to the bottom.
 */
export function latestEntryTimestamp(item: LibraryItem): number {
  const latest = item.entries ? getLatestEntry(item.entries) : undefined;
  return latest ? entryTimestamp(latest) : 0;
}
