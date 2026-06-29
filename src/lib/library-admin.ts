/**
 * Shared helpers for the dev-only library API routes. Each route
 * (update-item, update-entry, upload-cover, tier) previously duplicated
 * the production guard, the JSON path constant, and the read-parse-mutate-
 * write cycle. This module centralizes those concerns.
 */
import { type NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const LIB_PATH = path.join(process.cwd(), 'src', 'data', 'library-items.json');
export const TIERS_PATH = path.join(process.cwd(), 'src', 'data', 'library-tiers.json');

export function productionGuard(label: string) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: `${label} is disabled in production` }, { status: 403 });
  }
  return null;
}

/**
 * Reject browser-driven cross-site writes (CSRF). These routes are dev-only,
 * but a malicious page can still `fetch`/form-POST to a dev server bound to the
 * network. A cross-site browser POST always carries an `Origin` header, so we
 * reject when it's present and doesn't match the request host. Requests with no
 * Origin (curl, same-origin server calls) are allowed through.
 */
export function sameOriginGuard(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin) return null;
  const host = req.headers.get('host');
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: 'cross-origin request rejected' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
  }
  return null;
}

/**
 * Serialize read-modify-write cycles within this process. Without it, two
 * concurrent admin requests can interleave (the `await` between read and write
 * yields the event loop), so the second write clobbers the first — a classic
 * lost update. A single shared chain across both JSON files is plenty for a
 * dev-only, low-volume editor.
 */
let lockChain: Promise<unknown> = Promise.resolve();
export function withLibraryLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = lockChain.then(fn, fn);
  // Keep the chain alive regardless of how the previous task settled.
  lockChain = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

/**
 * Write via a temp file + atomic rename so a crash mid-write can never leave a
 * truncated, half-written JSON file behind.
 */
async function atomicWriteFile(filePath: string, contents: string): Promise<void> {
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, contents);
  try {
    await fs.rename(tmp, filePath);
  } catch (err) {
    await fs.rm(tmp, { force: true });
    throw err;
  }
}

function parseJson<T>(raw: string, label: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${label} is not valid JSON; fix it by hand before editing.`);
  }
}

export async function readLibraryItems<T = Record<string, unknown>>(): Promise<T[]> {
  const raw = await fs.readFile(LIB_PATH, 'utf-8');
  const parsed = parseJson<unknown>(raw, 'library-items.json');
  if (!Array.isArray(parsed)) {
    throw new Error('library-items.json must be a JSON array.');
  }
  return parsed as T[];
}

export async function writeLibraryItems<T>(items: T[]): Promise<void> {
  await atomicWriteFile(LIB_PATH, JSON.stringify(items, null, 2) + '\n');
}

export async function readTierData<T = Record<string, unknown>>(): Promise<T> {
  let raw: string;
  try {
    raw = await fs.readFile(TIERS_PATH, 'utf-8');
  } catch {
    return {} as T;
  }
  return parseJson<T>(raw, 'library-tiers.json');
}

export async function writeTierData<T>(data: T): Promise<void> {
  await atomicWriteFile(TIERS_PATH, JSON.stringify(data, null, 2) + '\n');
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
