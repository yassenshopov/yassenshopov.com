'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectPreviewCarousel } from '@/components/projects/ProjectPreviewCarousel';

export type HomeProjectCardProps = {
  title: string;
  tagline: string;
  images: string[];
  liveUrl: string;
};

export function HomeProjectCard({ title, tagline, images, liveUrl }: HomeProjectCardProps) {
  const [hovering, setHovering] = useState(false);
  const anchor = title.toLowerCase();

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-border/70 bg-background"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link
        href={`/projects#${anchor}`}
        className="block p-2 pb-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        aria-label={`View ${title}`}
      >
        <ProjectPreviewCarousel images={images} title={title} hovering={hovering} />
      </Link>

      <div className="flex flex-1 flex-col p-2.5 pt-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects#${anchor}`} className="min-w-0 text-left">
            <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={`Visit ${title} live`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground line-clamp-2">{tagline}</p>
      </div>
    </article>
  );
}
