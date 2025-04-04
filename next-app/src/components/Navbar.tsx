'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navbar() {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light' || !theme;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="w-[80px] h-[60px] relative">
            <Image
              src={isLightTheme ? "/logo.svg" : "/logo-white.svg"}
              alt="Yassen Shopov Logo"
              fill
              className="hover:opacity-80 transition-opacity"
              priority
            />
          </div>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/blog" className="text-foreground/60 hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/notion" className="text-foreground/60 hover:text-foreground transition-colors">
            Notion Templates
          </Link>
          <Link href="/contact-me" className="text-foreground/60 hover:text-foreground transition-colors">
            Contact me
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
} 