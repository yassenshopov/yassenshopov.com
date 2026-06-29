// Static project data + pure tech-badge helpers. No hooks or components, so
// this module is safe to import from both Server and Client Components (the
// homepage and work-with-me page read `projects` on the server).
import {
  Palette,
  Sparkles,
  Users,
  Code,
  FileText,
  Mail,
  MapPin,
  Wrench,
  Globe2,
  Pill,
  Layers,
  Activity,
  Swords,
  Map,
} from 'lucide-react';
import { type IconType } from 'react-icons';
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiSupabase,
  SiClerk,
  SiNuxt,
  SiVuedotjs,
  SiNotion,
  SiTypescript,
  SiZod,
  SiGraphql,
} from 'react-icons/si';

type TechBadgeStyle = {
  bg: string;
  text: string;
  border: string;
  hover: string;
};

export type TechBadgeMeta = {
  label: string;
  /**
   * Simple Icons logo component (matches the homepage marquee). Preferred over
   * `iconSrc` so badges stay visually consistent with the landing-page stack.
   */
  icon?: IconType;
  /** Fallback raster/SVG logo for tech without a Simple Icons mark (e.g. PokeAPI). */
  iconSrc?: string;
  style: TechBadgeStyle;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
};

const defaultTechBadgeStyle: TechBadgeStyle = {
  bg: 'bg-primary/15 dark:bg-primary/10',
  text: 'text-primary',
  border: 'border-primary/40 dark:border-primary/30',
  hover: 'hover:bg-primary/25 dark:hover:bg-primary/20',
};

