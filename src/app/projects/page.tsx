"use client";

import Layout from "@/components/Layout";
import TiltCard from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, ArrowRight, ChevronRight, LandPlot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useEffect, useState } from "react";
import { getTechBadgeMeta, projectTagPaddingXClass, projects } from "@/components/ProjectsList";

function ProjectImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;

  const goToImage = (nextIndex: number) => {
    if (totalImages === 0) return;
    const wrappedIndex = (nextIndex + totalImages) % totalImages;
    setActiveIndex(wrappedIndex);
  };

  if (totalImages === 0) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted" />
    );
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <Image
        src={images[activeIndex]}
        alt={`${title} preview ${activeIndex + 1}`}
        fill
        className="object-cover object-top"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
      />
      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => goToImage(activeIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 transition hover:bg-black/70"
            aria-label={`Previous ${title} image`}
          >
            <span className="sr-only">Previous</span>
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goToImage(activeIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 transition hover:bg-black/70"
            aria-label={`Next ${title} image`}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1">
            {images.map((_, index) => (
              <button
                key={`${title}-image-${index}`}
                type="button"
                onClick={() => goToImage(index)}
                className={`h-2 w-2 rounded-full transition ${
                  index === activeIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Show ${title} image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    projects.forEach((project) => {
      const element = document.getElementById(project.title.toLowerCase());
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToProject = (projectId: string) => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-24 right-8 z-40 hidden md:block group">
      {/* Minimal lines version (shown by default) */}
      <div className="absolute right-0 top-0 group-hover:opacity-0 group-hover:invisible transition-all duration-300 bg-card/80 backdrop-blur-lg rounded-lg p-2 shadow-lg border border-border">
        <nav className="space-y-3">
          {projects.map((project) => {
            const projectId = project.title.toLowerCase();
            return (
              <button
                key={projectId}
                onClick={() => scrollToProject(projectId)}
                className="block w-5 h-[2px] rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeSection === projectId 
                    ? 'var(--primary)' 
                    : 'var(--muted-foreground)',
                  opacity: activeSection === projectId ? 1 : 0.3,
                  width: activeSection === projectId ? '20px' : '12px'
                }}
                aria-label={`Scroll to ${project.title}`}
              />
            );
          })}
        </nav>
      </div>

      {/* Expanded version (shown on hover) */}
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 bg-card/80 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-border min-w-[200px]">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">ON THIS PAGE</h3>
        <nav className="space-y-1">
          {projects.map((project) => {
            const projectId = project.title.toLowerCase();
            return (
              <button
                key={projectId}
                onClick={() => scrollToProject(projectId)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === projectId
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeSection === projectId ? "rotate-90" : ""
                }`} />
                {project.title}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState<{ projectIndex: number; imageIndex: number } | null>(null);
  const handleScrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleOpenImage = (projectIndex: number, imageIndex: number) => {
    setSelectedPreview({ projectIndex, imageIndex });
  };
  const handleNextImage = (direction: 1 | -1) => {
    if (!selectedPreview) return;
    const images = projects[selectedPreview.projectIndex]?.images ?? [];
    if (images.length === 0) return;
    const nextIndex = (selectedPreview.imageIndex + direction + images.length) % images.length;
    setSelectedPreview({ projectIndex: selectedPreview.projectIndex, imageIndex: nextIndex });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    const prevRootBehavior = root.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    root.style.scrollBehavior = behavior;
    body.style.scrollBehavior = behavior;

    return () => {
      root.style.scrollBehavior = prevRootBehavior;
      body.style.scrollBehavior = prevBodyBehavior;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setParallaxOffset(0);
      return;
    }

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        setParallaxOffset(window.scrollY * 0.25);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Layout>
      <TableOfContents />
      
      {/* Hero Section */}
      <section className="relative min-h-[45vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/resources/images/projects/hero-image.png')] bg-cover bg-center -z-30 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/45 to-transparent dark:from-black/60 dark:via-black/40 dark:to-transparent olive:from-black/70 olive:via-black/45 olive:to-transparent -z-20" />
        <div className="container mx-auto px-4">
          <TiltCard className="max-w-2xl rounded-2xl bg-card dark:bg-card olive:bg-card backdrop-blur-lg p-6 md:p-10 md:ml-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <LandPlot  className="w-4 h-4" />
              <span>Yassen's Projects</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-foreground max-w-2xl">
              Dashboards, MVPs, UX cleanups, and data-driven interfaces built with React, Next.js, and Tailwind.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="group" onClick={handleScrollToContact}>
                Work with me
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Projects Sections */}
      {projects.map((project, index) => (
        <section 
          key={index} 
          id={project.title.toLowerCase()}
          className={`py-32 ${index % 2 === 0 ? 'bg-background' : 'bg-muted'} scroll-mt-16`}
        >
          <div className="container mx-auto px-6 md:px-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-semibold text-center text-foreground mb-12">
                {project.title}
              </h3>
              <div
                className={`mt-6 grid gap-6 lg:grid-rows-2 ${
                  index % 2 === 0 ? "lg:grid-cols-[2fr_1fr]" : "lg:grid-cols-[1fr_2fr]"
                }`}
              >
                <button
                  type="button"
                  className={`relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:row-span-2 lg:min-h-[420px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                  }`}
                  onClick={() => project.images[0] && handleOpenImage(index, 0)}
                  disabled={!project.images[0]}
                >
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} product display`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  ) : (
                    <div className="aspect-[16/9] bg-muted" />
                  )}
                </button>
                <button
                  type="button"
                  className={`relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[200px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                  }`}
                  onClick={() => project.images[1] && handleOpenImage(index, 1)}
                  disabled={!project.images[1]}
                >
                  {project.images[1] ? (
                    <Image
                      src={project.images[1]}
                      alt={`${project.title} product display detail`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="aspect-[16/9] bg-muted" />
                  )}
                </button>
                <button
                  type="button"
                  className={`relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[200px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? "lg:order-3" : "lg:order-2"
                  }`}
                  onClick={() => project.images[2] && handleOpenImage(index, 2)}
                  disabled={!project.images[2]}
                >
                  {project.images[2] ? (
                    <Image
                      src={project.images[2]}
                      alt={`${project.title} product display closeup`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="aspect-[16/9] bg-muted" />
                  )}
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => {
                    const techMeta = getTechBadgeMeta(tag);
                    const showTooltip = Boolean(techMeta.description && techMeta.linkHref);
                    return (
                      <Tooltip key={tagIndex}>
                        <TooltipTrigger asChild>
                          <span
                            className={`inline-flex items-center gap-2 ${projectTagPaddingXClass} py-2 font-medium rounded-full text-sm border transition-colors ${techMeta.style.bg} ${techMeta.style.text} ${techMeta.style.border} ${techMeta.style.hover}`}
                          >
                            {techMeta.iconSrc && (
                              <Image
                                src={techMeta.iconSrc}
                                alt={`${techMeta.label} icon`}
                                width={16}
                                height={16}
                                className="h-4 w-4"
                              />
                            )}
                            <span>{techMeta.label}</span>
                          </span>
                        </TooltipTrigger>
                        {showTooltip && (
                          <TooltipContent side="top" className="w-max text-center text-xs leading-relaxed">
                            <span className="inline-block">
                              {techMeta.description}{" "}
                              <Link
                                href={techMeta.linkHref!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-primary-foreground/80"
                              >
                                {techMeta.linkLabel ?? "Learn more"}
                              </Link>
                            </span>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uppercase tracking-[0.2em] inline-flex items-center gap-2"
                  >
                    Visit Project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-muted-foreground text-lg max-w-3xl">
                {project.description}
              </p>
              <div className="mt-6 max-w-3xl rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Project Stats
                  </h4>
                </div>
                {project.stats.length > 0 ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.stats.map((stat, statIndex) => {
                      const Icon = stat.icon;
                      const decimals = Number.isInteger(stat.value) ? 0 : 1;
                      return (
                        <div
                          key={`${project.title}-stat-${statIndex}`}
                          className="flex items-center gap-3 rounded-lg bg-background/60 p-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xl font-semibold text-foreground">
                              <AnimatedNumber end={stat.value} suffix={stat.suffix} decimals={decimals} />
                            </div>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Stats coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      <Dialog
        open={Boolean(selectedPreview)}
        onOpenChange={(open) => !open && setSelectedPreview(null)}
      >
        <DialogContent className="flex h-screen w-screen max-w-none items-center justify-center border-none bg-transparent p-4 shadow-none">
          <DialogTitle className="sr-only">Project image preview</DialogTitle>
          <div className="relative flex h-full w-full items-center justify-center">
            {selectedPreview && projects[selectedPreview.projectIndex]?.images?.length > 0 && (
              <img
                src={projects[selectedPreview.projectIndex].images[selectedPreview.imageIndex]}
                alt={`${projects[selectedPreview.projectIndex].title} image ${
                  selectedPreview.imageIndex + 1
                }`}
                className="max-h-[88vh] w-auto max-w-[96vw] rounded-xl object-contain shadow-2xl"
              />
            )}
            {selectedPreview && projects[selectedPreview.projectIndex]?.images?.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => handleNextImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Previous image"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNextImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 transition hover:bg-black/80"
                  aria-label="Next image"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section id="contact" className="py-24 bg-background scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="space-y-10">
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mx-auto">
                <Sparkles className="w-4 h-4" />
                <span>Let&apos;s build something</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Want to work with me?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mx-auto max-w-2xl">
                If you&apos;re building a product, refreshing a UI, or want a fast-moving partner, I&apos;m in. 
                Tell me what you&apos;re aiming for and I&apos;ll send ideas, timelines, and a clear next step.
              </p>
            </div>
            <iframe
              title="Schedule time with Yassen"
              src="https://cal.com/yassen-shopov-spd1ms?embed=1"
              className="h-[720px] w-full rounded-2xl border border-border/60 bg-background"
              loading="lazy"
            />
            <div className="space-y-3 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="mailto:yassenshopov00@gmail.com">
                  Email yassenshopov00@gmail.com
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Prefer async? Send a quick overview and I&apos;ll reply within 1-2 days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 