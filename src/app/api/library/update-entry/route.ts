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
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LIB_PATH = path.join(process.cwd(), 'src', 'data', 'library-items.json');

const READING_STATUSES = new Set(['completed', 'in-progress', 'on-pause', 'dnf']);

type RawEntry = {
  status?: string;
  dateStarted?: string;
  dateCompleted?: string;
  rating?: number | null;
  notes?: string;
  [key: string]: unknown;
};

type RawItem = {
  id: string;
  entries?: RawEntry[];
  [key: string]: unknown;
};

function isDateString(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function isEmptyDelete(v: unknown): boolean {
  return v === null || v === '';
}

const VALIDATORS: Record<string, (v: unknown) => boolean> = {
  status: (v) => typeof v === 'string' && READING_STATUSES.has(v),
  dateStarted: (v) => isEmptyDelete(v) || isDateString(v),
  dateCompleted: (v) => isEmptyDelete(v) || isDateString(v),
  rating: (v) =>
    isEmptyDelete(v) ||
    (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 5),
  notes: (v) => isEmptyDelete(v) || typeof v === 'string',
};

function entryTimestamp(entry: RawEntry): number {
  const d = entry.dateCompleted || entry.dateStarted;
  return d ? new Date(d).getTime() : 0;
}

function findLatestEntryIndex(entries: RawEntry[]): number {
  let bestIdx = 0;
  let bestTs = entryTimestamp(entries[0]);
  for (let i = 1; i < entries.length; i++) {
    const ts = entryTimestamp(entries[i]);
    if (ts > bestTs) {
      bestTs = ts;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Entry editing is disabled in production' },
      { status: 403 },
    );
  }

  let body: { id?: unknown; entryIndex?: unknown; patch?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const patch =
    body.patch && typeof body.patch === 'object' ? (body.patch as Record<string, unknown>) : null;

  if (!id || !patch) {
    return NextResponse.json({ error: 'id and patch are required' }, { status: 400 });
  }

  // Validate every field up front so we never partially mutate the file.
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const validator = VALIDATORS[key];
    if (!validator) {
      return NextResponse.json({ error: `unknown field "${key}"` }, { status: 400 });
    }
    if (!validator(value)) {
      return NextResponse.json({ error: `invalid value for "${key}"` }, { status: 400 });
    }
    clean[key] = value;
  }

  const raw = await fs.readFile(LIB_PATH, 'utf-8');
  const items = JSON.parse(raw) as RawItem[];
  const item = items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: 'item not found' }, { status: 404 });
  }

  const entries = Array.isArray(item.entries) ? item.entries : [];
  if (entries.length === 0) {
    return NextResponse.json(
      { error: 'item has no entries to update; add one to library-items.json first' },
      { status: 400 },
    );
  }

  let entryIndex: number;
  if (typeof body.entryIndex === 'number' && Number.isInteger(body.entryIndex)) {
    entryIndex = body.entryIndex;
  } else {
    entryIndex = findLatestEntryIndex(entries);
  }
  if (entryIndex < 0 || entryIndex >= entries.length) {
    return NextResponse.json({ error: 'entryIndex out of range' }, { status: 400 });
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

  await fs.writeFile(LIB_PATH, JSON.stringify(items, null, 2) + '\n');

  return NextResponse.json({ ok: true, entry, entryIndex });
}
