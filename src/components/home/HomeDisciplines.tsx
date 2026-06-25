'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Paintbrush, Rocket, PenLine, type LucideIcon } from 'lucide-react';

interface Discipline {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  rotate: string;
}

const disciplines: Discipline[] = [
  {
    icon: Code2,
    title: 'Build',
    description: 'Web apps with Next.js, React, TypeScript & Tailwind — fast, accessible, type-safe.',
    color: '#8FCAD9',
    rotate: '-rotate-3',
  },
  {
    icon: Paintbrush,
    title: 'Design',
    description: 'Interfaces and Notion systems people actually enjoy using, from layout to motion.',
    color: '#F5C518',
    rotate: 'rotate-2',
  },
  {
    icon: Rocket,
    title: 'Ship',
    description: 'Idea to live product — MVPs, dashboards and data-driven tools, out in real hands.',
    color: '#E8552D',
    rotate: '-rotate-2',
  },
  {
    icon: PenLine,
    title: 'Write',
    description: 'Life Engineering — a weekly letter on building a life and a craft worth keeping.',
    color: '#D9C8A4',
    rotate: 'rotate-3',
  },
];

const GRID_BG: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
};

export function HomeDisciplines() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="what-i-do" className="relative overflow-hidden bg-background py-20 md:py-28 scroll-mt-16">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-50" style={GRID_BG} />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, transparent 0%, var(--background) 78%)',
        }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-6 mb-10" aria-label="What I do">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
              What I do
            </h2>
            <div className="flex-1 pb-2 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                one person, full stack
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map((discipline, index) => {
              const Icon = discipline.icon;
              return (
                <motion.div
                  key={discipline.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6, rotate: 0 }}
                  className={`group relative rounded-2xl p-6 text-neutral-900 transition-transform ${discipline.rotate}`}
                  style={{ backgroundColor: discipline.color }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.12] mix-blend-multiply"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                  />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900/10 ring-1 ring-neutral-900/15">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 text-2xl font-bold tracking-tight">
                    {discipline.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-neutral-900/75">
                    {discipline.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
