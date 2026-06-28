'use client';

import { Children, isValidElement } from 'react';
import type { Components } from 'react-markdown';

function parseYouTubeUrl(href: string | undefined): { videoId: string; start?: number } | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  let videoId: string | undefined;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') ?? undefined;
    } else {
      const m = url.pathname.match(/^\/(?:embed|shorts|v)\/([\w-]{6,})/);
      if (m) videoId = m[1];
    }
  } else if (host === 'youtu.be') {
    const m = url.pathname.match(/^\/([\w-]{6,})/);
    if (m) videoId = m[1];
  }
  if (!videoId) return null;

  const tParam = url.searchParams.get('t') ?? url.searchParams.get('start');
  const start = tParam ? Number(tParam.replace(/[^\d]/g, '')) : undefined;
  return { videoId, start: Number.isFinite(start) ? start : undefined };
}

function parseSpotifyUrl(href: string | undefined): { type: string; id: string } | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname.replace(/^www\./, '') !== 'open.spotify.com') return null;
  const m = url.pathname.match(
    /^\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/
  );
  if (!m) return null;
  return { type: m[1], id: m[2] };
}

function hastText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { value?: string; children?: unknown[] };
  if (typeof n.value === 'string') return n.value;
  if (Array.isArray(n.children)) return n.children.map(hastText).join('');
  return '';
}

function SpotifyEmbed({ type, id, title }: { type: string; id: string; title?: string }) {
  const compact = type === 'track' || type === 'episode';
  const height = compact ? 152 : 352;
  return (
    <figure className="not-prose my-10">
      <iframe
        title={title || 'Spotify player'}
        src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator`}
        width="100%"
        height={height}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full border-0 shadow-sm"
        style={{ borderRadius: 12 }}
      />
    </figure>
  );
}

function YouTubeEmbed({
  videoId,
  start,
  title,
}: {
  videoId: string;
  start?: number;
  title: string;
}) {
  const params = new URLSearchParams({ rel: '0' });
  if (start) params.set('start', String(start));
  return (
    <figure className="not-prose my-10">
      <div className="overflow-hidden rounded-xl border bg-black shadow-sm">
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
      {title && title !== 'YouTube video' && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground italic">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

function isYouTubeEmbedNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const n = node as {
    type?: string;
    tagName?: string;
    properties?: { href?: unknown };
    children?: Array<{ type?: string; tagName?: string; value?: string }>;
  };
  if (n.type !== 'element' || n.tagName !== 'a') return false;
  const href = typeof n.properties?.href === 'string' ? n.properties.href : undefined;
  if (!parseYouTubeUrl(href)) return false;
  const significant = (n.children ?? []).filter(
    (c) => !(c.type === 'text' && /^\s*$/.test(c.value ?? ''))
  );
  return (
    significant.length === 1 &&
    significant[0].type === 'element' &&
    significant[0].tagName === 'img'
  );
}

function isSpotifyEmbedNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const n = node as {
    type?: string;
    tagName?: string;
    properties?: { href?: unknown };
  };
  if (n.type !== 'element' || n.tagName !== 'a') return false;
  const href = typeof n.properties?.href === 'string' ? n.properties.href : undefined;
  return !!parseSpotifyUrl(href);
}

function isStandaloneImage(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const n = node as { type?: string; tagName?: string };
  return n.type === 'element' && n.tagName === 'img';
}

interface ImgHastProperties {
  src?: unknown;
  alt?: unknown;
}

function MarkdownImageFigure({ src, alt }: { src: string; alt: string }) {
  const caption = alt.trim();
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const markdownComponents: Components = {
  p({ node, children, ...rest }) {
    const kids = (node?.children ?? []).filter(
      (c) =>
        !(
          c.type === 'text' &&
          typeof (c as { value?: string }).value === 'string' &&
          /^\s*$/.test((c as { value: string }).value)
        )
    );

    if (kids.length === 1 && isYouTubeEmbedNode(kids[0])) {
      return <>{children}</>;
    }

    if (kids.length === 1 && isSpotifyEmbedNode(kids[0])) {
      const aNode = kids[0] as { properties?: { href?: unknown } };
      const href = typeof aNode.properties?.href === 'string' ? aNode.properties.href : '';
      const sp = parseSpotifyUrl(href);
      if (sp) {
        const title = hastText(kids[0]).trim() || undefined;
        return <SpotifyEmbed type={sp.type} id={sp.id} title={title} />;
      }
    }

    if (kids.length === 1 && isStandaloneImage(kids[0])) {
      const imgNode = kids[0] as { properties?: ImgHastProperties };
      const src = typeof imgNode.properties?.src === 'string' ? imgNode.properties.src : '';
      const alt = typeof imgNode.properties?.alt === 'string' ? imgNode.properties.alt : '';
      if (src) {
        return <MarkdownImageFigure src={src} alt={alt} />;
      }
    }

    return <p {...rest}>{children}</p>;
  },
  a({ href, children, ...rest }) {
    const yt = parseYouTubeUrl(href);
    if (yt) {
      const kids = Children.toArray(children).filter(
        (c) => !(typeof c === 'string' && c.trim() === '')
      );
      const onlyChild = kids.length === 1 ? kids[0] : null;
      const wrapsImage =
        onlyChild && isValidElement<{ alt?: string }>(onlyChild) && onlyChild.type === 'img';
      if (wrapsImage) {
        const alt =
          (onlyChild as React.ReactElement<{ alt?: string }>).props.alt || 'YouTube video';
        return <YouTubeEmbed videoId={yt.videoId} start={yt.start} title={alt} />;
      }
    }
    const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    const safeSrc = typeof src === 'string' ? src : '';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="inline-block align-middle rounded-md"
      />
    );
  },
};
