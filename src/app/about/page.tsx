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
import HeroSection from "@/components/about/HeroSection";
import TimelineItem from "@/components/about/TimelineItem";
import SkillCard from "@/components/about/SkillCard";

const timeline = [
  {
    year: "2019",
    title: "High School Graduation & New Beginnings",
    description: "Graduated from First English Language School in Sofia, Bulgaria, got accepted into University of Strathclyde, Glasgow, Scotland, UK. Had my first summer job in a coffee shop, not knowing what was about to happen in the following few years",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "text-amber-500",
    mainImg: "/resources/images/about/2019.webp",
    mainImgCaption: "The University of Strathclyde, Glasgow - where the adventure began. It was also my first time in the UK ever, plus living in a flat with 3 other people for the first time in my life.",
    sideImg: "/resources/images/about/2019_side.webp",
    sideImgCaption: "The Coffee Shop, Sofia - my summer job in 2019, and my actual first job ever. Learnt a thing or two about coffee, dealing with customers, and how to operate on as little sleep as possible.",
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
    color: "text-emerald-500",
    mainImg: "/resources/images/about/2020.webp",
    mainImgCaption: "Early digital art experiments and website designs from the kofiscrib era - I was still figuring out my style back then.",
    sideImg: "/resources/images/about/2020_side.webp",
    sideImgCaption: "So, COVID-19 was a thing - the pandemic caught me while still in Glasgow, and I had to move back to Bulgaria basically overnight. Soon enough, I began filling my time with digital art and learning web development.",
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
    color: "text-sky-500",
    mainImg: "/resources/images/about/2021.webp",
    mainImgCaption: "In 2021, I went back to Glasgow for my 3rd year of Biomedical Engineering. My uni schedule was pretty light at the time, so I had a lot of time to work on my own projects and explore Scotland.",
    sideImg: "/resources/images/about/2021_side.webp",
    sideImgCaption: "In the meantime, I was applying for jobs left and right, and luckily landed my first tech-related job at a Bulgarian startup called Boom.dev. It was a great experience, and I learned a lot about web development and the startup life. I still feel like it was this job that opened the doors to my current career.",
    links: [
      { text: "University of Strathclyde", url: "https://www.strath.ac.uk" },
      { text: "Boom.dev", url: "https://boom.dev" }
    ]
  },
  {
    year: "2022",
    title: "Major Life Changes",
    description: "Moved to my own place, took a gap year from university, and joined Nuvei as a front-end developer",
    icon: <Home className="w-6 h-6" />,
    color: "text-rose-500",
    mainImg: "/resources/images/about/2022.webp",
    mainImgCaption: "2022 threw all sorts of curveballs at me - after COVID, housing in Glasgow was a nightmare, and I didn't manage to find a place to live. And, because of that, I took a gap year from university - in the meantime, I was stuck in Sofia, and I took the opportunity to find a full-time job in IT. That's how I ended up in Nuvei, a pretty big company in the payments industry, with me as the youngest lad in the office. At the same time, I moved out of my parents' place, and that was the start of me living fully on my own.",
    sideImg: "/resources/images/about/2022_side.webp",
    sideImgCaption: "I was lucky to have a very supportive team at Nuvei, and I learned a lot from them. The tech stack was very old-school, but it gave me a great foundation in web development. However, I was still young and eager to learn, so I knew this wouldn't be the company for me in the long run.",
    links: [
      { text: "Nuvei", url: "https://www.nuvei.com" }
    ]
  },
  {
    year: "2023-2024",
    title: "Focus on Career & Education",
    description: "Balanced full-time work at Nuvei while completing my dissertation and graduating from University of Strathclyde",
    icon: <Briefcase className="w-6 h-6" />,
    color: "text-violet-500",
    mainImg: "/resources/images/about/2023.webp",
    mainImgCaption: "In 2023, I went back to Glasgow for my 4th and final year at uni. Nuvei gave me the opportunity to go part-time, while I was doing my dissertation, which was a great help. However, the amount of work was slowly and surely piling up on all fronts, and this whole academic year was a bit of a blur. Eventually, I graduated with a 2:1, and I was happy to be done with uni and move on to the next chapter of my life.",
    sideImg: "/resources/images/about/2023_side.webp",
    sideImgCaption: "It was also the last time so far that I got to live in Glasgow, so I tried to make the most of it. Glasgow, with all its rain and quirks, will always have a special place in my heart.",
    links: [
      { text: "University of Strathclyde", url: "https://www.strath.ac.uk" }
    ]
  },
  {
    year: "Late 2024",
    title: "Startup Adventure",
    description: "Joined TalentSight, a Bulgarian startup founded by high school friends, as a new chapter in my career",
    icon: <Rocket className="w-6 h-6" />,
    color: "text-indigo-500",
    mainImg: "/resources/images/about/2024.webp",
    mainImgCaption: "In late 2024, after I returned to Sofia for good, two of my high school classmates approached me with an offer to join them in their startup journey. They needed a front-end developer to help with their platform for AI-powered recruitment. I was excited to be part of something new, and I knew it would be a great experience working with friends.",
    sideImg: "/resources/images/about/2024_side.webp",
    sideImgCaption: "I'm still working on the platform, and it's been a great experience so far. I've learned a lot about AI and the startup life, and I'm excited to see where it goes.",
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
    mainImgCaption: "Ever since I started using AI tools to help me with my work, I've been fascinated by the potential of these technologies. It helped me build 4-5 web apps in just the first quarter of 2025 - including eculink.io, my first (and hopefully not last) independent client project.",
    sideImg: "/resources/images/about/2025_side.webp",
    sideImgCaption: "In December 2024, I took a while to think about my goals for 2025 - now that uni was behind me and I had a new job, I had new frontiers to conquer. I decided to revive my online presence, take my fitness and health more seriously, and start working on some side projects.",
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
  caption: string;
  onClose: () => void;
}

const FullscreenImage = ({ src, alt, caption, onClose }: FullscreenImageProps) => {
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
        className="relative w-[90vw] h-[90vh] flex flex-col items-center justify-center backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[85vh] flex items-center justify-center">
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
        <div className="mt-4 text-center text-white/80 text-sm max-w-2xl px-4">
          {caption}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string; caption: string } | null>(null);

  return (
    <Layout>
      <HeroSection />

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
                <TimelineItem key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            My Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImage
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            caption={fullscreenImage.caption}
            onClose={() => setFullscreenImage(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
} 