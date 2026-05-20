"use client";

import { Moon, Sun, Leaf } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useCallback } from "react";

type AppTheme = "light" | "dark" | "olive";

// Browsers that support startViewTransition (Chrome/Edge/Safari TP) animate the
// theme swap via a circular clip-path that emanates from the click coordinates.
// Everything else just swaps themes synchronously.
type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchTheme = useCallback(
    (nextTheme: AppTheme, event: React.MouseEvent) => {
      if (typeof document === "undefined") {
        setTheme(nextTheme);
        return;
      }

      const doc = document as DocumentWithViewTransition;
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!doc.startViewTransition || prefersReducedMotion) {
        setTheme(nextTheme);
        return;
      }

      const { clientX: x, clientY: y } = event;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Coordinates and target radius drive the @keyframes in globals.css.
      const root = document.documentElement;
      root.style.setProperty("--theme-transition-x", `${x}px`);
      root.style.setProperty("--theme-transition-y", `${y}px`);
      root.style.setProperty("--theme-transition-r", `${endRadius}px`);

      doc.startViewTransition(() => {
        setTheme(nextTheme);
      });
    },
    [setTheme]
  );

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <div className="w-5 h-5 bg-muted animate-pulse rounded" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (resolvedTheme) {
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "olive":
        return <Leaf className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => switchTheme("light", e)}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => switchTheme("dark", e)}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => switchTheme("olive", e)}>
          <Leaf className="mr-2 h-4 w-4" />
          <span>Olive</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
