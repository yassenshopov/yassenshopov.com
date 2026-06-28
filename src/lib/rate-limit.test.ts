import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, clientIpFrom } from './rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit, then blocks', () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 3, 1000).success).toBe(true);
    expect(rateLimit(key, 3, 1000).success).toBe(true);
    expect(rateLimit(key, 3, 1000).success).toBe(true);

    const blocked = rateLimit(key, 3, 1000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('reports decreasing remaining counts', () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 5, 1000).remaining).toBe(4);
    expect(rateLimit(key, 5, 1000).remaining).toBe(3);
    expect(rateLimit(key, 5, 1000).remaining).toBe(2);
  });

  it('resets after the window elapses', () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 1000);
    expect(rateLimit(key, 1, 1000).success).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(rateLimit(key, 1, 1000).success).toBe(true);
  });

  it('surfaces a retry-after when blocked', () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 10_000);
    const blocked = rateLimit(key, 1, 10_000);
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(10);
  });

  it('tracks keys independently', () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, 1, 1000);
    expect(rateLimit(a, 1, 1000).success).toBe(false);
    expect(rateLimit(b, 1, 1000).success).toBe(true);
  });
});

describe('clientIpFrom', () => {
  it('takes the first hop from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' });
    expect(clientIpFrom(headers)).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.7' });
    expect(clientIpFrom(headers)).toBe('198.51.100.7');
  });

  it('returns "unknown" when no proxy headers are present', () => {
    expect(clientIpFrom(new Headers())).toBe('unknown');
  });
});
