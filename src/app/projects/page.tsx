"use client";

import Layout from "@/components/Layout";
import TiltCard from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Palette, Sparkles, Users, Code, ArrowRight, ChevronRight, LandPlot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useEffect, useState } from "react";
import { getTechBadgeMeta, projects } from "@/components/ProjectsList";

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
    <div className="fixed top-24 right-8 z-40 hidden xl:block group">
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
          className="absolute inset-0 bg-[url('/resources/images/projects/pokemonpalette.webp')] bg-cover bg-center -z-30 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div className="absolute inset-0 bg-white/70 dark:bg-black/65 -z-20" />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/50 -z-10" />
        <div className="container mx-auto px-4">
          <TiltCard className="max-w-3xl rounded-2xl bg-card/80 dark:bg-card/70 backdrop-blur-lg border border-border/40 dark:border-white/10 p-6 md:p-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <LandPlot  className="w-4 h-4" />
              <span>Yassen's Projects</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Dashboards, MVPs, UX cleanups, and data-driven interfaces built with React, Next.js, and Tailwind.
            </p>
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
          <div className="container mx-auto px-4">
            <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
              <div className={`space-y-8 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground">
                    {project.title}
                  </h2>
                  <p className="text-xl font-medium text-primary">
                    {project.tagline}
                  </p>
                  <p className="text-muted-foreground text-lg">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {project.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="space-y-2 text-center p-4 rounded-lg bg-card">
                      <stat.icon className="w-5 h-5 mx-auto text-primary" />
                      <div className="text-2xl font-bold text-foreground">
                        <AnimatedNumber 
                          end={stat.value} 
                          suffix={stat.suffix}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => {
                    const techMeta = getTechBadgeMeta(tag);
                    const showTooltip = Boolean(techMeta.description && techMeta.linkHref);
                    return (
                      <Tooltip key={tagIndex}>
                        <TooltipTrigger asChild>
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-full text-sm border transition-colors ${techMeta.style.bg} ${techMeta.style.text} ${techMeta.style.border} ${techMeta.style.hover}`}
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

                <p className="text-muted-foreground border-l-2 border-primary pl-4 italic">
                  {project.impact}
                </p>

                <div className="flex gap-4">
                  <Button asChild size="lg" className="group">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Visit {project.title}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className={`relative ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <ProjectImageCarousel images={project.images} title={project.title} />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
} 