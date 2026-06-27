'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { projects } from '@/components/ProjectsList';
import { TechBadge } from '@/components/TechBadge';

function jumpToProject(title: string) {
  const el = document.getElementById(title.toLowerCase());
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ProjectsOverview() {
  return (
    <section id="selected-work" className="py-16 md:py-20 scroll-mt-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section heading — matches the blog/library system */}
          <div className="flex items-end gap-6 mb-10" aria-label="Selected work">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
              Selected work
            </h2>
            <div className="flex-1 pb-2 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => {
              return (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary"
                >
                  <button
                    type="button"
                    onClick={() => jumpToProject(project.title)}
                    className="relative aspect-[16/10] w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
                    aria-label={`Jump to ${project.title} details`}
                  >
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </button>

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <button
                      type="button"
                      onClick={() => jumpToProject(project.title)}
                      className="text-left"
                    >
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                    </button>
                    <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <TechBadge key={tag} tag={tag} />
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => jumpToProject(project.title)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Details
                      </button>
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Visit live
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
