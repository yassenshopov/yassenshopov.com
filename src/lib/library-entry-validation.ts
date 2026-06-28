/**
 * Pure validation/selection helpers for the dev-only library entry editor
 * (see src/app/api/library/update-entry/route.ts). Kept separate from the
 * route so they can be unit-tested without spinning up the handler.
 */

export type RawEntry = {
  status?: string;
  dateStarted?: string;
  dateCompleted?: string;
  rating?: number | null;
  notes?: string;
  [key: string]: unknown;
};

export const READING_STATUSES = new Set(['completed', 'in-progress', 'on-pause', 'dnf']);

export function isDateString(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

/** Empty string or null is treated as "delete this field". */
export function isEmptyDelete(v: unknown): boolean {
  return v === null || v === '';
}

export const VALIDATORS: Record<string, (v: unknown) => boolean> = {
  status: (v) => typeof v === 'string' && READING_STATUSES.has(v),
  dateStarted: (v) => isEmptyDelete(v) || isDateString(v),
  dateCompleted: (v) => isEmptyDelete(v) || isDateString(v),
  rating: (v) =>
    isEmptyDelete(v) || (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 5),
  notes: (v) => isEmptyDelete(v) || typeof v === 'string',
};

export function entryTimestamp(entry: RawEntry): number {
  const d = entry.dateCompleted || entry.dateStarted;
  return d ? new Date(d).getTime() : 0;
}

export function findLatestEntryIndex(entries: RawEntry[]): number {
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
