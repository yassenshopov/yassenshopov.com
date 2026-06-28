import { z } from 'zod';

/** Human-readable subject labels for each contact topic. */
export const TOPIC_LABELS: Record<string, string> = {
  collab: 'Collab / project',
  templates: 'Notion templates',
  commission: 'Art commission',
  hi: 'Just saying hi',
};

/**
 * Validation for the contact form payload. `company` is a honeypot field —
 * real users never fill it in, so a non-empty value signals a bot.
 */
export const contactSchema = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email('A valid email is required.'),
  message: z.string().trim().min(10, 'Message is too short.').max(5000),
  topic: z.string().trim().optional().default('collab'),
  company: z.string().optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
