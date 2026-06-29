import 'server-only';
import { z } from 'zod';
import itemsData from './library-items.json';
import { getLatestEntry, type LibraryItem } from './library';

/**
 * Server-only library catalogue.
 *
 * The full ~400-item `library-items.json` and Zod live here so neither ships
 * to the browser. Pages load the validated, projected list via
 * `getLibraryItems()` (a React Server Component) and pass the slice they need
 * into client islands as props. Validation runs once at module load — i.e. at
 * build time for the statically rendered library routes.
 */

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
  // Zod 4 requires an explicit key schema for records.
  links: z.record(z.string(), z.string().optional()).optional(),
});

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
const items: LibraryItem[] = parsed.map(projectLibraryItem);

/** The validated, work-level library catalogue. Server-only. */
export function getLibraryItems(): LibraryItem[] {
  return items;
}
