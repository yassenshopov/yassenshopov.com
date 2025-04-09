'use client';

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

export function LoadingOverlay() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLogo = () => {
    if (!mounted) return '/logo.png';
    
    switch (resolvedTheme) {
      case 'dark':
        return '/logo-white.png';
      case 'olive':
        return '/logo.png';
      default:
        return '/logo.png';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-lg"
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, 0, -10, 10, 0],
          }}
          transition={{ 
            duration: 0.5,
            rotate: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }
          }}
          className="relative w-[100px] h-[100px]"
        >
          <Image
            src={getLogo()}
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 