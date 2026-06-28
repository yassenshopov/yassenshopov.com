/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Deliberately dependency-free: for a low-traffic personal site this throttles
 * abuse/cost (e.g. someone hammering the contact form to burn Resend quota)
 * without standing up Redis. Note the limitation — state lives in a single
 * server instance's memory, so it resets on cold starts and isn't shared across
 * concurrent serverless instances. For stronger guarantees swap the `Map` for
 * Upstash Ratelimit behind the same interface.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Bound memory: once the map grows past this, drop every expired bucket.
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  success: boolean;
  /** Requests remaining in the current window. */
  remaining: number;
  /** Epoch ms when the current window resets. */
  resetAt: number;
  /** Seconds until reset — convenient for a `Retry-After` header. */
  retryAfterSeconds: number;
}

function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Record a hit for `key` and report whether it's within `limit` per `windowMs`.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) sweepExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(0, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfterSeconds,
  };
}

/**
 * Best-effort client IP from proxy headers. Vercel/most proxies set
 * `x-forwarded-for`; we take the first (client) hop. Falls back to a constant
 * so missing headers degrade to a shared bucket rather than throwing.
 */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
