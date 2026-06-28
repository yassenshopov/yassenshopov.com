import { describe, it, expect } from 'vitest';
import { contactSchema, TOPIC_LABELS } from './contact-schema';

describe('contactSchema', () => {
  it('accepts a minimal valid payload and applies defaults', () => {
    const result = contactSchema.safeParse({
      email: 'a@b.com',
      message: 'Hello there, this is long enough.',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topic).toBe('collab');
      expect(result.data.name).toBe('');
      expect(result.data.company).toBe('');
    }
  });

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({
      email: 'not-an-email',
      message: 'long enough message',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short message', () => {
    const result = contactSchema.safeParse({ email: 'a@b.com', message: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects a message over the max length', () => {
    const result = contactSchema.safeParse({ email: 'a@b.com', message: 'x'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('trims whitespace around fields', () => {
    const result = contactSchema.safeParse({
      email: '  a@b.com  ',
      message: '  a perfectly valid message  ',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('a@b.com');
  });

  it('carries a honeypot field through for the route to inspect', () => {
    const result = contactSchema.safeParse({
      email: 'a@b.com',
      message: 'long enough message here',
      company: 'definitely a bot',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.company).toBe('definitely a bot');
  });
});

describe('TOPIC_LABELS', () => {
  it('maps each known topic to a readable label', () => {
    expect(TOPIC_LABELS.collab).toBeTruthy();
    expect(TOPIC_LABELS.templates).toBeTruthy();
    expect(TOPIC_LABELS.commission).toBeTruthy();
    expect(TOPIC_LABELS.hi).toBeTruthy();
  });
});
