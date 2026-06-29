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
import { type NextRequest, NextResponse } from 'next/server';
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
  const guard = productionGuard('Item editing');
  if (guard) return guard;
  const csrf = sameOriginGuard(req);
  if (csrf) return csrf;

  let body: { id?: unknown; patch?: unknown };
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

  const knownKeys = new Set(['id']);
  for (const key of Object.keys(patch)) {
    if (!knownKeys.has(key)) {
      return jsonError(`unsupported field "${key}"`, 400);
    }
  }

  const newId = typeof patch.id === 'string' ? patch.id.trim() : undefined;
  if (newId === undefined) {
    return jsonError('nothing to update', 400);
  }
  if (newId === '') {
    return jsonError('id cannot be empty', 400);
  }
  if (!ID_PATTERN.test(newId)) {
    return jsonError('id can only contain letters, digits, dot, underscore, and hyphen', 400);
  }

  try {
    return await withLibraryLock(async () => {
      const items = await readLibraryItems<RawItem>();
      const item = items.find((i) => i.id === id);
      if (!item) {
        return jsonError('item not found', 404);
      }

      if (newId === id) {
        return NextResponse.json({ ok: true, id, unchanged: true });
      }

      if (items.some((i) => i.id === newId)) {
        return jsonError(`another item already uses id "${newId}"`, 409);
      }

      item.id = newId;
      rewriteRelationshipIds(items, id, newId);

      await writeLibraryItems(items);

      return NextResponse.json({ ok: true, id: newId });
    });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'could not update item', 500);
  }
}
