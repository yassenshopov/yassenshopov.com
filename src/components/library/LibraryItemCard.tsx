'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { BookOpen, Clapperboard, Monitor, Upload, Loader2, Repeat } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { type LibraryItem } from '@/data/library';
import { getCreatorLabel } from '@/lib/library-utils';
import TierBadge from './TierBadge';

interface LibraryItemCardProps {
  item: LibraryItem;
  onItemClick: (item: LibraryItem) => void;
  /**
   * Year this card occurrence represents (the year of the entry being shown).
   * Omitted for wishlist/watchlist items in the "undated" section.
   */
  entryYear?: number;
  /**
   * Total number of reading/watch entries this item has across all years.
   * When `> 1`, the card shows a re-read / first-read badge so users can see
   * that the work has been engaged with multiple times.
   */
  totalEntries?: number;
  /** True when this occurrence is the most recent entry for the item. */
  isLatestEntry?: boolean;
}

// Temporary: drag-and-drop cover replacement, dev-only. Remove this block
// (and the matching API route at src/app/api/library/upload-cover/route.ts)
// when the library data is locked down.
const COVER_EDIT_ENABLED = process.env.NODE_ENV === 'development';

function getFallbackIcon(type: LibraryItem['type']) {
  switch (type) {
    case 'book':
      return <BookOpen className="w-10 h-10" />;
    case 'movie':
      return <Clapperboard className="w-10 h-10" />;
    case 'series':
      return <Monitor className="w-10 h-10" />;
    default:
      return null;
  }
}

function CurrentlyOnLine({ type }: { type: LibraryItem['type'] }) {
  const verb = type === 'book' ? 'Reading' : 'Watching';
  return (
    <p
      className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400"
      aria-label={`Currently ${verb.toLowerCase()}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Currently {verb}
    </p>
  );
}

function LibraryItemCard({
  item,
  onItemClick,
  entryYear,
  totalEntries = item.entries?.length ?? 0,
  isLatestEntry = true,
}: LibraryItemCardProps) {
  const creator = getCreatorLabel(item);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Tracks the cover URL we want to show right now. Defaults to the prop value
  // and gets updated optimistically after a successful upload. The effect keeps
  // it in sync when the prop changes (e.g. HMR after the JSON write lands).
  const [coverImage, setCoverImage] = useState(item.coverImage);
  // Average color sampled from the cover, used as the letterbox background so
  // it blends with the artwork instead of a flat muted/black bar.
  const [coverColor, setCoverColor] = useState<string | null>(null);
  // dragenter/dragleave fire for every child element, so track depth.
  const dragDepth = useRef(0);

  useEffect(() => {
    setCoverImage(item.coverImage);
  }, [item.coverImage]);

  useEffect(() => {
    if (!coverImage) {
      setCoverColor(null);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = coverImage;
    img.onload = () => {
      if (cancelled) return;
      try {
        const w = 16;
        const h = 16;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 16) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }
        if (count === 0) return;
        setCoverColor(
          `rgba(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)}, 0.75)`
        );
      } catch {
        // Canvas can taint on cross-origin sources; fall back to default bg.
      }
    };
    return () => {
      cancelled = true;
    };
  }, [coverImage]);

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Drop an image file (jpg, png, webp, gif, avif).');
      return;
    }
    const form = new FormData();
    form.append('id', item.id);
    form.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading(`Replacing cover for "${item.title}"…`);
    try {
      const res = await fetch('/api/library/upload-cover', {
        method: 'POST',
        body: form,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      if (typeof body.coverImage === 'string') {
        setCoverImage(body.coverImage);
      }
      toast.success('Cover replaced.', { id: toastId });
    } catch (err) {
      toast.error(`Upload failed: ${(err as Error).message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  const dragHandlers = COVER_EDIT_ENABLED
    ? {
        onDragEnter: (e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          e.stopPropagation();
          dragDepth.current += 1;
          setIsDragOver(true);
        },
        onDragLeave: (e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          e.stopPropagation();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setIsDragOver(false);
          }
        },
        onDragOver: (e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'copy';
        },
        onDrop: (e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          e.stopPropagation();
          dragDepth.current = 0;
          setIsDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) void uploadFile(file);
        },
      }
    : {};

  return (
    <button
      type="button"
      onClick={() => {
        if (isDragOver || isUploading) return;
        onItemClick(item);
      }}
      {...dragHandlers}
      className="group text-left flex flex-col gap-3 rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-opacity"
    >
      <div
        style={coverColor ? { backgroundColor: coverColor } : undefined}
        className={`relative aspect-video w-full overflow-hidden rounded-md transition-colors duration-500 ${
          coverColor ? '' : 'bg-muted dark:bg-black'
        } ${isDragOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {getFallbackIcon(item.type)}
          </div>
        )}

        {/* Re-read / re-watch badge: surfaced when a work has more than one
            recorded engagement. The grid renders one card per year, so this
            tells the reader the work recurs across the library. */}
        {totalEntries > 1 && (
          <span
            className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs ring-1 ring-border backdrop-blur-xs"
            aria-label={`${isLatestEntry ? 'Most recent of' : 'One of'} ${totalEntries} ${
              item.type === 'book' ? 'readings' : 'viewings'
            }${entryYear ? ` (${entryYear})` : ''}`}
          >
            <Repeat className="h-3 w-3" aria-hidden="true" />
            {totalEntries}&times;
          </span>
        )}

        {COVER_EDIT_ENABLED && (isDragOver || isUploading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 text-foreground backdrop-blur-xs pointer-events-none">
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Drop to replace cover</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex min-h-17 flex-col gap-1">
          <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
            {item.series && item.seriesOrder != null && (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground align-middle">
                · {item.series} #{item.seriesOrder}
              </span>
            )}
          </h3>
          {creator && <p className="text-sm text-muted-foreground line-clamp-1">by {creator}</p>}
        </div>
        <div className="flex min-h-6 items-center justify-between gap-2">
          <TierBadge itemId={item.id} />
          {item.status === 'in-progress' && <CurrentlyOnLine type={item.type} />}
        </div>
      </div>
    </button>
  );
}

// Memoized: the library grid can mount dozens of cards, and a search keystroke
// re-renders the list. Props are stable per occurrence (`onItemClick` is the
// setState identity), so memo skips re-rendering unchanged cards — and avoids
// re-running each card's cover color-sampling effect.
export default memo(LibraryItemCard);
