import type { ComponentType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedinIn, FaInstagram, FaShoppingBag } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { social, CONTACT_EMAIL } from '@/data/social';
import { KitNewsletterForm } from '@/components/KitNewsletterForm';
import { BackToTop } from '@/components/BackToTop';

type FooterLink = { href: string; label: string };

// Mirrors the site navigation so the footer doubles as a full sitemap.
const exploreLinks: FooterLink[] = [
  { href: '/about', label: 'About me' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/work-with-me', label: 'Work with me' },
  { href: '/contact-me', label: 'Contact me' },
];

const studioLinks: FooterLink[] = [
  { href: '/art', label: 'Art' },
  { href: '/library', label: 'Library' },
  { href: '/notion', label: 'Notion Templates' },
];

const socialLinks: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: social.github, label: 'GitHub', icon: FaGithub },
  { href: social.linkedin, label: 'LinkedIn', icon: FaLinkedinIn },
  { href: social.x, label: 'X (Twitter)', icon: FaXTwitter },
  { href: social.instagram, label: 'Instagram', icon: FaInstagram },
  { href: social.gumroad, label: 'Gumroad Shop', icon: FaShoppingBag },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-background font-heading">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link href="/" className="inline-flex w-fit items-center" aria-label="Home">
              <span className="relative block h-12 w-12">
                <Image
                  src="/logo.png"
                  alt="Yassen Shopov"
                  fill
                  sizes="48px"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo-white.png"
                  alt="Yassen Shopov"
                  fill
                  sizes="48px"
                  className="hidden object-contain dark:block"
                />
              </span>
            </Link>
            <p className="max-w-xs font-body text-sm leading-relaxed text-foreground/60">
              Developer, writer and digital artist. Building thoughtful software and sharing what I
              learn along the way.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="lg:col-span-2">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Explore
            </h2>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Studio */}
          <nav aria-label="Studio" className="lg:col-span-2">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Studio
            </h2>
            <ul className="space-y-3">
              {studioLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Stay in touch
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-foreground/60">
              Occasional notes on building, writing and creating. No spam, unsubscribe anytime.
            </p>
            <KitNewsletterForm variant="inline" />
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-start gap-4 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-sm text-foreground/50">
            &copy; {year} Yassen Shopov. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
