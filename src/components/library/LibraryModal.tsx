'use client';

import { useState, useEffect, useId, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Clapperboard,
  Monitor,
  Loader2,
  Save,
  Undo2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type LibraryItem, type ReadingStatus } from '@/data/library';
import { formatDate } from '@/lib/format-date';
import { boostColor } from '@/lib/color-utils';
import { GrainOverlay } from '@/components/GrainOverlay';
import { useLibraryEntryEditor } from '@/hooks/useLibraryEntryEditor';
import TierBadge from './TierBadge';

const STATUS_OPTIONS: ReadingStatus[] = ['completed', 'in-progress', 'on-pause', 'dnf'];

interface LibraryModalProps {
  selectedItem: LibraryItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isTransitioning: boolean;
  sortedItems: LibraryItem[];
  getCreatorLabel: (item: LibraryItem) => string;
  getStatusColor: (status: string) => string;
  getRelatedItems: (item: LibraryItem, limit?: number) => LibraryItem[];
  getSeriesInfo: (
    item: LibraryItem
  ) => { name: string; items: LibraryItem[]; currentIndex: number; totalItems: number } | null;
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.65rem] md:text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
      {children}
    </h2>
  );
}

const FIELD_LABEL = 'text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground';

export default function LibraryModal({ selectedItem, ...rest }: LibraryModalProps) {
  return (
    <AnimatePresence>
      {selectedItem && <ModalContent key="library-modal" selectedItem={selectedItem} {...rest} />}
    </AnimatePresence>
  );
}

type ModalContentProps = Omit<LibraryModalProps, 'selectedItem'> & {
  selectedItem: LibraryItem;
};

