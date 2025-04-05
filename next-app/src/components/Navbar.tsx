'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLogo = () => {
    if (!mounted) return '/logo.svg';
    
    switch (resolvedTheme) {
      case 'dark':
        return '/logo-white.svg';
      case 'olive':
        return '/logo.svg';
      default:
        return '/logo.svg';
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: '/blog', label: 'Blog' },
    { href: '/notion', label: 'Notion Templates' },
    { href: '/contact-me', label: 'Contact me' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/99 backdrop-blur-xl border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="w-[80px] h-[60px] relative">
            {mounted ? (
              <Image
                src={getLogo()}
                alt="Yassen Shopov Logo"
                fill
                className="hover:opacity-80 transition-opacity"
                priority
                suppressHydrationWarning
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse rounded" />
            )}
          </div>
        </Link>
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden hover:bg-accent rounded-md p-2 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <div className="flex flex-col h-full bg-background">
                <div className="border-b p-6">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <div className="w-[80px] h-[60px] relative">
                      {mounted ? (
                        <Image
                          src={getLogo()}
                          alt="Yassen Shopov Logo"
                          fill
                          className="hover:opacity-80 transition-opacity"
                          priority
                          suppressHydrationWarning
                        />
                      ) : (
                        <div className="w-full h-full bg-muted animate-pulse rounded" />
                      )}
                    </div>
                  </Link>
                </div>
                <nav className="flex-1 p-6">
                  <div className="flex flex-col space-y-4">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-foreground/60 hover:text-foreground transition-colors text-lg py-2 px-4 rounded-md hover:bg-accent/50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
                <div className="border-t p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Yassen Shopov</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 