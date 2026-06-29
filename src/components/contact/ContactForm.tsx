'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { CONTACT_EMAIL } from '@/data/social';

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

export function ContactForm() {
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
    <Card className="p-6 md:p-8 backdrop-blur-xl bg-card/60">
      {status === 'success' ? (
        <div className="flex flex-col items-center text-center py-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">Message sent</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Thanks{name ? `, ${name}` : ''} — it&apos;s landed in my inbox. I read every message and
            usually reply within a few days.
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
              <p className="text-sm text-muted-foreground mb-3">{selectedTopic.redirect.note}</p>
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
              <Link href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
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
  );
}
