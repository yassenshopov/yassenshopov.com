import { z } from 'zod';

/** Human-readable subject labels for each contact topic. */
export const TOPIC_LABELS = {
  collab: 'Collab / project',
  templates: 'Notion templates',
  commission: 'Art commission',
  hi: 'Just saying hi',
} as const;

export type ContactTopic = keyof typeof TOPIC_LABELS;

/** The allowed `topic` values, derived from `TOPIC_LABELS` so they stay in sync. */
export const CONTACT_TOPICS = Object.keys(TOPIC_LABELS) as [ContactTopic, ...ContactTopic[]];

/**
 * Validation for the contact form payload. `company` is a honeypot field —
 * real users never fill it in, so a non-empty value signals a bot. `topic` is
 * constrained to the known labels (with a `collab` default) so unexpected
 * values are rejected outright rather than silently relabeled downstream.
 */
export const contactSchema = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email('A valid email is required.'),
  message: z.string().trim().min(10, 'Message is too short.').max(5000),
  topic: z.enum(CONTACT_TOPICS).optional().default('collab'),
  company: z.string().optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
