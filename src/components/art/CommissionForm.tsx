'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { COMMISSION_EMAIL, PIECE_OPTIONS, type CommissionPieceType } from '@/data/art';

/**
 * Commission brief form. Builds a pre-filled `mailto:` link rather than posting
 * to a server, so it's a self-contained client island on the otherwise-static
 * art page.
 */
export function CommissionForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pieceType, setPieceType] = useState<CommissionPieceType>('character');
  const [deadline, setDeadline] = useState('');
  const [brief, setBrief] = useState('');

  const mailtoHref = useMemo(() => {
    const subject = `Commission inquiry — ${
      PIECE_OPTIONS.find((p) => p.value === pieceType)?.label ?? 'Artwork'
    }`;
    const body = [
      `Hi Yassen,`,
      ``,
      `Name: ${name || '(your name)'}`,
      `Reply email: ${email || '(your email)'}`,
      `Piece type: ${PIECE_OPTIONS.find((p) => p.value === pieceType)?.label ?? pieceType}`,
      `Deadline / timing: ${deadline || '(flexible)'}`,
      ``,
      `Brief:`,
      brief || '(describe the piece, reference images, vibe, size, usage…)',
    ].join('\n');
    return `mailto:${COMMISSION_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [name, email, pieceType, deadline, brief]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailtoHref;
      }}
      className="space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="art-name" className="text-sm font-medium text-foreground">
            Your name
          </label>
          <Input
            id="art-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Doe"
            required
            className="bg-background/60"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="art-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="art-email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-background/60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Type of piece</span>
        <div className="flex flex-wrap gap-2">
          {PIECE_OPTIONS.map((opt) => {
            const selected = pieceType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPieceType(opt.value)}
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

      <div className="space-y-2">
        <label htmlFor="art-deadline" className="text-sm font-medium text-foreground">
          Deadline (optional)
        </label>
        <Input
          id="art-deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="e.g. by end of June, or flexible"
          className="bg-background/60"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="art-brief" className="text-sm font-medium text-foreground">
          Brief
        </label>
        <Textarea
          id="art-brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Describe the piece — characters, vibe, references, intended use, size…"
          required
          className="min-h-[160px] bg-background/60"
        />
      </div>

      <Button type="submit" size="lg" className="w-full group">
        Send via email
        <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Opens your email client with the brief pre-filled — no inbox needed on my side beyond what
        you send.
      </p>
    </form>
  );
}
