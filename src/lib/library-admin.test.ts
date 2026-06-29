import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { sameOriginGuard, withLibraryLock } from './library-admin';

function requestWith(headers: Record<string, string>) {
  return new NextRequest('http://localhost/api/library/update-item', {
    method: 'POST',
    headers,
  });
}

describe('sameOriginGuard', () => {
  it('allows requests with no Origin header (curl, server-to-server)', () => {
    expect(sameOriginGuard(requestWith({ host: 'localhost' }))).toBeNull();
  });

  it('allows a same-origin browser request', () => {
    const guard = sameOriginGuard(requestWith({ host: 'localhost', origin: 'http://localhost' }));
    expect(guard).toBeNull();
  });

  it('rejects a cross-origin browser request with 403', () => {
    const guard = sameOriginGuard(
      requestWith({ host: 'localhost', origin: 'https://evil.example.com' })
    );
    expect(guard).not.toBeNull();
    expect(guard?.status).toBe(403);
  });

  it('rejects a malformed Origin with 403', () => {
    const guard = sameOriginGuard(requestWith({ host: 'localhost', origin: 'not a url' }));
    expect(guard).not.toBeNull();
    expect(guard?.status).toBe(403);
  });
});

describe('withLibraryLock', () => {
  it('serializes overlapping read-modify-write cycles (no lost updates)', async () => {
    let shared = 0;
    let maxConcurrent = 0;
    let active = 0;

    // Each task reads `shared`, yields, then writes read + 1 — a classic
    // read-modify-write that loses updates if the two interleave.
    const task = () =>
      withLibraryLock(async () => {
        active += 1;
        maxConcurrent = Math.max(maxConcurrent, active);
        const read = shared;
        await new Promise((r) => setTimeout(r, 5));
        shared = read + 1;
        active -= 1;
      });

    await Promise.all([task(), task(), task(), task(), task()]);

    expect(shared).toBe(5);
    expect(maxConcurrent).toBe(1);
  });

  it('keeps the lock chain alive after a task throws', async () => {
    await expect(
      withLibraryLock(async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    // A subsequent task must still run.
    const result = await withLibraryLock(async () => 'ok');
    expect(result).toBe('ok');
  });
});
