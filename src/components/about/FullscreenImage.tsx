import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

interface FullscreenImageProps {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}

export default function FullscreenImage({ src, alt, caption, onClose }: FullscreenImageProps) {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-[90vw] h-[90vh] flex flex-col items-center justify-center backdrop-blur-sm"
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
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 text-center text-white/80 text-sm max-w-2xl px-4">
          {caption}
        </div>
      </motion.div>
    </motion.div>
  );
} 