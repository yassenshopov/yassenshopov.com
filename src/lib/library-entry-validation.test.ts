import { describe, it, expect } from 'vitest';
import {
  VALIDATORS,
  isDateString,
  isEmptyDelete,
  findLatestEntryIndex,
  type RawEntry,
} from './library-entry-validation';

describe('isDateString', () => {
  it('accepts YYYY-MM-DD', () => {
    expect(isDateString('2025-01-05')).toBe(true);
  });
  it('rejects malformed dates and non-strings', () => {
    expect(isDateString('2025-1-5')).toBe(false);
    expect(isDateString('Jan 5 2025')).toBe(false);
    expect(isDateString(20250105)).toBe(false);
    expect(isDateString(null)).toBe(false);
  });
});

describe('isEmptyDelete', () => {
  it('treats null and empty string as a delete signal', () => {
    expect(isEmptyDelete(null)).toBe(true);
    expect(isEmptyDelete('')).toBe(true);
  });
  it('does not treat other falsy values as deletes', () => {
    expect(isEmptyDelete(0)).toBe(false);
    expect(isEmptyDelete(undefined)).toBe(false);
  });
});

describe('VALIDATORS', () => {
  it('validates status against the allowed set', () => {
    expect(VALIDATORS.status('completed')).toBe(true);
    expect(VALIDATORS.status('want-to-read')).toBe(false);
    expect(VALIDATORS.status(42)).toBe(false);
  });

  it('validates ratings as integers within 0..5 or a delete', () => {
    expect(VALIDATORS.rating(5)).toBe(true);
    expect(VALIDATORS.rating(0)).toBe(true);
    expect(VALIDATORS.rating('')).toBe(true);
    expect(VALIDATORS.rating(null)).toBe(true);
    expect(VALIDATORS.rating(6)).toBe(false);
    expect(VALIDATORS.rating(3.5)).toBe(false);
    expect(VALIDATORS.rating(-1)).toBe(false);
  });

  it('validates dates or a delete', () => {
    expect(VALIDATORS.dateStarted('2025-01-05')).toBe(true);
    expect(VALIDATORS.dateCompleted('')).toBe(true);
    expect(VALIDATORS.dateStarted('nope')).toBe(false);
  });

  it('validates notes as a string or a delete', () => {
    expect(VALIDATORS.notes('a note')).toBe(true);
    expect(VALIDATORS.notes(null)).toBe(true);
    expect(VALIDATORS.notes(123)).toBe(false);
  });
});

describe('findLatestEntryIndex', () => {
  it('picks the entry with the most recent completion/start date', () => {
    const entries: RawEntry[] = [
      { status: 'completed', dateCompleted: '2022-01-01' },
      { status: 'completed', dateCompleted: '2026-05-01' },
      { status: 'completed', dateStarted: '2024-03-01' },
    ];
    expect(findLatestEntryIndex(entries)).toBe(1);
  });

  it('falls back to index 0 when entries are undated', () => {
    const entries: RawEntry[] = [{ status: 'in-progress' }, { status: 'on-pause' }];
    expect(findLatestEntryIndex(entries)).toBe(0);
  });

  it('uses dateStarted when dateCompleted is absent', () => {
    const entries: RawEntry[] = [
      { status: 'completed', dateStarted: '2020-01-01' },
      { status: 'in-progress', dateStarted: '2027-01-01' },
    ];
    expect(findLatestEntryIndex(entries)).toBe(1);
  });
});
