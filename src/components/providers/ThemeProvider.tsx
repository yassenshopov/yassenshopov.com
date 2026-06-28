'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import { MotionConfig } from 'framer-motion';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      value={{
        light: 'light',
        dark: 'dark',
        olive: 'olive',
        system: 'light',
      }}
      themes={['light', 'dark', 'olive']}
      {...props}
    >
      {/* Honour the OS "reduce motion" setting globally: framer-motion will
          drop transform/layout animations for users who ask for it. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
