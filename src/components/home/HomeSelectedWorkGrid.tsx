'use client';

import { projects } from '@/data/projects';
import { Reveal } from '@/components/Reveal';
import { HomeProjectCard } from '@/components/home/HomeProjectCard';

export function HomeSelectedWorkGrid() {
  const featured = projects.slice(0, 6);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
      {featured.map((project, index) => (
        <Reveal key={project.title} delay={index * 35}>
          <HomeProjectCard
            title={project.title}
            tagline={project.tagline}
            images={project.images}
            liveUrl={project.liveUrl}
          />
        </Reveal>
      ))}
    </div>
  );
}
