"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Mail,
  Palette,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const TOTAL_IMAGES = 24;

const artworks = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
  const n = i + 1;
  return {
    src: `/resources/images/art/img${n}.webp`,
    alt: `Yassen Shopov digital artwork #${n}`,
  };
});

const INSTAGRAM_URL = "https://www.instagram.com/kofiscrib/";
const PATREON_URL = "https://www.patreon.com/kofiscrib/";
const REDBUBBLE_URL =
  "https://www.redbubble.com/people/kofiscrib/explore?asc=u&page=1&sortOrder=recent";
const COMMISSION_EMAIL = "yassenshopov00@gmail.com";

type CommissionPieceType = "character" | "illustration" | "cover" | "other";

const PIECE_OPTIONS: { value: CommissionPieceType; label: string }[] = [
  { value: "character", label: "Character art" },
  { value: "illustration", label: "Full illustration" },
  { value: "cover", label: "Cover / banner" },
  { value: "other", label: "Other" },
];

export default function ArtPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Commission form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pieceType, setPieceType] = useState<CommissionPieceType>("character");
  const [deadline, setDeadline] = useState("");
  const [brief, setBrief] = useState("");

  const closeLightbox = () => setLightboxIndex(null);

  const showImage = (offset: 1 | -1) => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current + offset + artworks.length) % artworks.length;
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((c) =>
          c === null ? c : (c + 1) % artworks.length
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((c) =>
          c === null ? c : (c - 1 + artworks.length) % artworks.length
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const mailtoHref = useMemo(() => {
    const subject = `Commission inquiry — ${
      PIECE_OPTIONS.find((p) => p.value === pieceType)?.label ?? "Artwork"
    }`;
    const body = [
      `Hi Yassen,`,
      ``,
      `Name: ${name || "(your name)"}`,
      `Reply email: ${email || "(your email)"}`,
      `Piece type: ${
        PIECE_OPTIONS.find((p) => p.value === pieceType)?.label ?? pieceType
      }`,
      `Deadline / timing: ${deadline || "(flexible)"}`,
      ``,
      `Brief:`,
      brief || "(describe the piece, reference images, vibe, size, usage…)",
    ].join("\n");
    return `mailto:${COMMISSION_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [name, email, pieceType, deadline, brief]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
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
                A growing archive of digital illustrations, character work, and
                commissioned pieces — formerly homed at{" "}
                <span className="line-through opacity-70">kofiscrib.com</span>,
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
                    <Instagram className="w-4 h-4" />
                    Follow on Instagram
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {[0, 6, 12, 18].map((idx, i) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-2xl border border-border/60 ${
                      i % 2 === 0 ? "translate-y-6" : "-translate-y-2"
                    }`}
                    style={{ aspectRatio: "3 / 4" }}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="py-16 md:py-24 bg-background scroll-mt-16"
      >
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
              <Instagram className="w-4 h-4" />
              See latest work on Instagram
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* CSS columns masonry — natural fit for mixed aspect ratios */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            {artworks.map((art, i) => (
              <button
                key={art.src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="mb-4 block w-full overflow-hidden rounded-xl border border-border/60 bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group"
                aria-label={`Open ${art.alt}`}
              >
                <Image
                  src={art.src}
                  alt={art.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  loading={i < 4 ? "eager" : "lazy"}
                  priority={i < 4}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram + elsewhere band */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <Instagram className="w-7 h-7 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Instagram
              </h3>
              <p className="text-muted-foreground text-sm">
                The most up-to-date feed of finished pieces, work-in-progress,
                and process timelapses.
              </p>
              <Button asChild variant="outline" className="mt-auto w-fit">
                <Link
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @kofiscrib
                </Link>
              </Button>
            </Card>
            <Card className="p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <Sparkles className="w-7 h-7 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Patreon
              </h3>
              <p className="text-muted-foreground text-sm">
                Behind-the-scenes layered files, brush packs, and early access
                to new pieces.
              </p>
              <Button asChild variant="outline" className="mt-auto w-fit">
                <Link
                  href={PATREON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Patreon
                </Link>
              </Button>
            </Card>
            <Card className="p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <Palette className="w-7 h-7 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Prints & Merch
              </h3>
              <p className="text-muted-foreground text-sm">
                Select pieces available as prints, shirts, stickers, and more
                via Redbubble.
              </p>
              <Button asChild variant="outline" className="mt-auto w-fit">
                <Link
                  href={REDBUBBLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop on Redbubble
                </Link>
              </Button>
            </Card>
          </div>
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
                Let's make
                <br />
                something custom
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Character portraits, full illustrations, covers, banners — tell
                me what you have in mind and I'll reply with availability,
                pricing, and a clear timeline.
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = mailtoHref;
                }}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="art-name"
                      className="text-sm font-medium text-foreground"
                    >
                      Your name
                    </label>
                    <Input
                      id="art-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Doe"
                      required
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="art-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <Input
                      id="art-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-background/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Type of piece
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PIECE_OPTIONS.map((opt) => {
                      const selected = pieceType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPieceType(opt.value)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-accent"
                          }`}
                          aria-pressed={selected}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="art-deadline"
                    className="text-sm font-medium text-foreground"
                  >
                    Deadline (optional)
                  </label>
                  <Input
                    id="art-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. by end of June, or flexible"
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="art-brief"
                    className="text-sm font-medium text-foreground"
                  >
                    Brief
                  </label>
                  <Textarea
                    id="art-brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Describe the piece — characters, vibe, references, intended use, size…"
                    required
                    className="min-h-[160px] bg-background/60"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group">
                  Send via email
                  <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Opens your email client with the brief pre-filled — no inbox
                  needed on my side beyond what you send.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent className="flex h-screen w-screen max-w-none items-center justify-center border-none bg-transparent p-4 shadow-none">
          <DialogTitle className="sr-only">Artwork preview</DialogTitle>
          <div className="relative flex h-full w-full items-center justify-center">
            {lightboxIndex !== null && (
              <img
                src={artworks[lightboxIndex].src}
                alt={artworks[lightboxIndex].alt}
                className="max-h-[88vh] w-auto max-w-[96vw] rounded-xl object-contain shadow-2xl"
              />
            )}
            {lightboxIndex !== null && artworks.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {lightboxIndex + 1} / {artworks.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
