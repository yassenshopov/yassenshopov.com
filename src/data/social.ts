// Single source of truth for contact + social links so they never drift across
// the footer, contact page, and structured data (schema.org `sameAs`).

export const CONTACT_EMAIL = 'yassenshopov00@gmail.com';

export const social = {
  github: 'https://github.com/yassenshopov',
  linkedin: 'https://www.linkedin.com/in/yassenshopov',
  x: 'https://x.com/yassenshopov',
  instagram: 'https://www.instagram.com/kofiscrib/',
  gumroad: 'https://yassenshopov.gumroad.com',
} as const;

// Profiles to expose as schema.org `sameAs` on the Person entity.
export const sameAsProfiles: string[] = [social.github, social.linkedin, social.x, social.gumroad];
