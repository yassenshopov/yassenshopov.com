/**
 * Shared helpers for the dev-only library API routes. Each route
 * (update-item, update-entry, upload-cover, tier) previously duplicated
 * the production guard, the JSON path constant, and the read-parse-mutate-
 * write cycle. This module centralizes those concerns.
 */
import { NextResponse } from 'next/server';
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

export async function readLibraryItems<T = Record<string, unknown>>(): Promise<T[]> {
  const raw = await fs.readFile(LIB_PATH, 'utf-8');
  return JSON.parse(raw) as T[];
}

export async function writeLibraryItems<T>(items: T[]): Promise<void> {
  await fs.writeFile(LIB_PATH, JSON.stringify(items, null, 2) + '\n');
}

export async function readTierData<T = Record<string, unknown>>(): Promise<T> {
  try {
    const raw = await fs.readFile(TIERS_PATH, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

export async function writeTierData<T>(data: T): Promise<void> {
  await fs.writeFile(TIERS_PATH, JSON.stringify(data, null, 2) + '\n');
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
