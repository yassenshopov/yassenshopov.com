import { TrendingUp, Palette, FileText, Activity, type LucideIcon } from 'lucide-react';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Reveal } from '@/components/Reveal';
import { GrainOverlay } from '@/components/GrainOverlay';
import { SectionHeading } from '@/components/SectionHeading';

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
          <SectionHeading title="In real hands" label="Real-world impact" aside="live numbers" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Reveal
                  key={stat.label}
                  delay={index * 60}
                  className={`group relative overflow-hidden rounded-2xl p-6 text-neutral-900 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0 motion-reduce:hover:translate-y-0 ${stat.rotate}`}
                  style={{ backgroundColor: stat.color }}
                >
                  <GrainOverlay
                    variant="card"
                    className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-[0.65rem] font-mono uppercase tracking-[0.14em] text-neutral-900/60">
                      {stat.source}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-900/70" aria-hidden="true" />
                  </div>
                  <div className="relative mt-6 text-4xl md:text-5xl font-bold tracking-tighter">
                    <AnimatedNumber
                      end={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <p className="relative mt-1 text-sm font-medium text-neutral-900/75">
                    {stat.label}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
