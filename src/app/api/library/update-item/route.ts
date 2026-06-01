/**
 * Dev-only endpoint that patches item-level fields in library-items.json.
 *
 *   POST /api/library/update-item
 *     application/json:
 *       id     – current LibraryItem id
 *       patch  – { id?: string } (only the rename case is supported for now)
 *
 * When renaming an id, all `relationships` references (`prequel`, `sequel`,
 * `related[]`, `sameUniverse[]`, `adaptations[]`, `basedOn[]`) on every other
 * item are rewritten in the same write so the JSON stays self-consistent.
 *
 * Disabled in production. Deleted alongside the cover-upload and
 * update-entry routes when the library data is locked down.
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LIB_PATH = path.join(process.cwd(), 'src', 'data', 'library-items.json');

// Mirrors the keys on LibraryItem.relationships. Keep in sync if that shape grows.
const SCALAR_REL_KEYS = ['prequel', 'sequel'] as const;
const ARRAY_REL_KEYS = ['related', 'sameUniverse', 'adaptations', 'basedOn'] as const;

const ID_PATTERN = /^[a-zA-Z0-9._-]+$/;

type RawRelationships = {
  prequel?: string;
  sequel?: string;
  related?: string[];
  sameUniverse?: string[];
  adaptations?: string[];
  basedOn?: string[];
};

type RawItem = {
  id: string;
  relationships?: RawRelationships;
  [key: string]: unknown;
};

function rewriteRelationshipIds(items: RawItem[], oldId: string, newId: string) {
  for (const item of items) {
    const rel = item.relationships;
    if (!rel) continue;

    for (const key of SCALAR_REL_KEYS) {
      if (rel[key] === oldId) rel[key] = newId;
    }
    for (const key of ARRAY_REL_KEYS) {
      const list = rel[key];
      if (!Array.isArray(list)) continue;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === oldId) list[i] = newId;
      }
    }
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Item editing is disabled in production' },
      { status: 403 },
    );
  }

  let body: { id?: unknown; patch?: unknown };
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

  // Only `id` is supported today. Reject anything else explicitly so silent
  // typos don't get swallowed.
  const knownKeys = new Set(['id']);
  for (const key of Object.keys(patch)) {
    if (!knownKeys.has(key)) {
      return NextResponse.json({ error: `unsupported field "${key}"` }, { status: 400 });
    }
  }

  const newId = typeof patch.id === 'string' ? patch.id.trim() : undefined;
  if (newId === undefined) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
  }
  if (newId === '') {
    return NextResponse.json({ error: 'id cannot be empty' }, { status: 400 });
  }
  if (!ID_PATTERN.test(newId)) {
    return NextResponse.json(
      { error: 'id can only contain letters, digits, dot, underscore, and hyphen' },
      { status: 400 },
    );
  }

  const raw = await fs.readFile(LIB_PATH, 'utf-8');
  const items = JSON.parse(raw) as RawItem[];
  const item = items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: 'item not found' }, { status: 404 });
  }

  if (newId === id) {
    return NextResponse.json({ ok: true, id, unchanged: true });
  }

  if (items.some((i) => i.id === newId)) {
    return NextResponse.json(
      { error: `another item already uses id "${newId}"` },
      { status: 409 },
    );
  }

  item.id = newId;
  rewriteRelationshipIds(items, id, newId);

  await fs.writeFile(LIB_PATH, JSON.stringify(items, null, 2) + '\n');

  return NextResponse.json({ ok: true, id: newId });
}
