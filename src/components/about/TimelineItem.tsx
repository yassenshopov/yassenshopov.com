'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Heart,
  Home,
  Paintbrush,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import type { AboutTimelineEntry, AboutTimelineIcon } from '@/data/about-timeline';
import FullscreenImage from './FullscreenImage';

const timelineIcons: Record<AboutTimelineIcon, LucideIcon> = {
  graduation: GraduationCap,
  paintbrush: Paintbrush,
  home: Home,
  briefcase: Briefcase,
  rocket: Rocket,
  heart: Heart,
};

type TimelineItemProps = AboutTimelineEntry & {
  index: number;
  isLast: boolean;
};

type FullscreenTarget = { src: string; alt: string; caption: string };

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function TimelineItem({
  year,
  title,
  description,
  icon,
  mainImg,
  mainImgCaption,
  sideImg,
  sideImgCaption,
  links,
  index,
  isLast,
}: TimelineItemProps) {
  const [fullscreenImage, setFullscreenImage] = useState<FullscreenTarget | null>(null);
  const Icon = timelineIcons[icon];

  return (
    <Reveal delay={index * 80} className="relative grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8">
      {/* Rail: marker + vertical line */}
      <div className="flex flex-col items-center">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={2} />
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 min-h-8 bg-border" aria-hidden />}
      </div>

      <article className={isLast ? '' : 'pb-14 md:pb-20'}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {year}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={() =>
              setFullscreenImage({ src: mainImg, alt: title, caption: mainImgCaption })
            }
            aria-label={`View image for ${title}`}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/40 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Image
              src={mainImg}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </button>
          {sideImg && (
            <button
              type="button"
              onClick={() =>
                setFullscreenImage({
                  src: sideImg,
                  alt: `${title} (detail)`,
                  caption: sideImgCaption,
                })
              }
              aria-label={`View detail image for ${title}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/40 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Image
                src={sideImg}
                alt={`${title} (detail)`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </button>
          )}
        </div>

        {links.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {links.map((link) => {
              const external = isExternalUrl(link.url);
              return (
                <li key={`${link.text}-${link.url}`}>
                  <Link
                    href={link.url}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {link.text}
                    {external && <ExternalLink className="size-3 opacity-60" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      {fullscreenImage && (
        <FullscreenImage
          src={fullscreenImage.src}
          alt={fullscreenImage.alt}
          caption={fullscreenImage.caption}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </Reveal>
  );
}
