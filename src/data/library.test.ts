import { describe, it, expect } from 'vitest';
import {
  entryTimestamp,
  getLatestEntry,
  latestEntryTimestamp,
  type LibraryEntry,
  type LibraryItem,
} from './library';

function entry(overrides: Partial<LibraryEntry>): LibraryEntry {
  return { status: 'completed', ...overrides };
}

function item(overrides: Partial<LibraryItem> & { id: string }): LibraryItem {
  return {
    title: `Title ${overrides.id}`,
    type: 'book',
    rating: null,
    status: 'completed',
    genre: [],
    description: '',
    ...overrides,
  };
}

describe('entryTimestamp', () => {
  it('prefers the completion date over the start date', () => {
    const ts = entryTimestamp(entry({ dateStarted: '2020-01-01', dateCompleted: '2021-06-15' }));
    expect(ts).toBe(new Date('2021-06-15').getTime());
  });

  it('falls back to the start date when no completion date', () => {
    const ts = entryTimestamp(entry({ dateStarted: '2022-03-03' }));
    expect(ts).toBe(new Date('2022-03-03').getTime());
  });

  it('returns 0 for an undated entry', () => {
    expect(entryTimestamp(entry({}))).toBe(0);
  });
});

describe('getLatestEntry', () => {
  it('returns the most recent entry by completion date', () => {
    const older = entry({ dateCompleted: '2021-01-01' });
    const newer = entry({ dateCompleted: '2024-01-01' });
    expect(getLatestEntry([older, newer])).toBe(newer);
    expect(getLatestEntry([newer, older])).toBe(newer);
  });

  it('returns undefined for an empty list', () => {
    expect(getLatestEntry([])).toBeUndefined();
  });

  it('does not mutate the input order', () => {
    const a = entry({ dateCompleted: '2021-01-01' });
    const b = entry({ dateCompleted: '2024-01-01' });
    const input = [a, b];
    getLatestEntry(input);
    expect(input).toEqual([a, b]);
  });
});

describe('latestEntryTimestamp', () => {
  it('uses the latest entry across multiple engagements (re-reads sort newest)', () => {
    const reread = item({
      id: 'reread',
      entries: [entry({ dateCompleted: '2022-01-01' }), entry({ dateCompleted: '2026-01-01' })],
    });
    expect(latestEntryTimestamp(reread)).toBe(new Date('2026-01-01').getTime());
  });

  it('returns 0 for wishlist items with no entries', () => {
    expect(latestEntryTimestamp(item({ id: 'wish', status: 'want-to-read' }))).toBe(0);
  });
});
