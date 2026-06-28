import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeAbout() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Overlapping cards visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute inset-0 -rotate-6 rounded-3xl"
              style={{ backgroundColor: '#8FCAD9' }}
            />
            <div
              aria-hidden
              className="absolute inset-0 rotate-6 rounded-3xl"
              style={{ backgroundColor: '#E8552D' }}
            />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/resources/images/main_page/YassenShopov.jpg"
                  alt="Yassen Shopov"
                  fill
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-3 sm:-right-5 flex items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-lg ring-1 ring-border">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-card-foreground">
                Building in public since 2020
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
                Hey, I&apos;m Yassen
              </h2>
              <div className="hidden sm:block flex-1 h-px bg-border" />
            </div>
            <div className="space-y-4 text-muted-foreground md:text-lg">
              <p>
                A front-end &amp; product engineer based in Sofia, Bulgaria. By day I build the
                product at an AI recruiting startup; on the side I ship my own apps and write.
              </p>
              <p>
                I studied Biomedical Engineering in Glasgow, fell for the web during lockdown, and
                have been building in public ever since &mdash; Notion systems, side-projects with
                real users, and a weekly newsletter called{' '}
                <Link
                  href="/blog"
                  className="font-medium text-foreground underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
                >
                  Life Engineering
                </Link>
                .
              </p>
              <p>
                I care about fast, honest software and interfaces that feel good to use. If it ships
                and someone&apos;s day gets a little easier, that&apos;s the whole point.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <Link href="/about">
                  My story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/blog">Read the newsletter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
