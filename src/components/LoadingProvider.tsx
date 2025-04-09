'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "./LoadingOverlay";

type LoadingContextType = {
  startLoading: () => void;
  stopLoading: () => void;
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  // Auto-stop loading after maximum duration
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        stopLoading();
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading }}>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  );
} 