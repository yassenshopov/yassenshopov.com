'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChevronDown, LayoutTemplate, Library, Menu, Palette, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLoading } from './LoadingProvider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type NavLink = {
  href: string;
  label: string;
};

type StudioLink = NavLink & {
  icon: LucideIcon;
  description: string;
};

// Primary links shown directly in the bar. The "Studio" group below collects
// the more personal/creative corners so the bar stays focused on the core
// professional path (about → blog → projects → contact).
const primaryLinks: NavLink[] = [
  { href: '/about', label: 'About me' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
];

const studioLinks: StudioLink[] = [
  {
    href: '/art',
    label: 'Art',
    icon: Palette,
    description: 'Digital illustration & commissions',
  },
  {
    href: '/library',
    label: 'Library',
    icon: Library,
    description: 'Books & media I rate and recommend',
  },
  {
    href: '/notion',
    label: 'Notion Templates',
    icon: LayoutTemplate,
    description: 'Productivity systems & dashboards',
  },
];

const workLink: NavLink = { href: '/work-with-me', label: 'Work with me' };
const contactLink: NavLink = { href: '/contact-me', label: 'Contact me' };

export function Navbar() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
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

  const isStudioActive = studioLinks.some((link) => pathname?.startsWith(link.href));

  const handleLinkClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    startLoading();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background font-heading">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={handleLinkClick}>
          <div className="w-[60px] h-[60px] relative">
            {mounted ? (
              <Image
                src={getLogo()}
                alt="Yassen Shopov"
                fill
                sizes="60px"
                className="hover:opacity-80 transition-opacity"
                priority
                suppressHydrationWarning
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse rounded" />
            )}
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className={`group inline-flex items-center gap-1 outline-hidden transition-colors hover:text-foreground focus-visible:text-foreground ${
                isStudioActive ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Studio
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-72">
              {studioLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <DropdownMenuItem key={link.href} asChild className="gap-3 p-2.5">
                    <Link href={link.href} onClick={handleLinkClick}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-foreground">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                        <span className="text-xs text-muted-foreground">{link.description}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={contactLink.href}
            className="text-foreground/60 hover:text-foreground transition-colors"
            onClick={handleLinkClick}
          >
            {contactLink.label}
          </Link>

          <Link
            href={workLink.href}
            className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={handleLinkClick}
          >
            {workLink.label}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden hover:bg-accent rounded-md p-2 transition-colors"
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Site navigation</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <div id="mobile-nav" className="flex flex-col h-full bg-background">
                <div className="border-b p-6">
                  <Link href="/" className="flex items-center" onClick={handleLinkClick}>
                    <div className="w-[80px] h-[60px] relative">
                      {mounted ? (
                        <Image
                          src={getLogo()}
                          alt="Yassen Shopov"
                          fill
                          sizes="80px"
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
                <nav className="flex-1 p-6" aria-label="Mobile navigation">
                  <div className="flex flex-col space-y-4">
                    {primaryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-foreground/60 hover:text-foreground transition-colors text-lg py-2 px-4 rounded-md hover:bg-accent/50"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </Link>
                    ))}

                    <div className="pt-2">
                      <span className="block px-4 pb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Studio
                      </span>
                      <div className="flex flex-col space-y-1">
                        {studioLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-accent/50"
                              onClick={handleLinkClick}
                            >
                              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <Link
                      href={contactLink.href}
                      className="text-foreground/60 hover:text-foreground transition-colors text-lg py-2 px-4 rounded-md hover:bg-accent/50"
                      onClick={handleLinkClick}
                    >
                      {contactLink.label}
                    </Link>

                    <Link
                      href={workLink.href}
                      className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      onClick={handleLinkClick}
                    >
                      {workLink.label}
                    </Link>
                  </div>
                </nav>
                <div className="border-t p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} Yassen Shopov
                    </span>
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
