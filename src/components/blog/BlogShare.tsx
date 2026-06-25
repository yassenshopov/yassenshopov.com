'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Copy, Link2, Mail, Share2 } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaRedditAlien, FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';

type ShareTarget = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  buildUrl: (url: string, title: string, description?: string) => string;
  brandClass: string;
};

const SHARE_TARGETS: ShareTarget[] = [
  {
    id: 'x',
    label: 'X',
    icon: FaXTwitter,
    buildUrl: (u, t) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    brandClass:
      'hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    buildUrl: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    brandClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FaFacebookF,
    buildUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    brandClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    icon: FaRedditAlien,
    buildUrl: (u, t) =>
      `https://reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
    brandClass: 'hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    buildUrl: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    brandClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    buildUrl: (u, t, d) =>
      `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(
        `${d ? `${d}\n\n` : ''}${u}`
      )}`,
    brandClass: 'hover:bg-foreground hover:text-background hover:border-foreground',
  },
];

function openShareWindow(href: string) {
  if (href.startsWith('mailto:')) {
    window.location.href = href;
    return;
  }
  window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');
}

function useCurrentUrl() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  return url;
}

async function copyToClipboard(url: string, setCopied: (v: boolean) => void): Promise<void> {
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  } catch {
    toast.error('Could not copy link');
  }
}

interface ShareProps {
  title: string;
  description?: string;
}

/**
 * Vertical floating share rail – Medium-style.
 * Visible on xl+ screens; expects to be placed inside a sticky container.
 */
export function ShareRail({ title, description }: ShareProps) {
  const url = useCurrentUrl();
  const [copied, setCopied] = useState(false);

  if (!url) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Share
        </span>
        <div className="h-px w-6 bg-border" aria-hidden />
        <div className="flex flex-col items-center gap-1.5 pt-1">
          {SHARE_TARGETS.map((target) => {
            const Icon = target.icon;
            return (
              <Tooltip key={target.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => openShareWindow(target.buildUrl(url, title, description))}
                    aria-label={`Share on ${target.label}`}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-200 hover:scale-110 ${target.brandClass}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{target.label}</TooltipContent>
              </Tooltip>
            );
          })}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => copyToClipboard(url, setCopied)}
                aria-label="Copy link"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-200 hover:scale-110 hover:border-primary/60 hover:text-primary"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{copied ? 'Copied!' : 'Copy link'}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

/**
 * Compact Share button that opens a popover with all options.
 * Best for tight spaces (e.g. hero meta row).
 */
export function SharePopover({
  title,
  description,
  align = 'start',
}: ShareProps & { align?: 'start' | 'center' | 'end' }) {
  const url = useCurrentUrl();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: description, url });
    } catch {
      // user cancelled or share failed silently
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="group">
          <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium leading-none">Share this article</p>
            <p className="mt-1 text-xs text-muted-foreground">Pick a platform or copy the link.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SHARE_TARGETS.map((target) => {
              const Icon = target.icon;
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => openShareWindow(target.buildUrl(url, title, description))}
                  className={`flex flex-col items-center gap-1.5 rounded-md border bg-card p-2.5 text-[0.7rem] font-medium text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-200 ${target.brandClass}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="leading-none">{target.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 p-1.5">
            <div className="flex-1 truncate px-2 text-xs text-muted-foreground">
              {url || 'Loading…'}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(url, setCopied)}
              className="inline-flex items-center gap-1 rounded bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed bg-background py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Share2 className="h-3.5 w-3.5" />
              More options…
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Horizontal row of branded share buttons for in-article use
 * (e.g. the bottom-of-article share section).
 */
export function InlineShareButtons({ title, description }: ShareProps) {
  const url = useCurrentUrl();
  const [copied, setCopied] = useState(false);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-wrap items-center gap-2">
        {SHARE_TARGETS.map((target) => {
          const Icon = target.icon;
          return (
            <Tooltip key={target.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => openShareWindow(target.buildUrl(url, title, description))}
                  aria-label={`Share on ${target.label}`}
                  disabled={!url}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-200 hover:scale-105 disabled:opacity-50 ${target.brandClass}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{target.label}</TooltipContent>
            </Tooltip>
          );
        })}
        <button
          type="button"
          onClick={() => copyToClipboard(url, setCopied)}
          disabled={!url}
          className="inline-flex h-10 items-center gap-2 rounded-full border bg-card px-4 text-xs font-medium text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-200 hover:border-primary/60 hover:text-primary disabled:opacity-50"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </TooltipProvider>
  );
}
