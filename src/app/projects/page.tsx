'use client';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useEffect, useState } from 'react';
import { getTechBadgeMeta, projects } from '@/data/projects';
import { TechBadge } from '@/components/TechBadge';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { ProjectsOverview } from '@/components/projects/ProjectsOverview';

export default function ProjectsPage() {
  const [selectedPreview, setSelectedPreview] = useState<{
    projectIndex: number;
    imageIndex: number;
  } | null>(null);

  const heroThumbnails = projects.flatMap((project) => project.images);
  const techCount = new Set(projects.flatMap((project) => project.tags)).size;
  const liveCount = projects.filter((project) => Boolean(project.liveUrl)).length;

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
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    const prevRootBehavior = root.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';

    root.style.scrollBehavior = behavior;
    body.style.scrollBehavior = behavior;

    return () => {
      root.style.scrollBehavior = prevRootBehavior;
      body.style.scrollBehavior = prevBodyBehavior;
    };
  }, []);

  return (
    <Layout>
      <ProjectsHero
        projectCount={projects.length}
        techCount={techCount}
        liveCount={liveCount}
        thumbnails={heroThumbnails}
      />

      <ProjectsOverview />

      {/* Projects deep dives */}
      {projects.map((project, index) => (
        <section
          key={project.title}
          id={project.title.toLowerCase()}
          className={`py-20 md:py-28 ${index % 2 === 0 ? 'bg-muted' : 'bg-background'} scroll-mt-16`}
        >
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Section header — index + title + divider, aligned to the redesign system */}
              <div className="flex items-end gap-6 mb-3" aria-label={project.title}>
                <h3 className="flex items-baseline gap-3 text-4xl md:text-5xl font-bold tracking-tighter leading-none text-foreground">
                  <span className="font-mono text-xl md:text-2xl text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {project.title}
                </h3>
                <div className="flex-1 pb-2">
                  <div className="h-px bg-border" />
                </div>
              </div>
              <p className="mb-10 text-lg text-muted-foreground">{project.tagline}</p>

              <div
                className={`mt-6 grid gap-0 lg:grid-rows-2 ${
                  index % 2 === 0 ? 'lg:grid-cols-[2fr_1fr]' : 'lg:grid-cols-[1fr_2fr]'
                }`}
              >
                <button
                  type="button"
                  className={`relative h-full overflow-hidden bg-card aspect-video sm:aspect-4/3 lg:aspect-auto lg:row-span-2 lg:min-h-[420px] transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
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
                    <div className="aspect-video bg-muted" />
                  )}
                </button>
                <button
                  type="button"
                  className={`relative h-full overflow-hidden bg-card aspect-video sm:aspect-4/3 lg:aspect-auto lg:min-h-[200px] transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
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
                    <div className="aspect-video bg-muted" />
                  )}
                </button>
                <button
                  type="button"
                  className={`relative h-full overflow-hidden bg-card aspect-video sm:aspect-4/3 lg:aspect-auto lg:min-h-[200px] transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    index % 2 === 0 ? 'lg:order-3' : 'lg:order-2'
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
                    <div className="aspect-video bg-muted" />
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
                          <TechBadge tag={tag} size="md" className="cursor-default" />
                        </TooltipTrigger>
                        {showTooltip && (
                          <TooltipContent
                            side="top"
                            className="w-max text-center text-xs leading-relaxed"
                          >
                            <span className="inline-block">
                              {techMeta.description}{' '}
                              <Link
                                href={techMeta.linkHref!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-primary-foreground/80"
                              >
                                {techMeta.linkLabel ?? 'Learn more'}
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
              <p className="mt-4 text-muted-foreground text-lg max-w-3xl">{project.description}</p>
              {project.stats.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
                  {project.stats.map((stat, statIndex) => {
                    const decimals = Number.isInteger(stat.value) ? 0 : 1;
                    return (
                      <div key={`${project.title}-stat-${statIndex}`}>
                        <div className="text-2xl md:text-3xl font-bold text-foreground">
                          <AnimatedNumber
                            end={stat.value}
                            suffix={stat.suffix}
                            decimals={decimals}
                          />
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
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
              // Full-screen lightbox sizes to the image's natural aspect ratio
              // (w-auto + object-contain); next/image's fill/fixed modes can't
              // express that cleanly. Plain <img> is correct here.
              // eslint-disable-next-line @next/next/no-img-element
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

      <section id="contact" className="py-24 bg-muted scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mx-auto">
              <Sparkles className="w-4 h-4" />
              <span>Let&apos;s build something</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Want to work with me?</h2>
            <p className="text-base md:text-lg text-muted-foreground mx-auto max-w-2xl">
              If you&apos;re building a product, refreshing a UI, or want a fast-moving partner,
              I&apos;m in. Tell me what you&apos;re aiming for and I&apos;ll send ideas, timelines,
              and a clear next step.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild className="group">
                <Link href="/contact-me#book">
                  Book a call
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact-me">Send a message</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
