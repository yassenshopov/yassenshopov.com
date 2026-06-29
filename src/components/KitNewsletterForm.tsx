'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface KitNewsletterFormProps {
  variant?: 'default' | 'inline';
}

const KIT_FORM_ID = '7b89eac8f8';
const KIT_FORM_ACTION = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function InlineSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;

    const formData = new FormData(event.currentTarget);
    // Honeypot: if a bot filled the hidden field, silently no-op.
    if (
      typeof formData.get('website') === 'string' &&
      (formData.get('website') as string).length > 0
    ) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const body = new URLSearchParams();
      body.set('email_address', email);

      const response = await fetch(KIT_FORM_ACTION, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Subscription failed (${response.status})`);
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto w-full max-w-md rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-medium text-foreground"
      >
        Thanks for subscribing — check your inbox to confirm.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-md">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only absolute left-[-9999px]"
      />

      <div
        className={cn(
          'flex flex-col gap-2',
          'sm:flex-row sm:items-stretch sm:gap-0',
          'sm:rounded-full sm:border sm:border-border sm:bg-background sm:p-1.5'
        )}
      >
        <label htmlFor="kit-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="kit-newsletter-email"
          type="email"
          name="email_address"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          disabled={status === 'loading'}
          className={cn(
            'min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40',
            'sm:border-none sm:bg-transparent sm:py-2 sm:focus-visible:ring-0'
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading' || email.trim().length === 0}
          className={cn(
            'shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity',
            'hover:opacity-90',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'sm:py-2'
          )}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-3 text-center text-sm text-destructive">
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
      )}
    </form>
  );
}

function KitEmbeddedForm() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || !formContainerRef.current) return;

    const style = document.createElement('style');
    style.textContent = `
      [data-uid="7b89eac8f8"] {
        background: transparent !important;
      }

      [data-uid="7b89eac8f8"] .formkit-header {
        color: var(--foreground) !important;
        font-family: var(--font-merriweather) !important;
        font-size: 27px !important;
        font-weight: 700 !important;
        margin-bottom: 1rem !important;
      }

      [data-uid="7b89eac8f8"] .formkit-subheader {
        color: var(--muted-foreground) !important;
        font-size: 18px !important;
        margin-bottom: 1.5rem !important;
      }

      [data-uid="7b89eac8f8"] .formkit-input {
        background: var(--background) !important;
        color: var(--foreground) !important;
        border: 1px solid var(--border) !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        width: 100% !important;
        transition: border-color 0.2s ease !important;
      }

      [data-uid="7b89eac8f8"] .formkit-input:focus {
        outline: none !important;
        border-color: var(--primary) !important;
        ring: 2px var(--primary) !important;
      }

      [data-uid="7b89eac8f8"] .formkit-submit {
        background: var(--primary) !important;
        color: var(--primary-foreground) !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        font-size: 1rem !important;
        transition: opacity 0.2s ease !important;
      }

      [data-uid="7b89eac8f8"] .formkit-submit:hover {
        opacity: 0.9 !important;
      }

      [data-uid="7b89eac8f8"] .formkit-guarantee {
        color: var(--muted-foreground) !important;
        font-size: 0.875rem !important;
        margin-top: 1rem !important;
      }

      [data-uid="7b89eac8f8"] .formkit-powered-by-convertkit-container {
        opacity: 0.7 !important;
      }

      [data-uid="7b89eac8f8"] .seva-fields {
        display: flex !important;
        gap: 0.5rem !important;
        margin-bottom: 1rem !important;
      }

      [data-uid="7b89eac8f8"] .formkit-field {
        flex: 1 !important;
      }

      @media (max-width: 640px) {
        [data-uid="7b89eac8f8"] .seva-fields {
          flex-direction: column !important;
        }

        [data-uid="7b89eac8f8"] .formkit-submit {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://inkmorphism.kit.com/${KIT_FORM_ID}/index.js`;
    script.dataset.uid = KIT_FORM_ID;
    script.dataset.position = 'inline';
    formContainerRef.current.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  return (
    <div id="newsletter" className="mx-auto max-w-2xl border-t pt-16">
      <div ref={formContainerRef}></div>
    </div>
  );
}

export function KitNewsletterForm({ variant = 'default' }: KitNewsletterFormProps) {
  if (variant === 'inline') return <InlineSubscribeForm />;
  return <KitEmbeddedForm />;
}
