'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useLoading } from './LoadingProvider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function Navbar() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { startLoading } = useLoading();

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

  const [isOpen, setIsOpen] = useState(false);
  // Art lives on the `art.yassenshopov.com` subdomain via middleware rewrite,
  // so we treat the link as external (skip the LoadingProvider, no prefetch).
  const links = [
    { href: '/about', label: 'About me' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: 'https://art.yassenshopov.com', label: 'Art', external: true },
    { href: '/library', label: 'Library' },
    { href: '/notion', label: 'Notion Templates' },
    { href: '/contact-me', label: 'Contact me' },
  ] as const;

  const handleLinkClick = (external?: boolean) => {
    if (!external) startLoading();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background font-heading">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => handleLinkClick(false)}>
          <div className="w-[60px] h-[60px] relative">
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
          {links.map((link) => {
            const isExternal = "external" in link && link.external;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => handleLinkClick(isExternal)}
                {...(isExternal ? { rel: "noopener" } : {})}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden hover:bg-accent rounded-md p-2 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Site navigation</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <div className="flex flex-col h-full bg-background">
                <div className="border-b p-6">
                  <Link href="/" className="flex items-center" onClick={() => handleLinkClick(false)}>
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
                    {links.map((link) => {
                      const isExternal = "external" in link && link.external;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-foreground/60 hover:text-foreground transition-colors text-lg py-2 px-4 rounded-md hover:bg-accent/50"
                          onClick={() => handleLinkClick(isExternal)}
                          {...(isExternal ? { rel: "noopener" } : {})}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
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