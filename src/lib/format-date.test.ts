import { describe, it, expect } from 'vitest';
import { formatDate, toRFC822 } from './format-date';

describe('formatDate', () => {
  it('formats an ISO date string as a long US date', () => {
    expect(formatDate('2025-01-05')).toBe('January 5, 2025');
  });

  it('accepts a Date instance', () => {
    expect(formatDate(new Date('2024-12-25T00:00:00Z'))).toMatch(/December 2[45], 2024/);
  });
});

describe('toRFC822', () => {
  it('produces an RFC-822 / UTC string', () => {
    const out = toRFC822('2025-01-05T12:00:00Z');
    expect(out).toBe('Sun, 05 Jan 2025 12:00:00 GMT');
  });

  it('is stable for Date and string inputs', () => {
    const iso = '2023-06-15T08:30:00Z';
    expect(toRFC822(iso)).toBe(toRFC822(new Date(iso)));
  });
});
