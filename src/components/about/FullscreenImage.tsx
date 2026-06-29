'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface FullscreenImageProps {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}

export default function FullscreenImage({ src, alt, caption, onClose }: FullscreenImageProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('[data-autofocus]')?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Trap focus so Tab can't reach the page behind the modal.
      if (e.key === 'Tab' && panel) {
        const focusable = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-[90vw] h-[90vh] flex flex-col items-center justify-center backdrop-blur-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[85vh] flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain select-none"
            sizes="90vw"
            priority
          />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 text-center text-white/80 text-sm max-w-2xl px-4">{caption}</div>
      </motion.div>
    </motion.div>
  );
}
