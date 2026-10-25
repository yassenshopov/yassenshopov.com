import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-muted/50" />
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
              <Sparkles className="size-4 text-foreground" aria-hidden />
              <span>Developer, designer, writer</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl md:leading-[0.95]">
              Building tools for focus, health, and creative work.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              I&apos;m Yassen Shopov — I ship web products, design in Notion and Figma, and write
              about life engineering. This page is the short version of how I got here.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <Link href="/work-with-me">
                  Work with me
                  <ArrowRight
                    className="ml-2 size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">See projects</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-2xl bg-linear-to-br from-primary/15 via-transparent to-muted"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/resources/images/main_page/YassenShopov.jpg"
                alt="Yassen Shopov"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 448px, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