function ModalContent({
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
}: ModalContentProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const colorCacheRef = useRef<{ [key: string]: string[] }>({});

  const {
    displayItem,
    draft,
    setDraft,
    draftId,
    setDraftId,
    isSaving,
    canEdit,
    isDirty,
    resetDraft,
    handleSave,
  } = useLibraryEntryEditor(selectedItem);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    panel?.focus();

    // Trap Tab focus inside the dialog so it can't drift onto the page behind
    // the `aria-modal` overlay. (Escape/arrow handling lives in the parent.)
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
      if (focusable.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const imgSrc = selectedItem.coverImage;
    if (!imgSrc) {
      setDominantColors([]);
      return;
    }
    const cached = colorCacheRef.current[imgSrc];
    if (cached) {
      setDominantColors(cached);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
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
      colorCacheRef.current[imgSrc] = top;
      setDominantColors(top);
    };
    img.src = imgSrc;
    return () => {
      cancelled = true;
    };
  }, [selectedItem.coverImage]);

  const headerTint = useMemo(() => {
    if (dominantColors.length === 0) return null;
    const c = boostColor(dominantColors[0]);
    return `linear-gradient(to bottom, rgba(${c}, 0.55) 0%, rgba(${c}, 0.18) 55%, transparent 100%)`;
  }, [dominantColors]);

  const creatorLabel = getCreatorLabel(displayItem);
  const seriesInfo = displayItem.series ? getSeriesInfo(displayItem) : null;
  const relatedItems = getRelatedItems(displayItem, 6);
  const hasNav = sortedItems.length > 1;
  const currentIndex = sortedItems.findIndex((i) => i.id === selectedItem.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl min-h-120 sm:min-h-136 md:min-h-152 max-h-[95vh] overflow-hidden bg-background rounded-2xl flex flex-col outline-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 rounded-full w-9 h-9 p-0 bg-background/80 backdrop-blur-xs hover:bg-background/90"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Header with cover + meta */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-80 dark:opacity-60">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    headerTint ??
                    'linear-gradient(to bottom, color-mix(in oklch, var(--muted-foreground) 22%, transparent) 0%, transparent 70%)',
                }}
              />
            </div>

            <GrainOverlay className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-55 dark:opacity-25 dark:mix-blend-overlay in-[.olive]:opacity-25 in-[.olive]:mix-blend-overlay" />

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
              <div className="shrink-0 mx-auto md:mx-0">
                <div
                  className={`w-32 h-48 sm:w-40 sm:h-60 relative rounded-lg overflow-hidden ${
                    displayItem.coverImage ? '' : 'bg-muted dark:bg-black ring-1 ring-black/5'
                  }`}
                >
                  {displayItem.coverImage ? (
                    <Image
                      src={displayItem.coverImage}
                      alt={displayItem.title}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      {getTypeIcon(displayItem.type)}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0 space-y-3 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-start justify-center md:justify-start gap-2 mb-1">
                    <h1
                      id={titleId}
                      className="text-2xl md:text-3xl font-bold tracking-tight leading-tight"
                    >
                      {displayItem.title}
                    </h1>
                    {displayItem.series && displayItem.seriesOrder != null && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 px-2 py-0.5 mt-1.5 self-start"
                      >
                        <span className="text-xs font-medium">
                          {displayItem.series} #{displayItem.seriesOrder}
                        </span>
                      </Badge>
                    )}
                  </div>
                  {creatorLabel && <p className="text-muted-foreground">by {creatorLabel}</p>}
                  {seriesInfo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Part {seriesInfo.currentIndex + 1} of {seriesInfo.totalItems} in the{' '}
                      {displayItem.series} series
                    </p>
                  )}
                  {canEdit && (
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                      <span className={FIELD_LABEL}>id</span>
                      <input
                        value={draftId}
                        onChange={(e) => setDraftId(e.target.value)}
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Item id"
                        className="h-7 w-48 max-w-full rounded-md border border-input bg-background/70 px-2 font-mono text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <TierBadge itemId={displayItem.id} size="md" />
                  {canEdit ? (
                    <>
                      <select
                        value={draft.status}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            status: e.target.value as ReadingStatus,
                          }))
                        }
                        aria-label="Status"
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {formatStatus(s)}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1.5">
                        <span className={FIELD_LABEL}>Rating</span>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={1}
                          value={draft.rating ?? ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            setDraft((d) => ({
                              ...d,
                              rating:
                                v === '' ? null : Math.max(0, Math.min(5, Math.round(Number(v)))),
                            }));
                          }}
                          className="h-8 w-14 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </label>
                    </>
                  ) : (
                    displayItem.status !== 'completed' && (
                      <Badge
                        className={`${getStatusColor(displayItem.status)} text-xs px-2 py-0.5`}
                      >
                        {formatStatus(displayItem.status)}
                      </Badge>
                    )
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {displayItem.genre.map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>

                {canEdit ? (
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <label className="flex flex-col items-start gap-1">
                      <span className={FIELD_LABEL}>Started</span>
                      <Input
                        type="date"
                        value={draft.dateStarted}
                        onChange={(e) => setDraft((d) => ({ ...d, dateStarted: e.target.value }))}
                        className="h-8 w-auto text-xs"
                      />
                    </label>
                    <label className="flex flex-col items-start gap-1">
                      <span className={FIELD_LABEL}>Completed</span>
                      <Input
                        type="date"
                        value={draft.dateCompleted}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            dateCompleted: e.target.value,
                          }))
                        }
                        className="h-8 w-auto text-xs"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    {displayItem.dateCompleted && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Completed {formatDate(displayItem.dateCompleted)}</span>
                      </div>
                    )}
                    {displayItem.dateStarted && displayItem.status === 'in-progress' && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Started {formatDate(displayItem.dateStarted)}</span>
                      </div>
                    )}
                  </div>
                )}
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
            <p className="text-base md:text-lg leading-relaxed text-foreground/90 max-w-3xl">
              {displayItem.description}
            </p>

            {canEdit ? (
              <section>
                <SectionLabel>Notes</SectionLabel>
                <Textarea
                  value={draft.notes}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                  rows={4}
                  placeholder="Optional thoughts about this read/watch\u2026"
                  className="text-sm"
                />
              </section>
            ) : (
              displayItem.notes && (
                <section>
                  <SectionLabel>Notes</SectionLabel>
                  <div className="border-l-2 border-primary/60 pl-4 py-1">
                    <p className="text-foreground/90 leading-relaxed">{displayItem.notes}</p>
                  </div>
                </section>
              )
            )}

            {displayItem.links && Object.keys(displayItem.links).length > 0 && (
              <section>
                <SectionLabel>Links</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(displayItem.links).map(([platform, url]) =>
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
                    ) : null
                  )}
                </div>
              </section>
            )}

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
                        <div className="w-14 h-20 relative bg-muted dark:bg-black rounded-md overflow-hidden shrink-0">
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
                          <TierBadge itemId={related.id} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </motion.div>
        </div>

        {/* Dev-only save bar */}
        {canEdit && isDirty && (
          <div className="flex items-center justify-end gap-2 border-t border-amber-500/40 bg-amber-500/5 px-4 py-2.5">
            <span className="mr-auto text-[11px] font-medium uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
              Unsaved changes
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={resetDraft}
              disabled={isSaving}
              className="h-8 px-2 text-xs"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-3 text-xs"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1" />
              )}
              Save changes
            </Button>
          </div>
        )}

        {/* Prev / Next nav */}
        {hasNav && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/80 px-4 py-2.5 backdrop-blur-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('prev')}
              disabled={isTransitioning}
              className="gap-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            {currentIndex >= 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentIndex + 1} / {sortedItems.length}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('next')}
              disabled={isTransitioning}
              className="gap-1.5 disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
