'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Clapperboard,
  Monitor,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LibraryItem } from '@/data/library';
import { formatDate } from '@/lib/format-date';

interface LibraryModalProps {
  selectedItem: LibraryItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isTransitioning: boolean;
  sortedItems: LibraryItem[];
  getCreatorLabel: (item: LibraryItem) => string;
  getStatusColor: (status: string) => string;
  getRelatedItems: (item: LibraryItem, limit?: number) => LibraryItem[];
  getSeriesInfo: (item: LibraryItem) => any;
  getRelationshipLabel: (fromItem: LibraryItem, toItem: LibraryItem) => string;
  onSelectItem: (item: LibraryItem) => void;
}

function formatStatus(status: string) {
  return status
    .split('-')
    .map((w) => (w === 'to' ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function getTypeIcon(type: string, size: 'sm' | 'lg' = 'lg') {
  const cls = size === 'sm' ? 'w-6 h-6' : 'w-12 h-12';
  switch (type) {
    case 'book':
      return <BookOpen className={cls} />;
    case 'movie':
      return <Clapperboard className={cls} />;
    case 'series':
      return <Monitor className={cls} />;
    default:
      return null;
  }
}

function Stars({ rating, size = 'sm' }: { rating: number | null; size?: 'sm' | 'md' }) {
  if (rating == null) {
    return <span className="text-xs text-muted-foreground italic">Unrated</span>;
  }
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.65rem] md:text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
      {children}
    </h2>
  );
}

// Boost a "r,g,b" string's saturation and lightness for a more vivid gradient
function boostColor(rgb: string, satBoost = 1.3, lightBoost = 1.15) {
  let [r, g, b] = rgb.split(',').map(Number);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  s = Math.min(s * satBoost, 1);
  const lBoosted = Math.min(l * lightBoost, 1);
  const q = lBoosted < 0.5 ? lBoosted * (1 + s) : lBoosted + s - lBoosted * s;
  const p = 2 * lBoosted - q;
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const rr = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const gg = Math.round(hue2rgb(p, q, h) * 255);
  const bb = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `${rr},${gg},${bb}`;
}

export default function LibraryModal({
  selectedItem,
  onClose,
  onNavigate,
  isTransitioning,
  sortedItems,
  getCreatorLabel,
  getStatusColor,
  getRelatedItems,
  getSeriesInfo,
  getRelationshipLabel,
  onSelectItem,
}: LibraryModalProps) {
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [colorCache, setColorCache] = useState<{ [key: string]: string[] }>({});

  // Extract dominant colors from cover image (off-screen canvas, no DOM node)
  useEffect(() => {
    if (!selectedItem?.coverImage) {
      setDominantColors([]);
      return;
    }
    if (colorCache[selectedItem.coverImage]) {
      setDominantColors(colorCache[selectedItem.coverImage]);
      return;
    }
    const imgSrc = selectedItem.coverImage;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const counts: { [key: string]: number } = {};
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        if (a < 125) continue;
        const brightness = (r + g + b) / 3;
        if (brightness < 30 || brightness > 225) continue;
        const key = `${r},${g},${b}`;
        counts[key] = (counts[key] || 0) + 1;
      }
      const top = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([c]) => c);
      setColorCache((prev) => ({ ...prev, [imgSrc]: top }));
      setDominantColors(top);
    };
    img.src = imgSrc;
  }, [selectedItem, colorCache]);

  if (!selectedItem) return null;

  const boosted = dominantColors.map((c) => boostColor(c));
  const creatorLabel = getCreatorLabel(selectedItem);
  const seriesInfo = selectedItem.series ? getSeriesInfo(selectedItem) : null;
  const relatedItems = getRelatedItems(selectedItem, 6);
  const hasNav = sortedItems.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl min-h-[30rem] sm:min-h-[34rem] md:min-h-[38rem] max-h-[95vh] overflow-hidden bg-background rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 rounded-full w-9 h-9 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Prev / Next */}
          {hasNav && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('prev')}
                disabled={isTransitioning}
                aria-label="Previous item"
                className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 z-20 rounded-full w-9 h-9 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 disabled:opacity-40 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('next')}
                disabled={isTransitioning}
                aria-label="Next item"
                className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 z-20 rounded-full w-9 h-9 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 disabled:opacity-40 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Header with cover + meta over animated gradient */}
            <div className="relative overflow-hidden">
              {/* Animated dominant-color gradient (focal accent in top-right) */}
              <div className="absolute inset-0 opacity-70 dark:opacity-60">
                {dominantColors.length > 0 ? (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse 55% 65% at 95% 10%, rgba(${boosted[0]}, 0.95) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 80% 5%, rgba(${boosted[1] || boosted[0]}, 0.75) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 100% 25%, rgba(${boosted[2] || boosted[0]}, 0.7) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 85% 30%, rgba(${boosted[3] || boosted[0]}, 0.55) 0%, transparent 60%)`,
                    }}
                    animate={{
                      background: [
                        `radial-gradient(ellipse 55% 65% at 95% 10%, rgba(${boosted[0]}, 0.95) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 80% 5%, rgba(${boosted[1] || boosted[0]}, 0.75) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 100% 25%, rgba(${boosted[2] || boosted[0]}, 0.7) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 85% 30%, rgba(${boosted[3] || boosted[0]}, 0.55) 0%, transparent 60%)`,
                        `radial-gradient(ellipse 55% 65% at 100% 20%, rgba(${boosted[0]}, 0.95) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 85% 30%, rgba(${boosted[1] || boosted[0]}, 0.75) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 90% 5%, rgba(${boosted[2] || boosted[0]}, 0.7) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 75% 20%, rgba(${boosted[3] || boosted[0]}, 0.55) 0%, transparent 60%)`,
                        `radial-gradient(ellipse 55% 65% at 85% 30%, rgba(${boosted[0]}, 0.95) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 100% 10%, rgba(${boosted[1] || boosted[0]}, 0.75) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 75% 15%, rgba(${boosted[2] || boosted[0]}, 0.7) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 95% 35%, rgba(${boosted[3] || boosted[0]}, 0.55) 0%, transparent 60%)`,
                        `radial-gradient(ellipse 55% 65% at 90% 5%, rgba(${boosted[0]}, 0.95) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 100% 30%, rgba(${boosted[1] || boosted[0]}, 0.75) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 80% 25%, rgba(${boosted[2] || boosted[0]}, 0.7) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 95% 15%, rgba(${boosted[3] || boosted[0]}, 0.55) 0%, transparent 60%)`,
                      ],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 55% 65% at 95% 10%, color-mix(in oklch, var(--muted-foreground) 30%, transparent) 0%, transparent 70%)',
                    }}
                  />
                )}
              </div>

              {/* Grain / noise texture over the gradient */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-55 dark:opacity-25 dark:mix-blend-overlay [.olive_&]:opacity-25 [.olive_&]:mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: '220px 220px',
                }}
              />

              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isTransitioning ? 0.4 : 1,
                  y: isTransitioning ? 5 : 0,
                }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                className="relative z-10 flex flex-col md:flex-row items-start gap-5 md:gap-8 p-5 sm:p-8 md:p-10 pt-12 sm:pt-10"
              >
                {/* Cover */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-48 sm:w-40 sm:h-60 relative bg-muted dark:bg-black rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5">
                    {selectedItem.coverImage ? (
                      <Image
                        src={selectedItem.coverImage}
                        alt={selectedItem.title}
                        fill
                        sizes="160px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        {getTypeIcon(selectedItem.type)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0 space-y-3 text-center md:text-left">
                  <div>
                    <div className="flex flex-wrap items-start justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                        {selectedItem.title}
                      </h1>
                      {selectedItem.series && selectedItem.seriesOrder != null && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/30 px-2 py-0.5 mt-1.5 self-start"
                        >
                          <span className="text-xs font-medium">
                            {selectedItem.series} #{selectedItem.seriesOrder}
                          </span>
                        </Badge>
                      )}
                    </div>
                    {creatorLabel && (
                      <p className="text-muted-foreground">by {creatorLabel}</p>
                    )}
                    {seriesInfo && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Part {seriesInfo.currentIndex + 1} of {seriesInfo.totalItems} in the{' '}
                        {selectedItem.series} series
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Stars rating={selectedItem.rating} size="md" />
                    <Badge
                      className={`${getStatusColor(selectedItem.status)} text-xs px-2 py-0.5`}
                    >
                      {formatStatus(selectedItem.status)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                    {selectedItem.genre.map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    {selectedItem.dateCompleted && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Completed {formatDate(selectedItem.dateCompleted)}</span>
                      </div>
                    )}
                    {selectedItem.dateStarted && selectedItem.status === 'in-progress' && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Started {formatDate(selectedItem.dateStarted)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Body */}
            <motion.div
              key={`content-${selectedItem.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isTransitioning ? 0.4 : 1,
                y: isTransitioning ? 5 : 0,
              }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1], delay: 0.03 }}
              className="px-5 sm:px-8 md:px-10 pb-10 pt-8 md:pt-10 space-y-8"
            >
              {/* Lede description */}
              <p className="text-base md:text-lg leading-relaxed text-foreground/90 max-w-3xl">
                {selectedItem.description}
              </p>

              {/* Notes */}
              {selectedItem.notes && (
                <section>
                  <SectionLabel>Notes</SectionLabel>
                  <div className="border-l-2 border-primary/60 pl-4 py-1">
                    <p className="text-foreground/90 leading-relaxed">{selectedItem.notes}</p>
                  </div>
                </section>
              )}

              {/* Links */}
              {selectedItem.links && Object.keys(selectedItem.links).length > 0 && (
                <section>
                  <SectionLabel>Links</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedItem.links).map(([platform, url]) =>
                      url ? (
                        <Link
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-sm transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-medium">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                        </Link>
                      ) : null,
                    )}
                  </div>
                </section>
              )}

              {/* Related */}
              {relatedItems.length > 0 && (
                <section>
                  <SectionLabel>Related</SectionLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    {relatedItems.map((related) => {
                      const relCreator = getCreatorLabel(related);
                      return (
                        <button
                          key={related.id}
                          type="button"
                          onClick={() => onSelectItem(related)}
                          className="group flex gap-3 py-2 -mx-2 px-2 rounded-md text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-14 h-20 relative bg-muted dark:bg-black rounded-md overflow-hidden flex-shrink-0">
                            {related.coverImage ? (
                              <Image
                                src={related.coverImage}
                                alt={related.title}
                                fill
                                sizes="56px"
                                className="object-contain group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                {getTypeIcon(related.type, 'sm')}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {related.title}
                              </h3>
                              <span className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                                {getRelationshipLabel(selectedItem, related)}
                              </span>
                            </div>
                            {relCreator && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                by {relCreator}
                              </p>
                            )}
                            {related.series && (
                              <p className="text-xs text-primary">
                                {related.series} #{related.seriesOrder}
                              </p>
                            )}
                            <Stars rating={related.rating} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
