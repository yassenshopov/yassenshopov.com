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
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TIERS_PATH = path.join(process.cwd(), 'src', 'data', 'library-tiers.json');

const BOARD_IDS = new Set(['fiction', 'nonfiction', 'movies', 'series', 'anime-manga']);
const TIER_KEYS = new Set(['s', 'a', 'b', 'c', 'd', 'unranked']);

type BoardTiers = Record<string, string[]>;
type TierData = Record<string, BoardTiers>;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Tier editing is disabled in production' }, { status: 403 });
  }

  let body: { boardId?: string; tiers?: BoardTiers };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const boardId = String(body.boardId ?? '');
  const tiers = body.tiers;

  if (!BOARD_IDS.has(boardId)) {
    return NextResponse.json({ error: 'unknown boardId' }, { status: 400 });
  }
  if (!tiers || typeof tiers !== 'object') {
    return NextResponse.json({ error: 'tiers object is required' }, { status: 400 });
  }

  // Sanitize: keep only known tier keys with string-array values.
  const clean: BoardTiers = {};
  for (const [key, value] of Object.entries(tiers)) {
    if (!TIER_KEYS.has(key) || !Array.isArray(value)) continue;
    clean[key] = value.map((v) => String(v));
  }

  let data: TierData;
  try {
    const raw = await fs.readFile(TIERS_PATH, 'utf-8');
    data = JSON.parse(raw) as TierData;
  } catch {
    data = {};
  }

  data[boardId] = clean;
  await fs.writeFile(TIERS_PATH, JSON.stringify(data, null, 2) + '\n');

  return NextResponse.json({ ok: true });
}
