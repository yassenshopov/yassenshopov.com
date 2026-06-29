import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArtGallery } from '@/components/art/ArtGallery';
import { CommissionForm } from '@/components/art/CommissionForm';
import { ArrowRight, Mail, Palette, Sparkles } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { artworks, TOTAL_IMAGES, INSTAGRAM_URL, COMMISSION_EMAIL, HERO_TILES } from '@/data/art';

export default function ArtPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Palette className="w-4 h-4" />
                <span>Digital Art Portfolio</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground">
                Art by
                <br />
                Yassen Shopov
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A growing archive of digital illustrations, character work, and commissioned pieces
                — formerly homed at <span className="line-through opacity-70">kofiscrib.com</span>,
                now living here.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="group">
                  <Link href="#commissions">
                    Commission a piece
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <FaInstagram className="w-4 h-4" />
                    Follow on Instagram
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {HERO_TILES.map(({ idx, baseY }, i) => {
                  return (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-2xl border border-border/60"
                      style={{
                        aspectRatio: '3 / 4',
                        transform: `translateY(${baseY}px)`,
                      }}
                    >
                      <Image
                        src={artworks[idx].src}
                        alt={artworks[idx].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 0vw, 25vw"
                        priority={i === 0}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 md:py-24 bg-background scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Gallery
              </h2>
              <p className="text-muted-foreground mt-2">
                {TOTAL_IMAGES} pieces — click any image to view it larger.
              </p>
            </div>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
              See latest work on Instagram
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <ArtGallery />
      </section>

      {/* Follow band */}
      <section className="py-14 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <Card className="p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <FaInstagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground">
                  Follow along on Instagram
                </h3>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  Finished pieces, works-in-progress, and process timelapses — always the freshest
                  feed.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="group w-fit md:shrink-0">
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <FaInstagram className="w-4 h-4" />
                @kofiscrib
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Commissions */}
      <section id="commissions" className="py-20 md:py-28 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Commissions are open</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Let&apos;s make
                <br />
                something custom
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Character portraits, full illustrations, covers, banners — tell me what you have in
                mind and I&apos;ll reply with availability, pricing, and a clear timeline.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  Quick turnaround — most pieces ship in 1–3 weeks.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  WIP previews at sketch and color stages so we stay aligned.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  High-res file delivery, plus layered files on request.
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href={`mailto:${COMMISSION_EMAIL}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {COMMISSION_EMAIL}
                </Link>
              </div>
            </div>

            <Card className="p-6 md:p-8 backdrop-blur-xl bg-card/60">
              <CommissionForm />
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
