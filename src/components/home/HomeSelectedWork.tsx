import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects } from '@/components/ProjectsList';
import { TechBadge } from '@/components/TechBadge';
import { Reveal } from '@/components/Reveal';

export function HomeSelectedWork() {
  const featured = projects.slice(0, 4);

  return (
    <section id="selected-work" className="bg-muted py-20 md:py-28 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-6 mb-10" aria-label="Selected work">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-foreground">
              Selected work
            </h2>
            <div className="flex-1 pb-2 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="hidden sm:inline-flex items-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                hand-picked
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((project, index) => (
              <Reveal
                as="article"
                key={project.title}
                delay={index * 50}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary"
              >
                <Link
                  href={`/projects#${project.title.toLowerCase()}`}
                  className="relative aspect-[16/10] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
                  aria-label={`View ${project.title}`}
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
                </Link>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <Link href={`/projects#${project.title.toLowerCase()}`} className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <TechBadge key={tag} tag={tag} />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 pt-1">
                    <Link
                      href={`/projects#${project.title.toLowerCase()}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Case study
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              See all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
