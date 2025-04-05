"use client";

import { ArrowRight, Sparkles, Code, Paintbrush, BookOpen, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { templates } from "@/components/NotionTemplatesList";

const positions = [
  { style: "top-[20%] left-[20%] rotate-3" },
  { style: "top-[50%] left-[50%] -rotate-3" },
  { style: "top-[80%] left-[80%] rotate-3" },
];

export default function Home() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumbers();
        }
      });
    }, { threshold: 0.1 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    function animateNumbers() {
      const stats = [
        { id: 'templates-count', end: templates.length, suffix: '' },
        { id: 'projects-count', end: 2, suffix: '' },
        { id: 'experience-count', end: 5, suffix: '+' },
        { id: 'life-count', end: 24, suffix: '' }
      ];

      stats.forEach(({ id, end, suffix }) => {
        const element = document.getElementById(id);
        if (!element) return;

        let start = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function update() {
          const currentTime = performance.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);
          
          const current = Math.round(start + (end - start) * eased);
          if (element) {
            element.textContent = current.toString() + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
      });
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background/50 -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Digital Creator & Developer</span>
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
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#projects">View Projects</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[600px]">
                {positions.map((pos, index) => (
                  <div 
                    key={index}
                    className={`absolute w-[280px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${pos.style}`}
                  >
                    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <Link href={[
                        "https://yassenshopov.gumroad.com/l/ultimate-investing-dashboard/",
                        "https://yassenshopov.gumroad.com/l/resume-builder/",
                        "https://yassenshopov.gumroad.com/l/financial-goal-planning"
                      ][index]}>
                        <div className="relative aspect-square">
                          <Image
                            src={[
                              "/resources/images/notion/Ultimate_Investing_Dashboard.webp",
                              "/resources/images/notion/Resume_Builder_Thumbnail.webp",
                              "/resources/images/notion/Financial_Goals_Tracker.webp"
                            ][index]}
                            alt={[
                              "Ultimate Investing Dashboard Notion Template",
                              "Notion Template for Resume Building",
                              "Notion Template for Financial Tracking"
                            ][index]}
                            fill
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
              <div className="text-4xl font-bold mb-2 text-foreground" id="templates-count">0</div>
              <div className="text-muted-foreground">Notion Templates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-foreground" id="projects-count">0</div>
              <div className="text-muted-foreground">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-foreground" id="experience-count">0</div>
              <div className="text-muted-foreground">Years in Tech & Design</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-foreground" id="life-count">0</div>
              <div className="text-muted-foreground">Years of Figuring It Out</div>
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
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <Code className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Web Development</h3>
              <p className="text-muted-foreground">
                Building modern web applications with Next.js, React, and TypeScript.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <Paintbrush className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Digital Design</h3>
              <p className="text-muted-foreground">
                Creating beautiful and functional digital products and illustrations.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <BookOpen className="w-8 h-8 mb-4 text-primary" />
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
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium text-card-foreground">25K+ Followers</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About Me
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm Yassen Shopov, a digital creator and developer passionate about building tools that enhance productivity and well-being. 
                  With over 5 years of experience in the digital space, I've helped thousands of people organize their lives through Notion templates and digital solutions.
                </p>
                <p>
                  My journey started in 2020 with digital illustrations and has evolved into creating comprehensive productivity tools. 
                  I combine my skills in design, development, and content creation to build solutions that make a real difference in people's lives.
                </p>
                <p>
                  When I'm not coding or designing, I'm sharing insights on productivity, creativity, and personal development through my blog and social media.
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
