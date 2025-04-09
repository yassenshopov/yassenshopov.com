"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code, Paintbrush, BookOpen, Sparkles, ArrowRight, GraduationCap, Briefcase, Home, Globe, Heart, Rocket, Users, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

const timeline = [
  {
    year: "2019",
    title: "High School Graduation & New Beginnings",
    description: "Graduated from First English Language School in Sofia, Bulgaria, got accepted into University of Strathclyde, Glasgow, Scotland, UK. Had my first summer job in a coffee shop, not knowing what was about to happen in the following few years",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "text-indigo-500",
    mainImg: "/resources/images/about/2019.webp",
    sideImg: "/resources/images/about/2019_side.webp",
    links: [
      { text: "First English Language School, Sofia", url: "https://www.fels-sofia.org" },
      { text: "University of Strathclyde, Glasgow", url: "https://www.strath.ac.uk" }
    ]
  },
  {
    year: "2020",
    title: "Digital Art & Web Projects",
    description: "Started my journey as a digital creator under 'kofiscrib', building websites and launching the Life Engineering newsletter during COVID",
    icon: <Paintbrush className="w-6 h-6" />,
    color: "text-purple-500",
    mainImg: "/resources/images/about/2020.webp",
    sideImg: "/resources/images/about/2020_side.webp",
    links: [
      { text: "kofiscrib.com", url: "https://kofiscrib.com" },
      { text: "Life Engineering", url: "/blog" }
    ]
  },
  {
    year: "2021",
    title: "First Tech Job & University",
    description: "Landed first tech job at a Bulgarian startup focused on web dev education while studying Biomedical Engineering at University of Strathclyde, Glasgow",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "text-blue-500",
    mainImg: "/resources/images/about/2021.webp",
    sideImg: "/resources/images/about/2021_side.webp",
    links: [
      { text: "University of Strathclyde", url: "https://www.strath.ac.uk" }
    ]
  },
  {
    year: "2022",
    title: "Major Life Changes",
    description: "Moved to my own place, took a gap year from university, and joined Nuvei as a front-end developer",
    icon: <Home className="w-6 h-6" />,
    color: "text-green-500",
    mainImg: "/resources/images/about/2022.webp",
    sideImg: "/resources/images/about/2022_side.webp",
    links: [
      { text: "Nuvei", url: "https://www.nuvei.com" }
    ]
  },
  {
    year: "2023-2024",
    title: "Focus on Career & Education",
    description: "Balanced full-time work at Nuvei while completing my dissertation and graduating from University of Strathclyde",
    icon: <Briefcase className="w-6 h-6" />,
    color: "text-orange-500",
    mainImg: "/resources/images/about/2023.webp",
    sideImg: "/resources/images/about/2023_side.webp",
    links: [
      { text: "University of Strathclyde", url: "https://www.strath.ac.uk" }
    ]
  },
  {
    year: "Late 2024",
    title: "Startup Adventure",
    description: "Joined TalentSight, a Bulgarian startup founded by high school friends, as a new chapter in my career",
    icon: <Rocket className="w-6 h-6" />,
    color: "text-red-500",
    mainImg: "/resources/images/about/2024.webp",
    sideImg: "/resources/images/about/2024_side.webp",
    links: [
      { text: "TalentSight", url: "https://talsight.com" }
    ]
  },
  {
    year: "2025",
    title: "Creative Revival",
    description: "Revived my online presence, resumed the Life Engineering newsletter, and took on new projects like eculink.io",
    icon: <Heart className="w-6 h-6" />,
    color: "text-pink-500",
    mainImg: "/resources/images/about/2025.webp",
    sideImg: "/resources/images/about/2025_side.webp",
    links: [
      { text: "Life Engineering", url: "/blog" },
      { text: "eculink.io", url: "https://eculink.io" }
    ]
  },
];

const skills = [
  {
    icon: <Code className="w-6 h-6" />,
    title: "Web Development",
    description: "Next.js, React, TypeScript, Tailwind CSS",
  },
  {
    icon: <Paintbrush className="w-6 h-6" />,
    title: "Design",
    description: "UI/UX Design, Digital Illustration, Notion Design",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Content Creation",
    description: "Technical Writing, Video Production, Social Media",
  },
];

