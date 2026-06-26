import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { CONTACT_EMAIL } from '@/data/social';

// Topic labels mirror the pills on the contact form so the subject line is
// readable in the inbox.
const TOPIC_LABELS: Record<string, string> = {
  collab: 'Collab / project',
  templates: 'Notion templates',
  commission: 'Art commission',
  hi: 'Just saying hi',
};

const contactSchema = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email('A valid email is required.'),
  message: z.string().trim().min(10, 'Message is too short.').max(5000),
  topic: z.string().trim().optional().default('collab'),
  // Honeypot — real users never fill this in. Hidden field in the form.
  company: z.string().optional().default(''),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? 'Please check the form and try again.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const { name, email, message, topic, company } = parsed.data;

  // Silently accept honeypot hits so bots think they succeeded.
  if (company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Email is not configured yet. Please email me directly for now.' },
      { status: 503 }
    );
  }

  const topicLabel = TOPIC_LABELS[topic] ?? 'Project inquiry';
  const fromName = name || email;
  // `from` must be a verified Resend sender/domain in production. The default
  // (`onboarding@resend.dev`) works out of the box but can only deliver to the
  // Resend account owner's address — fine here since `to` is my own inbox.
  const from = process.env.CONTACT_FROM_EMAIL || 'Yassen Shopov <onboarding@resend.dev>';

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Site] ${topicLabel} — ${fromName}`,
      text: [
        `New message from yassenshopov.com`,
        ``,
        `Topic: ${topicLabel}`,
        `Name: ${name || '(not provided)'}`,
        `Reply to: ${email}`,
        ``,
        message,
      ].join('\n'),
    });

    if (error) {
      return NextResponse.json(
        { error: 'Could not send your message. Please email me directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong sending your message. Please email me directly.' },
      { status: 500 }
    );
  }
}