export const techStack: Record<string, TechBadgeMeta> = {
  Nuxt3: {
    label: 'Nuxt3',
    icon: SiNuxt,
    style: {
      bg: 'bg-[#00dc82]/15 dark:bg-[#00dc82]/10',
      text: 'text-[#0a7a53] dark:text-[#00dc82]',
      border: 'border-[#00dc82]/40 dark:border-[#00dc82]/30',
      hover: 'hover:bg-[#00dc82]/25 dark:hover:bg-[#00dc82]/20',
    },
    description: 'Vue framework for building full-stack web apps.',
    linkHref: 'https://nuxt.com/',
    linkLabel: 'Learn more',
  },
  Vue: {
    label: 'Vue',
    icon: SiVuedotjs,
    style: {
      bg: 'bg-[#42b883]/15 dark:bg-[#42b883]/10',
      text: 'text-[#2f8f66] dark:text-[#42b883]',
      border: 'border-[#42b883]/40 dark:border-[#42b883]/30',
      hover: 'hover:bg-[#42b883]/25 dark:hover:bg-[#42b883]/20',
    },
    description: 'Progressive JavaScript framework for building UIs.',
    linkHref: 'https://vuejs.org/',
    linkLabel: 'Learn more',
  },
  'Next.js': {
    label: 'Next.js',
    icon: SiNextdotjs,
    style: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-neutral-800',
      hover: 'hover:bg-neutral-800',
    },
    description: 'React framework for production-grade applications.',
    linkHref: 'https://nextjs.org/',
    linkLabel: 'Learn more',
  },
  React: {
    label: 'React',
    icon: SiReact,
    style: {
      bg: 'bg-[#61dafb]/15 dark:bg-[#61dafb]/10',
      text: 'text-[#0f7ba8] dark:text-[#61dafb]',
      border: 'border-[#61dafb]/40 dark:border-[#61dafb]/30',
      hover: 'hover:bg-[#61dafb]/25 dark:hover:bg-[#61dafb]/20',
    },
    description: 'UI library for building component-driven interfaces.',
    linkHref: 'https://react.dev/',
    linkLabel: 'Learn more',
  },
  TailwindCSS: {
    label: 'TailwindCSS',
    icon: SiTailwindcss,
    style: {
      bg: 'bg-[#38bdf8]/15 dark:bg-[#38bdf8]/10',
      text: 'text-[#0284c7] dark:text-[#38bdf8]',
      border: 'border-[#38bdf8]/40 dark:border-[#38bdf8]/30',
      hover: 'hover:bg-[#38bdf8]/25 dark:hover:bg-[#38bdf8]/20',
    },
    description: 'Utility-first CSS framework for rapid UI styling.',
    linkHref: 'https://tailwindcss.com/',
    linkLabel: 'Learn more',
  },
  Supabase: {
    label: 'Supabase',
    icon: SiSupabase,
    style: {
      bg: 'bg-[#3ecf8e]/15 dark:bg-[#3ecf8e]/10',
      text: 'text-[#198f63] dark:text-[#3ecf8e]',
      border: 'border-[#3ecf8e]/40 dark:border-[#3ecf8e]/30',
      hover: 'hover:bg-[#3ecf8e]/25 dark:hover:bg-[#3ecf8e]/20',
    },
    description: 'Open-source backend with auth, database, and storage.',
    linkHref: 'https://supabase.com/',
    linkLabel: 'Learn more',
  },
  'Pokemon API': {
    label: 'PokeAPI',
    iconSrc: '/resources/images/tech/pokeapi.png',
    style: {
      bg: 'bg-[#facc15]/20 dark:bg-[#facc15]/15',
      text: 'text-[#a16207] dark:text-[#facc15]',
      border: 'border-[#facc15]/40',
      hover: 'hover:bg-[#facc15]/30 dark:hover:bg-[#facc15]/25',
    },
    description: 'Community Pokemon REST API for data and sprites.',
    linkHref: 'https://pokeapi.co/',
    linkLabel: 'Learn more',
  },
  'Notion API': {
    label: 'Notion API',
    icon: SiNotion,
    style: {
      bg: 'bg-[#000000]/10',
      text: 'text-[#000000] dark:text-white',
      border: 'border-[#000000]/30 dark:border-white/30',
      hover: 'hover:bg-[#000000]/20 dark:hover:bg-white/20',
    },
    description: 'Official API for reading and writing Notion data.',
    linkHref: 'https://developers.notion.com/',
    linkLabel: 'Learn more',
  },
  Clerk: {
    label: 'Clerk',
    icon: SiClerk,
    style: {
      bg: 'bg-[#6c47ff]/15 dark:bg-[#6c47ff]/10',
      text: 'text-[#4b2ed1] dark:text-[#6c47ff]',
      border: 'border-[#6c47ff]/40 dark:border-[#6c47ff]/30',
      hover: 'hover:bg-[#6c47ff]/25 dark:hover:bg-[#6c47ff]/20',
    },
    description: 'Authentication and user management platform.',
    linkHref: 'https://clerk.com/',
    linkLabel: 'Learn more',
  },
  TypeScript: {
    label: 'TypeScript',
    icon: SiTypescript,
    style: {
      bg: 'bg-[#3178c6]/15 dark:bg-[#3178c6]/10',
      text: 'text-[#235a97] dark:text-[#3178c6]',
      border: 'border-[#3178c6]/40 dark:border-[#3178c6]/30',
      hover: 'hover:bg-[#3178c6]/25 dark:hover:bg-[#3178c6]/20',
    },
    description: 'Typed superset of JavaScript for safer code.',
    linkHref: 'https://www.typescriptlang.org/',
    linkLabel: 'Learn more',
  },
  Zod: {
    label: 'Zod',
    icon: SiZod,
    style: {
      bg: 'bg-[#3068b7]/15 dark:bg-[#3068b7]/10',
      text: 'text-[#274f8c] dark:text-[#5b8de0]',
      border: 'border-[#3068b7]/40 dark:border-[#3068b7]/30',
      hover: 'hover:bg-[#3068b7]/25 dark:hover:bg-[#3068b7]/20',
    },
    description: 'TypeScript-first schema validation with static type inference.',
    linkHref: 'https://zod.dev/',
    linkLabel: 'Learn more',
  },
  GraphQL: {
    label: 'GraphQL',
    icon: SiGraphql,
    style: {
      bg: 'bg-[#e10098]/15 dark:bg-[#e10098]/10',
      text: 'text-[#b30078] dark:text-[#e10098]',
      border: 'border-[#e10098]/40 dark:border-[#e10098]/30',
      hover: 'hover:bg-[#e10098]/25 dark:hover:bg-[#e10098]/20',
    },
    description: 'Query language for APIs with a typed, field-selected schema.',
    linkHref: 'https://graphql.org/',
    linkLabel: 'Learn more',
  },
};

