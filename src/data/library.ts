import { z } from 'zod';
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

const libraryEntrySchema = z.object({
  dateStarted: z.string().optional(),
  dateCompleted: z.string().optional(),
  status: z.enum(['completed', 'in-progress', 'on-pause', 'dnf']),
  rating: z.number().nullable().optional(),
  notes: z.string().optional(),
});

const libraryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  director: z.string().optional(),
  creator: z.string().optional(),
  type: z.enum(['book', 'movie', 'series']),
  rating: z.number().nullable().optional().default(null),
  status: z
    .enum(['completed', 'in-progress', 'on-pause', 'dnf', 'want-to-read', 'want-to-watch'])
    .optional()
    .default('want-to-read'),
  dateCompleted: z.string().optional(),
  dateStarted: z.string().optional(),
  notes: z.string().optional(),
  entries: z.array(libraryEntrySchema).optional(),
  year: z.number().optional(),
  topics: z.array(z.string()).optional(),
  externalUrl: z.string().optional(),
  genre: z.array(z.string()).default([]),
  description: z.string().default(''),
  coverImage: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  relationships: z
    .object({
      adaptations: z.array(z.string()).optional(),
      basedOn: z.array(z.string()).optional(),
      sequel: z.string().optional(),
      prequel: z.string().optional(),
      related: z.array(z.string()).optional(),
      sameUniverse: z.array(z.string()).optional(),
    })
    .optional(),
  links: z.record(z.string().optional()).optional(),
});

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

function projectLibraryItem(raw: z.infer<typeof libraryItemSchema>): LibraryItem {
  const entries = raw.entries;
  const latest = entries ? getLatestEntry(entries) : undefined;

  if (entries && latest) {
    return {
      ...raw,
      entries,
      status: latest.status,
      rating: latest.rating ?? null,
      dateCompleted: latest.dateCompleted,
      dateStarted: latest.dateStarted,
      notes: latest.notes,
    };
  }

  return {
    ...raw,
    rating: raw.rating ?? null,
  };
}

const parsed = z.array(libraryItemSchema).parse(itemsData);
export const libraryItems: LibraryItem[] = parsed.map(projectLibraryItem);
