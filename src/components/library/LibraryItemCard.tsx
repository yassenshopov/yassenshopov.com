'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, BookOpen, Clapperboard, Monitor, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { LibraryItem } from '@/data/library';

interface LibraryItemCardProps {
  item: LibraryItem;
  onItemClick: (item: LibraryItem) => void;
  getCreatorLabel: (item: LibraryItem) => string;
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

function Stars({ rating }: { rating: number | null }) {
  if (rating == null) {
    return <span className="text-xs text-muted-foreground italic">Unrated</span>;
  }
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function LibraryItemCard({
  item,
  onItemClick,
  getCreatorLabel,
}: LibraryItemCardProps) {
  const creator = getCreatorLabel(item);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Tracks the cover URL we want to show right now. Defaults to the prop value
  // and gets updated optimistically after a successful upload. The effect keeps
  // it in sync when the prop changes (e.g. HMR after the JSON write lands).
  const [coverImage, setCoverImage] = useState(item.coverImage);
  // dragenter/dragleave fire for every child element, so track depth.
  const dragDepth = useRef(0);

  useEffect(() => {
    setCoverImage(item.coverImage);
  }, [item.coverImage]);

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
      className="group text-left flex flex-col gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-opacity"
    >
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-md bg-muted dark:bg-black transition-shadow ${
          isDragOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        }`}
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

        {COVER_EDIT_ENABLED && (isDragOver || isUploading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 text-foreground backdrop-blur-sm pointer-events-none">
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
        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
          {item.series && item.seriesOrder != null && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground align-middle">
              · {item.series} #{item.seriesOrder}
            </span>
          )}
        </h3>
        {creator && (
          <p className="text-sm text-muted-foreground line-clamp-1">by {creator}</p>
        )}
        <Stars rating={item.rating} />
      </div>
    </button>
  );
}
