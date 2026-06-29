/**
 * Dev-only endpoint that patches a single LibraryEntry inside library-items.json.
 *
 *   POST /api/library/update-entry
 *     application/json:
 *       id          – LibraryItem id
 *       entryIndex  – (optional) which entry to patch; defaults to the latest
 *                     entry by completion/start date. Required for items with
 *                     more than one entry where the latest isn't the target.
 *       patch       – partial { status, dateStarted, dateCompleted, rating, notes }
 *                     Empty string or null deletes the field from the entry.
 *
 * Disabled in production. Intended to be deleted alongside the cover-upload
 * endpoint once the library data is locked down.
 */
import { type NextRequest, NextResponse } from 'next/server';
import {
  VALIDATORS,
  isEmptyDelete,
  findLatestEntryIndex,
  type RawEntry,
} from '@/lib/library-entry-validation';
import {
  productionGuard,
  sameOriginGuard,
  withLibraryLock,
  readLibraryItems,
  writeLibraryItems,
  jsonError,
} from '@/lib/library-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RawItem = {
  id: string;
  entries?: RawEntry[];
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  const guard = productionGuard('Entry editing');
  if (guard) return guard;
  const csrf = sameOriginGuard(req);
  if (csrf) return csrf;

  let body: { id?: unknown; entryIndex?: unknown; patch?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError('invalid JSON body', 400);
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const patch =
    body.patch && typeof body.patch === 'object' ? (body.patch as Record<string, unknown>) : null;

  if (!id || !patch) {
    return jsonError('id and patch are required', 400);
  }

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const validator = VALIDATORS[key];
    if (!validator) {
      return jsonError(`unknown field "${key}"`, 400);
    }
    if (!validator(value)) {
      return jsonError(`invalid value for "${key}"`, 400);
    }
    clean[key] = value;
  }

  try {
    return await withLibraryLock(async () => {
      const items = await readLibraryItems<RawItem>();
      const item = items.find((i) => i.id === id);
      if (!item) {
        return jsonError('item not found', 404);
      }

      const entries = Array.isArray(item.entries) ? item.entries : [];
      if (entries.length === 0) {
        return jsonError('item has no entries to update; add one to library-items.json first', 400);
      }

      let entryIndex: number;
      if (typeof body.entryIndex === 'number' && Number.isInteger(body.entryIndex)) {
        entryIndex = body.entryIndex;
      } else {
        entryIndex = findLatestEntryIndex(entries);
      }
      if (entryIndex < 0 || entryIndex >= entries.length) {
        return jsonError('entryIndex out of range', 400);
      }

      const entry = entries[entryIndex];
      for (const [key, value] of Object.entries(clean)) {
        if (isEmptyDelete(value)) {
          delete entry[key];
        } else {
          entry[key] = value;
        }
      }
      item.entries = entries;

      await writeLibraryItems(items);

      return NextResponse.json({ ok: true, entry, entryIndex });
    });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'could not update entry', 500);
  }
}
