'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      value={{
        light: "light",
        dark: "dark",
        olive: "olive",
        system: "light",
      }}
      themes={['light', 'dark', 'olive']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
} 