"use client";

import { ArrowRight, Sparkles, Code, Paintbrush, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { templates } from "@/components/NotionTemplatesList";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { projects } from "@/components/ProjectsList";

const heroCards = [
  {
    style: "top-[20%] left-[20%] rotate-3",
    href: "https://yassenshopov.gumroad.com/l/ultimate-investing-dashboard/",
    src: "/resources/images/notion/Ultimate_Investing_Dashboard.webp",
    alt: "Ultimate Investing Dashboard Notion Template",
  },
  {
    style: "top-[50%] left-[50%] -rotate-3",
    href: "https://yassenshopov.gumroad.com/l/resume-builder/",
    src: "/resources/images/notion/Resume_Builder_Thumbnail.webp",
    alt: "Notion Template for Resume Building",
  },
  {
    style: "top-[80%] left-[80%] rotate-3",
    href: "https://yassenshopov.gumroad.com/l/financial-goal-planning",
    src: "/resources/images/notion/Financial_Goals_Tracker.webp",
    alt: "Notion Template for Financial Tracking",
  },
] as const;

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 md:pt-0">
        <div className="absolute inset-0 bg-background/50 -z-10" />
        <div className="container mx-auto px-4 py-2 md:py-2">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Digital Creator &amp; Developer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground">
                Building Digital<br />
                Tools for a<br />
                Better Life
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Creating Notion templates, web applications, and digital solutions that help people achieve their goals while maintaining work-life balance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/notion">
                    Explore Templates
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[600px]">
                {heroCards.map((card) => (
                  <div
                    key={card.src}
                    className={`absolute w-[280px] transform -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-1000 ${card.style}`}
                  >
                    <Card className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-2">
                      <Link href={card.href}>
                        <div className="relative aspect-square">
                          <Image
                            src={card.src}
                            alt={card.alt}
                            fill
                            sizes="280px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted stats-section">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Link href="/notion" className="block group hover:opacity-75 transition-opacity focus-within:opacity-75">
                <div className="text-4xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  <AnimatedNumber end={templates.length} />
                </div>
                <div className="text-muted-foreground group-hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                  Notion Templates
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/projects" className="block group hover:opacity-75 transition-opacity focus-within:opacity-75">
                <div className="text-4xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  <AnimatedNumber end={projects.length} />
                </div>
                <div className="text-muted-foreground group-hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                  Live Projects
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-foreground">
                <AnimatedNumber end={5} suffix="+" />
              </div>
              <div className="text-muted-foreground">Years in Tech &amp; Design</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-foreground">
                <AnimatedNumber end={25} />
              </div>
              <div className="text-muted-foreground">
                Years of trying to figure life out{" "}
                <span role="img" aria-label="birthday cake">{"\uD83C\uDF82"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20" id="expertise">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            What I Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Code className="w-8 h-8 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Web Development</h3>
              <p className="text-muted-foreground">
                Building modern web applications with Next.js, React, and TypeScript.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Paintbrush className="w-8 h-8 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Digital Design</h3>
              <p className="text-muted-foreground">
                Creating beautiful and functional digital products and illustrations.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <BookOpen className="w-8 h-8 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Content Creation</h3>
              <p className="text-muted-foreground">
                Sharing knowledge about productivity, creativity, and personal development.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Image
                src="/resources/images/main_page/YassenShopov.jpg"
                alt="Yassen Shopov"
                width={500}
                height={500}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-card p-2 sm:p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm sm:text-base font-medium text-card-foreground">Building in public since 2020</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About Me
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I{"\u2019"}m Yassen Shopov, a digital creator and developer passionate about building tools that enhance productivity and well-being.
                  With over 5 years of experience in the digital space, I{"\u2019"}ve helped thousands of people organize their lives through Notion templates and digital solutions.
                </p>
                <p>
                  My journey started in 2020 with digital illustrations and has evolved into creating comprehensive productivity tools.
                  I combine my skills in design, development, and content creation to build solutions that make a real difference in people{"\u2019"}s lives.
                </p>
                <p>
                  When I{"\u2019"}m not coding or designing, I{"\u2019"}m sharing insights on productivity, creativity, and personal development through my blog and social media.
                </p>
                <div className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="/about">Learn More About Me</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