interface FullscreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullscreenImage = ({ src, alt, onClose }: FullscreenImageProps) => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-[90vw] h-[90vh] flex items-center justify-center backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain select-none"
            sizes="90vw"
            priority
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background/50 -z-10" />
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Digital Creator & Developer</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-foreground">
                About Me
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                I'm Yassen Shopov, a digital creator and developer passionate about building tools that enhance productivity and well-being.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/projects">
                    View My Projects
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/blog">Read My Blog</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src="/resources/images/main_page/YassenShopov.jpg"
                  alt="Yassen Shopov"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            My Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />
            <div className="space-y-24">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Mobile Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary md:hidden" />
                  
                  <div className="flex items-start gap-8">
                    {index % 2 === 0 ? (
                      <>
                        <div className="md:w-1/2">
                          <Card className="p-6 hover:shadow-lg transition-all duration-300 group overflow-visible relative">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                              </div>
                              <div className="text-primary font-bold">{item.year}</div>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-muted-foreground mb-4">{item.description}</p>
                                {item.links && item.links.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {item.links.map((link, linkIndex) => (
                                      <Link
                                        key={linkIndex}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 border border-white/10"
                                      >
                                        {link.text}
                                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                        {item.mainImg && (
                          <div className="hidden md:block md:w-1/2">
                            <div className="relative aspect-video group/images"
                                 onClick={() => setFullscreenImage({ src: item.mainImg, alt: item.title })}
                              >
                              <div className="relative aspect-video rounded-lg overflow-hidden transform transition-all duration-300 group-hover/images:scale-105 group-hover/images:-translate-y-2 group-hover/images:rotate-1 cursor-pointer">
                                <Image
                                  src={item.mainImg}
                                  alt={item.title}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              {item.sideImg && (
                                <div 
                                  className="absolute -top-6 -right-6 w-24 h-24 transform rotate-3 transition-all duration-300 group-hover/images:rotate-12 group-hover/images:translate-x-2 group-hover/images:-translate-y-2 z-10 cursor-pointer backdrop-blur-sm"
                                  style={{ transformOrigin: 'center center' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFullscreenImage({ src: item.sideImg, alt: `${item.title} (detail)` });
                                  }}
                                >
                                  <Image
                                    src={item.sideImg}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {item.mainImg && (
                          <div className="hidden md:block md:w-1/2">
                            <div className="relative aspect-video group/images"
                                 onClick={() => setFullscreenImage({ src: item.mainImg, alt: item.title })}
                              >
                              <div className="relative aspect-video rounded-lg overflow-hidden transform transition-all duration-300 group-hover/images:scale-105 group-hover/images:-translate-y-2 group-hover/images:-rotate-1 cursor-pointer">
                                <Image
                                  src={item.mainImg}
                                  alt={item.title}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              {item.sideImg && (
                                <div 
                                  className="absolute -top-6 -left-6 w-24 h-24 transform -rotate-3 transition-all duration-300 group-hover/images:-rotate-12 group-hover/images:-translate-x-2 group-hover/images:-translate-y-2 z-10 cursor-pointer backdrop-blur-sm"
                                  style={{ transformOrigin: 'center center' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFullscreenImage({ src: item.sideImg, alt: `${item.title} (detail)` });
                                  }}
                                >
                                  <Image
                                    src={item.sideImg}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="md:w-1/2">
                          <Card className="p-6 hover:shadow-lg transition-all duration-300 group overflow-visible relative">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                              </div>
                              <div className="text-primary font-bold">{item.year}</div>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-muted-foreground mb-4">{item.description}</p>
                                {item.links && item.links.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {item.links.map((link, linkIndex) => (
                                      <Link
                                        key={linkIndex}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 border border-white/10"
                                      >
                                        {link.text}
                                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            What I Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="text-primary mb-4">{skill.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImage
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            onClose={() => setFullscreenImage(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
} 