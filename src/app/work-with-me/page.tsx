import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';
import { GrainOverlay } from '@/components/GrainOverlay';
import { SectionHeading } from '@/components/SectionHeading';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Rocket,
  LayoutDashboard,
  Wand2,
  MessageSquare,
  PencilRuler,
  Hammer,
  PackageCheck,
  Quote,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { projects } from '@/data/projects';
import { CONTACT_EMAIL } from '@/data/social';

const GRID_BG: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
};

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  rotate: string;
};

const services: Service[] = [
  {
    icon: Rocket,
    title: 'A new product / MVP',
    description:
      "You've got an idea or a pitch deck. I take it from zero to a real, usable product people can sign up for — design, front-end, and the glue to ship it.",
    color: '#8FCAD9',
    rotate: '-rotate-3',
  },
  {
    icon: LayoutDashboard,
    title: 'Web apps & dashboards',
    description:
      'Data-heavy interfaces, internal tools and analytics dashboards — fast, accessible, and built to scale with Next.js, React & TypeScript.',
    color: '#F5C518',
    rotate: 'rotate-2',
  },
  {
    icon: Wand2,
    title: 'Redesign & ship',
    description:
      'An existing app or site that feels clunky or looks dated. I refresh the UX and interface and get the new version live — not stuck in a Figma file.',
    color: '#E8552D',
    rotate: '-rotate-2',
  },
];

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: MessageSquare,
    title: 'Call',
    description:
      "We hop on a quick call. You tell me what you're building and what 'done' looks like. No prep, no hard pitch.",
  },
  {
    icon: PencilRuler,
    title: 'Scope',
    description:
      "I come back with a clear plan — what I'll build, in what order, and a realistic timeline. You know exactly what you're getting.",
  },
  {
    icon: Hammer,
    title: 'Build in the open',
    description:
      "I work in short cycles and share progress as I go, so you're never left guessing. Feedback welcome at every step.",
  },
  {
    icon: PackageCheck,
    title: 'Ship',
    description:
      "We get it live and into real hands. I hand off clean, and I'm around if you need changes after launch.",
  },
];

// Drop client quotes in here as you collect them — the section renders itself
// automatically once there's at least one. Keep it to 2–4 short, specific ones.
// e.g. { quote: '…', name: 'Jane Doe', role: 'Founder, Acme', avatar?: '/path.jpg' }
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
};

const testimonials: Testimonial[] = [];

export default function WorkWithMePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-muted" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 24%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 45%), radial-gradient(circle at 82% 80%, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 48%)',
          }}
        />
        <GrainOverlay className="absolute inset-0 -z-10 pointer-events-none mix-blend-hard-light opacity-90 dark:opacity-40 dark:mix-blend-overlay in-[.olive]:opacity-40 in-[.olive]:mix-blend-overlay" />

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6 text-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                <span className="relative rounded-full bg-primary h-2 w-2" />
              </span>
              <span className="uppercase tracking-[0.18em] text-xs">
                Available for select projects
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Let&apos;s build
              <br />
              your thing.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              I&apos;m Yassen — a product engineer who designs and builds web products end to end.
              Founders and teams bring me an idea, a rough Figma, or a half-working app; I turn it
              into something fast, polished, and live.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/contact-me#book">
                  Book a call
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">See my work</Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>Solo, senior, end&#8209;to&#8209;end</span>
              <span aria-hidden className="text-border">
                &bull;
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Usually replies within a few days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What I can help with */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div aria-hidden className="absolute inset-0 -z-10 opacity-50" style={GRID_BG} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 40%, transparent 0%, var(--background) 78%)',
          }}
        />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="What I can help with" label="What I can help with" />
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              Every project is scoped on a call, not pulled off a shelf — but most of what I take on
              falls into one of these.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Reveal
                    key={service.title}
                    delay={index * 60}
                    className={`group relative rounded-2xl p-6 text-neutral-900 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0 motion-reduce:hover:translate-y-0 ${service.rotate}`}
                    style={{ backgroundColor: service.color }}
                  >
                    <GrainOverlay
                      variant="card"
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.12] mix-blend-multiply"
                    />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900/10 ring-1 ring-neutral-900/15">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="relative mt-5 text-2xl font-bold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-neutral-900/75">
                      {service.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="How it works"
              label="How it works"
              aside="4 steps"
              className="mb-12"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal
                    key={step.title}
                    delay={index * 60}
                    className="relative rounded-2xl border border-border bg-card p-6"
                  >
                    <span className="font-mono text-sm text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Proof — receipts from shipped products */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Proof it ships" label="Proof it ships" className="mb-4" />
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              Not mockups — real products, live right now, with real people using them.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project, index) => {
                const headlineStat = project.stats[1] ?? project.stats[0];
                return (
                  <Reveal
                    as="article"
                    key={project.title}
                    delay={index * 50}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary"
                  >
                    <Link
                      href={`/projects#${project.title.toLowerCase()}`}
                      className="relative aspect-16/10 w-full overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
                      aria-label={`See ${project.title} details`}
                    >
                      {project.images[0] ? (
                        <Image
                          src={project.images[0]}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
                      {headlineStat && (
                        <p className="mt-4 text-sm">
                          <span className="font-bold text-foreground">
                            {headlineStat.value.toLocaleString()}
                            {headlineStat.suffix}
                          </span>{' '}
                          <span className="text-muted-foreground">{headlineStat.label}</span>
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-10">
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/projects">
                  See the full case studies
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — renders only once you've added at least one quote */}
      {testimonials.length > 0 && (
        <section className="bg-muted py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <SectionHeading title="In their words" label="What people say" className="mb-12" />
              <div className="grid gap-6 md:grid-cols-2">
                {testimonials.map((t) => (
                  <Card key={t.name} className="p-6 md:p-8 bg-card/60 backdrop-blur-xl">
                    <Quote className="h-6 w-6 text-primary/50" aria-hidden="true" />
                    <p className="mt-4 text-lg leading-relaxed text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      {t.avatar && (
                        <span className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                      )}
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{t.name}</span>
                        <span className="text-xs text-muted-foreground">{t.role}</span>
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div aria-hidden className="absolute inset-0 -z-10 opacity-50" style={GRID_BG} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 72%)',
          }}
        />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Ready when you are</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-foreground">
              Tell me what you&apos;re building.
            </h2>
            <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground">
              Book a 20-minute call and we&apos;ll talk through your idea and the clearest next step
              — or send a message and I&apos;ll get back to you. No prep needed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/contact-me#book">
                  Book a call
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact-me">Send a message</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Prefer email?{' '}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
