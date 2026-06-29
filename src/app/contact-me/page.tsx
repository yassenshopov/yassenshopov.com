import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { ContactForm } from '@/components/contact/ContactForm';
import { GrainOverlay } from '@/components/GrainOverlay';
import { ArrowRight, Clock, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT_EMAIL, social } from '@/data/social';

// /now-style status snapshot. Edit these when you re-base the page; the
// "Updated" stamp on the card should match.
const NOW_LAST_UPDATED = 'June 2026';
const NOW_ROWS: { label: string; value: string }[] = [
  {
    label: 'Building',
    value: 'Refreshing the site page by page — library, art, blog, contact.',
  },
  {
    label: 'Open for',
    value: 'New product builds, client projects, art commissions.',
  },
  {
    label: 'Heads up',
    value: 'Reply latency runs a few days on weekdays.',
  },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: FaGithub, href: social.github },
  { name: 'LinkedIn', icon: FaLinkedinIn, href: social.linkedin },
  { name: 'Twitter', icon: FaXTwitter, href: social.x },
  { name: 'Instagram', icon: FaInstagram, href: social.instagram },
];

export default function ContactPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-muted" />

        {/* Soft brand glow — two blurred radial accents */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 28%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 45%), radial-gradient(circle at 82% 78%, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 48%)',
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-white/10" />

        {/* Grain texture — matches the blog hero */}
        <GrainOverlay className="absolute inset-0 -z-10 pointer-events-none mix-blend-hard-light opacity-90 dark:opacity-40 dark:mix-blend-overlay in-[.olive]:opacity-40 in-[.olive]:mix-blend-overlay" />

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6 text-sm">
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                Inbox open — say hi to
                <span className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-primary/30">
                  <Image
                    src="/resources/images/main_page/YassenShopov.jpg"
                    alt="Yassen Shopov"
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </span>
                Yassen
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Let’s talk.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Project idea, art commission, Notion template question, or just a kind hello — the
              form below funnels straight into my inbox. I read every message.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Usually replies within a few days
              </span>
              <Link
                href="#book"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Or book a call
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main: form + sidebar */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
            {/* Form (client island) */}
            <ContactForm />

            {/* Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Now panel — small dated status snapshot */}
              <Card className="p-6 bg-card/60 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inset-0 rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                      <span className="relative rounded-full bg-primary h-2 w-2" />
                    </span>
                    Now
                  </h2>
                  <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Updated {NOW_LAST_UPDATED}
                  </span>
                </div>
                <dl className="space-y-3 text-sm">
                  {NOW_ROWS.map((row) => (
                    <div key={row.label} className="grid grid-cols-[88px_1fr] gap-3">
                      <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground pt-0.5">
                        {row.label}
                      </dt>
                      <dd className="text-foreground leading-relaxed">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              {/* Quiet alternatives — email + socials */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Or email directly
                  </p>
                  <Link
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    {CONTACT_EMAIL}
                  </Link>
                </div>

                <div className="space-y-2">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Find me elsewhere
                  </p>
                  <div className="flex gap-2">
                    {SOCIAL_LINKS.map((s) => (
                      <Link
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label={s.name}
                      >
                        <s.icon className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a call — live alternative to the async form. This is the single
          place on the site that hosts the scheduling embed so there's one
          canonical contact destination. */}
      <section id="book" className="py-16 md:py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="uppercase tracking-[0.18em]">Prefer to talk live</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Book a call</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Grab a slot that suits you — we&apos;ll talk through what you&apos;re building and the
              clearest next step. No prep needed.
            </p>
          </div>
          <iframe
            title="Schedule time with Yassen"
            src="https://cal.com/yassen-shopov-spd1ms?embed=1"
            className="mt-8 h-[720px] w-full rounded-2xl border border-border/60 bg-background"
            loading="lazy"
          />
        </div>
      </section>

      {/* Newsletter — soft alternative for people who don't have a specific ask */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-5 text-xs">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="uppercase tracking-[0.18em]">Quieter alternative</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Not sure what to say?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Subscribe to <span className="font-medium text-foreground">Life Engineering</span>{' '}
              instead — a weekly letter on building, creating, and living more on purpose. You can
              always hit reply.
            </p>
            <KitNewsletterForm variant="inline" />
          </Card>
        </div>
      </section>
    </Layout>
  );
}
