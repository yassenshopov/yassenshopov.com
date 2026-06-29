'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { artworks } from '@/data/art';

/**
 * The interactive gallery grid plus its full-screen lightbox. Isolated as a
 * client island so the rest of the art page (hero, copy, follow band) can stay
 * a Server Component. Also owns the page's smooth-scroll preference for the
 * in-page anchor jumps, scoped to this route via cleanup on unmount.
 */
export function ArtGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIndex(null);

  const showImage = (offset: 1 | -1) => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current + offset + artworks.length) % artworks.length;
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setLightboxIndex((c) => (c === null ? c : (c + 1) % artworks.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((c) => (c === null ? c : (c - 1 + artworks.length) % artworks.length));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  // Enable smooth scrolling while on this page (e.g. for the in-page "Commission
  // a piece" anchor jump), but honour `prefers-reduced-motion` and restore the
  // prior behaviour on unmount so we don't leak the setting to other routes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    const prevRootBehavior = root.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';

    root.style.scrollBehavior = behavior;
    body.style.scrollBehavior = behavior;

    return () => {
      root.style.scrollBehavior = prevRootBehavior;
      body.style.scrollBehavior = prevBodyBehavior;
    };
  }, []);

  return (
    <>
      {/* CSS columns masonry — natural fit for mixed aspect ratios. The grid is */}
      {/* full-bleed (no container padding) for an edge-to-edge gallery wall. */}
      <div className="gallery-flush columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 [column-fill:balance]">
        {artworks.map((art, i) => {
          return (
            <button
              key={art.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="gallery-tile relative mb-2 block w-full overflow-hidden rounded-sm bg-card focus-visible:outline-hidden focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60 group"
              aria-label={`Open ${art.alt}`}
            >
              <Image
                src={art.src}
                alt={art.alt}
                width={800}
                height={1000}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="block h-auto w-full transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03]"
                loading={i < 4 ? 'eager' : 'lazy'}
                priority={i < 4}
              />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="flex h-screen w-screen max-w-none items-center justify-center border-none bg-transparent p-4 shadow-none">
          <DialogTitle className="sr-only">Artwork preview</DialogTitle>
          <div className="relative flex h-full w-full items-center justify-center">
            {lightboxIndex !== null && (
              // Full-screen lightbox sizes to the image's natural aspect ratio
              // (w-auto + object-contain), which next/image's fixed/fill modes
              // can't express cleanly. Plain <img> is correct here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artworks[lightboxIndex].src}
                alt={artworks[lightboxIndex].alt}
                className="max-h-[88vh] w-auto max-w-[96vw] rounded-xl object-contain shadow-2xl"
              />
            )}
            {lightboxIndex !== null && artworks.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {lightboxIndex + 1} / {artworks.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
