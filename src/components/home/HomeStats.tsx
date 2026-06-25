'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Palette, FileText, Activity, type LucideIcon } from 'lucide-react';
import { AnimatedNumber } from '@/components/AnimatedNumber';

interface Stat {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  source: string;
  icon: LucideIcon;
  color: string;
  rotate: string;
}

const stats: Stat[] = [
  {
    value: 10,
    suffix: 'K+',
    label: 'Monthly visits',
    source: 'PokemonPalette',
    icon: TrendingUp,
    color: '#E8552D',
    rotate: '-rotate-2',
  },
  {
    value: 2.2,
    suffix: 'K+',
    decimals: 1,
    label: 'Palettes generated',
    source: 'PokemonPalette',
    icon: Palette,
    color: '#F5C518',
    rotate: 'rotate-2',
  },
  {
    value: 14,
    suffix: 'K+',
    label: 'Reports generated',
    source: 'TalentReports',
    icon: FileText,
    color: '#8FCAD9',
    rotate: '-rotate-2',
  },
  {
    value: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Platform uptime',
    source: 'Frameworked.io',
    icon: Activity,
    color: '#D9C8A4',
    rotate: 'rotate-2',
  },
];

export function HomeStats() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-6 mb-10" aria-label="Real-world impact">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
              In real hands
            </h2>
            <div className="flex-1 pb-2 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                live numbers
              </span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
                  whileHover={{ rotate: 0, y: -6 }}
                  className={`group relative overflow-hidden rounded-2xl p-6 text-neutral-900 transition-transform ${stat.rotate}`}
                  style={{ backgroundColor: stat.color }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-[0.65rem] font-mono uppercase tracking-[0.14em] text-neutral-900/60">
                      {stat.source}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-900/70" aria-hidden="true" />
                  </div>
                  <div className="relative mt-6 text-4xl md:text-5xl font-bold tracking-tighter">
                    <AnimatedNumber end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <p className="relative mt-1 text-sm font-medium text-neutral-900/75">
                    {stat.label}
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
