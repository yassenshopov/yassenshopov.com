"use client";

import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Palette, Sparkles, Users, Code, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useEffect, useState } from "react";
import { projects } from "@/components/ProjectsList";

interface TechColor {
  bg: string;
  text: string;
  border: string;
  hover: string;
}

const techColors: Record<string, TechColor> = {
  "Next.js": { bg: "bg-black", text: "text-white", border: "border-neutral-800", hover: "hover:bg-neutral-800" },
  "React": { bg: "bg-[#61dafb]/10", text: "text-[#61dafb]", border: "border-[#61dafb]/30", hover: "hover:bg-[#61dafb]/20" },
  "TailwindCSS": { bg: "bg-[#38bdf8]/10", text: "text-[#38bdf8]", border: "border-[#38bdf8]/30", hover: "hover:bg-[#38bdf8]/20" },
  "Pokemon API": { bg: "bg-[#ff1f1f]/10", text: "text-[#ff1f1f]", border: "border-[#ff1f1f]/30", hover: "hover:bg-[#ff1f1f]/20" },
  "Notion API": { bg: "bg-[#000000]/10", text: "text-[#000000] dark:text-white", border: "border-[#000000]/30 dark:border-white/30", hover: "hover:bg-[#000000]/20 dark:hover:bg-white/20" }
};

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
  return (
    <Layout>
      <TableOfContents />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted">
        <div className="absolute inset-0 bg-grid-white/10 -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Code className="w-4 h-4" />
              <span>Featured Projects</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Crafting Digital<br />
              Experiences
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              From color inspiration tools to productivity enhancers, each project is built to solve real problems and delight users.
            </p>
          </div>
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
                    const colors = techColors[tag] || { 
                      bg: "bg-primary/10", 
                      text: "text-primary", 
                      border: "border-primary/30",
                      hover: "hover:bg-primary/20"
                    };
                    return (
                      <span
                        key={tagIndex}
                        className={`px-4 py-2 font-medium rounded-lg text-sm border transition-colors ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}`}
                      >
                        {tag}
                      </span>
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
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                </div>
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