import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIpFrom, rateLimit } from '@/lib/rate-limit';

// Numeric ID of the "Life Engineering" Kit form (the hex uid 7b89eac8f8 is
// only for embeds — the API needs this numeric one).
const KIT_FORM_ID = '7879940';
const KIT_API_BASE = 'https://api.kit.com/v4';

// Cap submissions per IP so the endpoint can't be used to spam Kit.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const subscribeSchema = z.object({
  email: z.string().trim().email('A valid email is required.'),
  // Honeypot — real users never fill this in.
  website: z.string().optional().default(''),
});

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);
  const limit = rateLimit(`subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again in a little while.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? 'A valid email is required.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const { email, website } = parsed.data;

  // Silently accept honeypot hits so bots think they succeeded.
  if (website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Newsletter signup is not configured yet. Please try again later.' },
      { status: 503 }
    );
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': apiKey,
  };

  try {
    // 1) Upsert the subscriber as `inactive` so adding them to the form below
    //    triggers Kit's double opt-in confirmation email.
    const createRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email, state: 'inactive' }),
    });

    if (!createRes.ok) {
      return NextResponse.json(
        { error: 'Could not subscribe right now. Please try again later.' },
        { status: 502 }
      );
    }

    // 2) Add them to the form — this is what actually subscribes them and
    //    sends the confirmation email. Idempotent for existing subscribers.
    const formRes = await fetch(`${KIT_API_BASE}/forms/${KIT_FORM_ID}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email }),
    });

    if (!formRes.ok) {
      return NextResponse.json(
        { error: 'Could not subscribe right now. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
