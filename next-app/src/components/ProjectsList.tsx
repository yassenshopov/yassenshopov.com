'use client';

import { Palette, Sparkles, Users, Code, FileText } from "lucide-react";

export const projects = [
  {
    title: "PokemonPalette",
    tagline: "Color inspiration from your favorite Pokemon",
    description: "Transform the world of Pokemon into beautiful color palettes for your next design project. A unique tool that bridges nostalgia with modern design needs.",
    image: "/resources/images/projects/pokemonpalette.webp",
    liveUrl: "https://pokemonpalette.com",
    stats: [
      { icon: Palette, value: 2200, suffix: "+", label: "Color Palettes" },
      { icon: Users, value: 3000, suffix: "+", label: "Monthly Users" },
      { icon: Code, value: 1025, suffix: "", label: "Pokemon Available" }
    ],
    tags: ["Next.js", "React", "TailwindCSS", "Pokemon API"],
    featured: true,
    impact: "Helping designers and developers find unique color inspiration while celebrating the beloved Pokemon franchise."
  },
  {
    title: "Frameworked.io",
    tagline: "Supercharge your Notion workspace",
    description: "A powerful platform that enhances Notion with beautiful dashboards, real-time data sync, and an optimized mobile experience. Keep Notion as your source of truth while unlocking its full potential.",
    image: "/resources/images/projects/frameworked.webp",
    liveUrl: "https://frameworked.io",
    stats: [
      { icon: FileText, value: 500, suffix: "+", label: "Daily logs processed" },
      { icon: Sparkles, value: 15, suffix: "+", label: "Custom modules" },
      { icon: Code, value: 99.9, suffix: "%", label: "Uptime" }
    ],
    tags: ["Next.js", "React", "Notion API", "TailwindCSS"],
    featured: true,
    impact: "Empowering professionals to create their perfect productivity system without leaving the Notion ecosystem."
  }
]; 