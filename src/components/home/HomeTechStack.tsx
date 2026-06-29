import { type IconType } from 'react-icons';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiClerk,
  SiVuedotjs,
  SiNuxt,
  SiNotion,
  SiVercel,
  SiNodedotjs,
  SiFigma,
  SiFramer,
  SiShadcnui,
  SiOpenai,
  SiVitest,
  SiZod,
  SiStripe,
  SiPrisma,
  SiRedis,
} from 'react-icons/si';

// Cursor isn't in this version of react-icons yet, so we inline the official
// Simple Icons mark and match the `IconType` (size via `className`, uses
// `currentColor`) so it behaves like every other icon in the marquee.
const SiCursor: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
  </svg>
);

interface Tech {
  name: string;
  icon: IconType;
  /**
   * Brand color the icon fades to on hover. Omit for inherently monochrome
   * logos (Next.js, Notion, Vercel) so they inherit the theme foreground and
   * stay visible in both light and dark mode.
   */
  color?: string;
}

// Pulled from the stacks across my projects (see ProjectsList). Add more here
// as the toolkit grows — the marquee duplicates and loops automatically.
const techStack: Tech[] = [
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'React', icon: SiReact, color: '#61dafb' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38bdf8' },
  { name: 'shadcn/ui', icon: SiShadcnui },
  { name: 'Vue', icon: SiVuedotjs, color: '#42b883' },
  { name: 'Nuxt', icon: SiNuxt, color: '#00dc82' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#5fa04e' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ecf8e' },
  { name: 'Clerk', icon: SiClerk, color: '#6c47ff' },
  { name: 'Notion', icon: SiNotion },
  { name: 'Framer Motion', icon: SiFramer, color: '#0055ff' },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Cursor', icon: SiCursor },
  { name: 'OpenAI', icon: SiOpenai },
  { name: 'Zod', icon: SiZod, color: '#3e67b1' },
  { name: 'Stripe', icon: SiStripe, color: '#635bff' },
  { name: 'Prisma', icon: SiPrisma },
  { name: 'Redis', icon: SiRedis, color: '#ff4438' },
  { name: 'Vitest', icon: SiVitest, color: '#6e9f18' },
  { name: 'Figma', icon: SiFigma, color: '#f24e1e' },
];

function TechItem({ tech }: { tech: Tech }) {
  const Icon = tech.icon;
  return (
    <li
      className="group flex shrink-0 items-center gap-3 px-6 text-muted-foreground transition-colors duration-300 hover:text-foreground"
      style={tech.color ? ({ '--brand': tech.color } as React.CSSProperties) : undefined}
    >
      <Icon
        className={`h-7 w-7 transition-colors duration-300 ${
          tech.color ? 'group-hover:text-(--brand)' : ''
        }`}
        aria-hidden="true"
      />
      <span className="text-lg font-semibold tracking-tight whitespace-nowrap">{tech.name}</span>
    </li>
  );
}

function MarqueeRow({ items, direction }: { items: Tech[]; direction: 'left' | 'right' }) {
  // Duplicate the list so translating -50% lands on an identical copy → seamless loop.
  const loop = [...items, ...items];

  return (
    <ul
      className={`flex w-max shrink-0 items-center motion-reduce:animate-none ${
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
      }`}
    >
      {loop.map((tech, i) => (
        <TechItem key={`${tech.name}-${i}`} tech={tech} />
      ))}
    </ul>
  );
}

export function HomeTechStack() {
  // Split into two rows with different items, scrolling in opposite directions.
  const mid = Math.ceil(techStack.length / 2);
  const topRow = techStack.slice(0, mid);
  const bottomRow = techStack.slice(mid);

  return (
    <section
      aria-label="Tech stack"
      className="relative overflow-hidden border-y border-border bg-background py-12 md:py-16"
    >
      <div
        className="relative flex flex-col gap-6 md:gap-8"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <MarqueeRow items={topRow} direction="left" />
        <MarqueeRow items={bottomRow} direction="right" />
      </div>
    </section>
  );
}
