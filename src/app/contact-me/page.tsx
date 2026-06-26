'use client';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CONTACT_EMAIL, social } from '@/data/social';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type Topic = 'collab' | 'templates' | 'commission' | 'hi';

type TopicOption = {
  value: Topic;
  label: string;
  subject: string;
  // Some topics route better through a tailored page (e.g. the art commissions
  // form). When set, the form shows a nudge but still lets the user proceed.
  redirect?: { href: string; cta: string; note: string };
};

const TOPIC_OPTIONS: TopicOption[] = [
  { value: 'collab', label: 'Collab / project', subject: 'Project inquiry' },
  { value: 'templates', label: 'Notion templates', subject: 'Notion templates' },
  {
    value: 'commission',
    label: 'Art commission',
    subject: 'Art commission inquiry',
    redirect: {
      href: '/art#commissions',
      cta: 'Use the commissions form',
      note: 'There’s a tailored brief over on the art page — quicker for both of us, and you can attach references in the same flow.',
    },
  },
  { value: 'hi', label: 'Just saying hi', subject: 'Hi' },
];

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
  { name: 'GitHub', icon: Github, href: social.github },
  { name: 'LinkedIn', icon: Linkedin, href: social.linkedin },
  { name: 'Twitter', icon: Twitter, href: social.x },
  { name: 'Instagram', icon: Instagram, href: social.instagram },
];

export default function ContactPage() {
  const [topic, setTopic] = useState<Topic>('collab');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot — hidden from real users; bots that fill it get silently dropped.
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedTopic = TOPIC_OPTIONS.find((t) => t.value === topic) ?? TOPIC_OPTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, topic, company }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMsg(data?.error || 'Could not send your message. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Network error — please try again, or email me directly.');
      setStatus('error');
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted" />

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
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none mix-blend-hard-light opacity-90 dark:opacity-40 dark:mix-blend-overlay [.olive_&]:opacity-40 [.olive_&]:mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '220px 220px',
          }}
        />

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
            {/* Form */}
            <Card className="p-6 md:p-8 backdrop-blur-xl bg-card/60">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Message sent</h2>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Thanks{name ? `, ${name}` : ''} — it&apos;s landed in my inbox. I read every
                    message and usually reply within a few days.
                  </p>
                  <div className="mt-6">
                    <Button asChild variant="outline">
                      <Link href="#book">
                        Book a call instead
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic pills */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">What’s this about?</span>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_OPTIONS.map((opt) => {
                      const selected = topic === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setTopic(opt.value)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            selected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-accent'
                          }`}
                          aria-pressed={selected}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic-specific nudge (currently only the commissions topic) */}
                {selectedTopic.redirect && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {selectedTopic.redirect.note}
                    </p>
                    <Button asChild variant="outline" size="sm" className="group">
                      <Link href={selectedTopic.redirect.href}>
                        {selectedTopic.redirect.cta}
                        <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                      Your name
                    </label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Doe"
                      autoComplete="name"
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                      Reply email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-background/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A few lines about what's on your mind — context, links, what 'done' looks like…"
                    required
                    className="min-h-[170px] bg-background/60"
                  />
                </div>

                {/* Honeypot — off-screen, not focusable; real users never fill it. */}
                <div
                  aria-hidden
                  className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="contact-company">Company (leave this empty)</label>
                  <input
                    id="contact-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-destructive text-center" role="alert">
                    {errorMsg}{' '}
                    <Link
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="underline underline-offset-2"
                    >
                      Email me directly
                    </Link>
                    .
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      Sending&hellip;
                      <Loader2 className="ml-2 w-4 h-4 animate-spin" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Goes straight to my inbox — I read every message and reply to real ones.
                </p>
              </form>
              )}
            </Card>

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