export const getTechBadgeMeta = (tag: string): TechBadgeMeta => {
  return techStack[tag] ?? { label: tag, style: defaultTechBadgeStyle };
};

// Solid, white-text-legible brand color per technology. Used to render clean
// single-color pills instead of the busier tinted/bordered badges.
const techSolidColors: Record<string, string> = {
  Nuxt3: '#0a7a53',
  Vue: '#34495e',
  'Next.js': '#000000',
  React: '#087ea4',
  TailwindCSS: '#0284c7',
  Supabase: '#198f63',
  'Pokemon API': '#cc0000',
  'Notion API': '#37352f',
  Clerk: '#6c47ff',
  TypeScript: '#3178c6',
  Zod: '#3068b7',
  GraphQL: '#e10098',
};

export const getTechColor = (tag: string): string => techSolidColors[tag] ?? '#3f3f46';

export const projects = [
  {
    title: 'PokemonPalette',
    tagline: 'Color inspiration from your favorite Pokemon',
    description:
      'Transform the world of Pokemon into beautiful color palettes for your next design project. A unique tool that bridges nostalgia with modern design needs.',
    images: [
      '/resources/images/projects/pokemonpalette1.png',
      '/resources/images/projects/pokemonpalette2.png',
      '/resources/images/projects/pokemonpalette3.png',
    ],
    liveUrl: 'https://pokemonpalette.com',
    stats: [
      { icon: Palette, value: 2200, suffix: '+', label: 'Color Palettes' },
      { icon: Users, value: 10000, suffix: '+', label: 'Monthly Visits' },
      { icon: Code, value: 3000, suffix: '+', label: 'Monthly Users' },
    ],
    tags: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'Pokemon API', 'Clerk'],
    featured: true,
    impact:
      'Helping designers and developers find unique color inspiration while celebrating the beloved Pokemon franchise.',
  },
  {
    title: 'TalentReports',
    tagline: 'Outreach analytics for recruiting teams',
    description:
      'Reporting and analytics dashboards for outreach performance, giving teams visibility into response rates, funnels, and follow-up effectiveness.',
    images: [
      '/resources/images/projects/talentreports1.png',
      '/resources/images/projects/talentreports2.png',
      '/resources/images/projects/talentreports3.png',
    ],
    liveUrl: 'https://reports.talsight.com',
    stats: [
      { icon: Users, value: 150, suffix: '+', label: 'Registered recruiters' },
      { icon: FileText, value: 14000, suffix: '+', label: 'Reports generated' },
      { icon: Mail, value: 500, suffix: '+', label: 'Report emails sent' },
    ],
    tags: ['Nuxt3', 'Vue', 'Supabase', 'TailwindCSS', 'Clerk'],
    featured: false,
    impact: 'Helping recruiting teams understand what works in outreach and improve conversion.',
  },
  {
    title: 'ecuLink',
    tagline: 'Remote diagnostics for heavy-duty trucks',
    description:
      'Secure remote access to truck ECUs with full J1939 support, enabling real-time diagnostics over a low-latency VPN connection.',
    images: [
      '/resources/images/projects/eculink1.png',
      '/resources/images/projects/eculink2.png',
      '/resources/images/projects/eculink3.png',
    ],
    liveUrl: 'https://eculink.io',
    stats: [
      { icon: MapPin, value: 24, suffix: '/7', label: 'Real-time GPS tracking' },
      { icon: Wrench, value: 10, suffix: '+', label: 'Diagnostic tools supported' },
      { icon: Globe2, value: 50, suffix: ' states', label: 'Advanced fleet monitoring' },
    ],
    tags: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'Clerk'],
    featured: false,
    impact:
      'Reducing fleet downtime by bringing OEM diagnostics online without moving the vehicle.',
  },
  {
    title: 'Frameworked.io',
    tagline: 'Supercharge your Notion workspace',
    description:
      'A powerful platform that enhances Notion with beautiful dashboards, real-time data sync, and an optimized mobile experience. Keep Notion as your source of truth while unlocking its full potential.',
    images: [
      '/resources/images/projects/frameworked1.png',
      '/resources/images/projects/frameworked2.png',
      '/resources/images/projects/frameworked3.png',
    ],
    liveUrl: 'https://frameworked.io',
    stats: [
      { icon: FileText, value: 500, suffix: '+', label: 'Daily logs processed' },
      { icon: Sparkles, value: 15, suffix: '+', label: 'Custom modules' },
      { icon: Code, value: 99.9, suffix: '%', label: 'Uptime' },
    ],
    tags: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'Notion API', 'Clerk'],
    featured: true,
    impact:
      'Empowering professionals to create their perfect productivity system without leaving the Notion ecosystem.',
  },
  {
    title: 'pharmacopeia',
    tagline: 'An open API for medications',
    description:
      'A developer-first reference layer for the world’s pharmacopeia — drugs, classes, interactions, indications, and 2D structures, structured and versioned. Available over REST, GraphQL, and first-party SDKs, with generated docs, typed clients, and an OpenAPI 3.1 document all produced from the same Zod schema.',
    images: [
      '/resources/images/projects/pharmacopeia1.png',
      '/resources/images/projects/pharmacopeia2.png',
      '/resources/images/projects/pharmacopeia3.png',
    ],
    liveUrl: 'https://pharmacopeia-api.vercel.app/',
    stats: [
      { icon: Pill, value: 2577, suffix: '+', label: 'Drugs indexed' },
      { icon: Layers, value: 2208, suffix: '+', label: 'Pharmacological classes' },
      { icon: Activity, value: 2522, suffix: '+', label: 'ICD-10 mapped indications' },
    ],
    tags: ['Next.js', 'TypeScript', 'Zod', 'GraphQL', 'Supabase', 'TailwindCSS'],
    featured: false,
    impact:
      'Giving developers and LLMs a verifiable, citable data layer for medical reference, with a source URL and hash behind every field.',
  },
  {
    title: 'HallownestAPI',
    tagline: 'An open API for Hollow Knight & Silksong',
    description:
      'A fan-made, non-commercial data layer for Hollow Knight and Silksong — bosses, charms, areas, characters, and items, structured and versioned. Inspired by PokeAPI, with predictable URLs, JSON in and out, and a schema validated end-to-end with Zod.',
    images: [
      '/resources/images/projects/hallownest1.png',
      '/resources/images/projects/hallownest2.png',
      '/resources/images/projects/hallownest3.png',
    ],
    liveUrl: 'https://hallownest-api.vercel.app/',
    stats: [
      { icon: Swords, value: 47, suffix: '', label: 'Bosses cataloged' },
      { icon: Users, value: 90, suffix: '+', label: 'Characters & enemies' },
      { icon: Map, value: 53, suffix: '', label: 'Areas & sub-areas' },
    ],
    tags: ['Next.js', 'TypeScript', 'Zod', 'TailwindCSS'],
    featured: false,
    impact:
      'Open, git-reviewed game data the community can build tools on top of, with every entity linking back to the wikis.',
  },
];
