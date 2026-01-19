'use client';

import { Palette, Sparkles, Users, Code, FileText } from "lucide-react";

type TechBadgeStyle = {
  bg: string;
  text: string;
  border: string;
  hover: string;
};

export type TechBadgeMeta = {
  label: string;
  iconSrc?: string;
  style: TechBadgeStyle;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
};

const defaultTechBadgeStyle: TechBadgeStyle = {
  bg: "bg-primary/10",
  text: "text-primary",
  border: "border-primary/30",
  hover: "hover:bg-primary/20"
};

export const techStack: Record<string, TechBadgeMeta> = {
  "Next.js": {
    label: "Next.js",
    iconSrc: "/resources/images/tech/nextjs.svg",
    style: { bg: "bg-black", text: "text-white", border: "border-neutral-800", hover: "hover:bg-neutral-800" },
    description: "React framework for production-grade applications.",
    linkHref: "https://nextjs.org/",
    linkLabel: "Learn more"
  },
  "React": {
    label: "React",
    iconSrc: "/resources/images/tech/react.svg",
    style: { bg: "bg-[#61dafb]/10", text: "text-[#61dafb]", border: "border-[#61dafb]/30", hover: "hover:bg-[#61dafb]/20" },
    description: "UI library for building component-driven interfaces.",
    linkHref: "https://react.dev/",
    linkLabel: "Learn more"
  },
  "TailwindCSS": {
    label: "TailwindCSS",
    iconSrc: "/resources/images/tech/tailwind.svg",
    style: { bg: "bg-[#38bdf8]/10", text: "text-[#38bdf8]", border: "border-[#38bdf8]/30", hover: "hover:bg-[#38bdf8]/20" },
    description: "Utility-first CSS framework for rapid UI styling.",
    linkHref: "https://tailwindcss.com/",
    linkLabel: "Learn more"
  },
  "Supabase": {
    label: "Supabase",
    iconSrc: "/resources/images/tech/supabase.svg",
    style: { bg: "bg-[#3ecf8e]/10", text: "text-[#3ecf8e]", border: "border-[#3ecf8e]/30", hover: "hover:bg-[#3ecf8e]/20" },
    description: "Open-source backend with auth, database, and storage.",
    linkHref: "https://supabase.com/",
    linkLabel: "Learn more"
  },
  "Pokemon API": {
    label: "Pokemon API",
    iconSrc: "/resources/images/tech/pokeapi.png",
    style: { bg: "bg-[#ff1f1f]/10", text: "text-[#ff1f1f]", border: "border-[#ff1f1f]/30", hover: "hover:bg-[#ff1f1f]/20" },
    description: "Community Pokemon REST API for data and sprites.",
    linkHref: "https://pokeapi.co/",
    linkLabel: "Learn more"
  },
  "Notion API": {
    label: "Notion API",
    iconSrc: "/resources/images/tech/notion.svg",
    style: { bg: "bg-[#000000]/10", text: "text-[#000000] dark:text-white", border: "border-[#000000]/30 dark:border-white/30", hover: "hover:bg-[#000000]/20 dark:hover:bg-white/20" },
    description: "Official API for reading and writing Notion data.",
    linkHref: "https://developers.notion.com/",
    linkLabel: "Learn more"
  }
};

export const getTechBadgeMeta = (tag: string): TechBadgeMeta => {
  return techStack[tag] ?? { label: tag, style: defaultTechBadgeStyle };
};

export const projectTagPaddingXClass = "px-6";

export const projects = [
  {
    title: "PokemonPalette",
    tagline: "Color inspiration from your favorite Pokemon",
    description: "Transform the world of Pokemon into beautiful color palettes for your next design project. A unique tool that bridges nostalgia with modern design needs.",
    images: ["/resources/images/projects/pokemonpalette.webp"],
    liveUrl: "https://pokemonpalette.com",
    stats: [
      { icon: Palette, value: 2200, suffix: "+", label: "Color Palettes" },
      { icon: Users, value: 3000, suffix: "+", label: "Monthly Users" },
      { icon: Code, value: 1025, suffix: "", label: "Pokemon Available" }
    ],
    tags: ["Next.js", "React", "TailwindCSS", "Supabase", "Pokemon API"],
    featured: true,
    impact: "Helping designers and developers find unique color inspiration while celebrating the beloved Pokemon franchise."
  },
  {
    title: "Frameworked.io",
    tagline: "Supercharge your Notion workspace",
    description: "A powerful platform that enhances Notion with beautiful dashboards, real-time data sync, and an optimized mobile experience. Keep Notion as your source of truth while unlocking its full potential.",
    images: ["/resources/images/projects/frameworked.webp"],
    liveUrl: "https://frameworked.io",
    stats: [
      { icon: FileText, value: 500, suffix: "+", label: "Daily logs processed" },
      { icon: Sparkles, value: 15, suffix: "+", label: "Custom modules" },
      { icon: Code, value: 99.9, suffix: "%", label: "Uptime" }
    ],
    tags: ["Next.js", "React", "TailwindCSS", "Supabase", "Notion API"],
    featured: true,
    impact: "Empowering professionals to create their perfect productivity system without leaving the Notion ecosystem."
  }
]; 