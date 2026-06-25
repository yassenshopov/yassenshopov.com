import itemsData from './library-items.json';

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
  // The top-level status/dates/rating/notes mirror the *latest* entry when one
  // exists; wishlist items (no entries) keep `want-to-read` / `want-to-watch`
  // here. Treat these as a read-only view derived from `entries`.
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

function entryTimestamp(entry: LibraryEntry): number {
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

function projectLibraryItem(raw: Record<string, unknown>): LibraryItem {
  const entries = Array.isArray(raw.entries) ? (raw.entries as LibraryEntry[]) : undefined;
  const latest = entries ? getLatestEntry(entries) : undefined;

  if (entries && latest) {
    return {
      ...(raw as Omit<LibraryItem, 'rating' | 'status' | 'entries'>),
      entries,
      status: latest.status,
      rating: latest.rating ?? null,
      dateCompleted: latest.dateCompleted,
      dateStarted: latest.dateStarted,
      notes: latest.notes,
    };
  }

  // Wishlist items (no entries): keep the raw top-level status/rating/etc.
  return {
    ...(raw as Omit<LibraryItem, 'rating'>),
    rating: (raw.rating as number | null | undefined) ?? null,
  };
}

export const libraryItems: LibraryItem[] = (itemsData as Record<string, unknown>[]).map(
  projectLibraryItem
);
