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

/** react-icons 5.7 dropped `SiOpenai`; keep the Simple Icons mark inline. */
const SiOpenai: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
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
