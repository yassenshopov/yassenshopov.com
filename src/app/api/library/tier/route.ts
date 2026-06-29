/**
 * Dev-only endpoint that persists the full ordered tier layout for one board.
 *
 *   POST /api/library/tier
 *     application/json:
 *       boardId – 'fiction' | 'nonfiction' | 'movies' | 'series' | 'anime-manga'
 *       tiers   – { [tierId]: string[] }  ordered item ids per row (incl. 'unranked')
 *
 * Persists to src/data/library-tiers.json. Disabled in production — intended
 * to be removed (with the drag-and-drop UI) once the tiers are locked down.
 */
import { type NextRequest, NextResponse } from 'next/server';
import {
  productionGuard,
  sameOriginGuard,
  withLibraryLock,
  readTierData,
  writeTierData,
  jsonError,
} from '@/lib/library-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BOARD_IDS = new Set(['fiction', 'nonfiction', 'movies', 'series', 'anime-manga']);
const TIER_KEYS = new Set(['s', 'a', 'b', 'c', 'd', 'unranked']);

type BoardTiers = Record<string, string[]>;
type TierData = Record<string, BoardTiers>;

export async function POST(req: NextRequest) {
  const guard = productionGuard('Tier editing');
  if (guard) return guard;
  const csrf = sameOriginGuard(req);
  if (csrf) return csrf;

  let body: { boardId?: string; tiers?: BoardTiers };
  try {
    body = await req.json();
  } catch {
    return jsonError('invalid JSON body', 400);
  }

  const boardId = String(body.boardId ?? '');
  const tiers = body.tiers;

  if (!BOARD_IDS.has(boardId)) {
    return jsonError('unknown boardId', 400);
  }
  if (!tiers || typeof tiers !== 'object') {
    return jsonError('tiers object is required', 400);
  }

  const clean: BoardTiers = {};
  for (const [key, value] of Object.entries(tiers)) {
    if (!TIER_KEYS.has(key) || !Array.isArray(value)) continue;
    clean[key] = value.map((v) => String(v));
  }

  try {
    return await withLibraryLock(async () => {
      const data = await readTierData<TierData>();
      data[boardId] = clean;
      await writeTierData(data);
      return NextResponse.json({ ok: true });
    });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'could not save tiers', 500);
  }
}
