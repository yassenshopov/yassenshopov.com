"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  price: string;
  gumroadLink: string;
  productHuntLink?: string;
}

const categories = [
  { value: "all", label: "All Templates" },
  { value: "finances", label: "Finances" },
  { value: "career", label: "Career" },
  { value: "study", label: "Study" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "planners", label: "Planners" },
  { value: "content-creation", label: "Content Creation" },
];

const templates: Template[] = [
  {
    id: 'ultimate-investing-dashboard',
    title: 'Ultimate Investing Dashboard',
    description: 'Automate your investment portfolio tracking and market research with this beautiful Notion template. Automatically synced with Yahoo! Finances',
    image: '/resources/images/notion/Ultimate_Investing_Dashboard.webp',
    categories: ['finances', 'planners'],
    price: '22$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/ultimate-investing-dashboard/',
    productHuntLink: 'https://www.producthunt.com/posts/ultimate-investing-dashboard-in-notion'
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Build a professional resume by simply adding your details in this minimalistic Notion template.',
    image: '/resources/images/notion/Resume_Builder_Thumbnail.webp',
    categories: ['career'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/resume-builder',
    productHuntLink: 'https://www.producthunt.com/posts/resume-builder-notion-template'
  },
  {
    id: 'flash-card-builder',
    title: 'Flash Card Builder',
    description: 'Create easy-to-use flashcards with the Anki method inside your Notion workspace.',
    image: '/resources/images/notion/Flash_Card_Builder_Thumbnail.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/flash-card-builder'
  },
  {
    id: 'project-management-database',
    title: 'Project Management Database',
    description: 'Track all your projects in one centralised database - in Notion.',
    image: '/resources/images/notion/Project_Management_Database.webp',
    categories: ['career', 'planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/projects-database'
  },
  {
    id: '5-minute-daily-journal',
    title: '5-Minute Daily Journal',
    description: 'Receive a fully-populated database for each date in 2022, where you are able to log your daily data and journal entries.',
    image: '/resources/images/notion/5-Minute_Daily_Journaling.webp',
    categories: ['mindfulness', 'planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/5-minute-daily-journal',
    productHuntLink: 'https://www.producthunt.com/posts/notion-template-quick-daily-journaling'
  },
  {
    id: 'travel-planner',
    title: 'Travel Planner',
    description: 'Plan your next adventure with this comprehensive travel planning template.',
    image: '/resources/images/notion/Travel_Planner.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/travel-planning'
  },
  {
    id: 'uk-university-hq',
    title: 'UK University HQ',
    description: 'Organize your university life with this comprehensive template for UK students.',
    image: '/resources/images/notion/UK_University_HQ.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/uk-university-hq'
  },
  {
    id: 'to-do-list-database',
    title: 'To-Do List Database',
    description: 'A powerful task management system built in Notion.',
    image: '/resources/images/notion/To-Do_List_Database.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/to-do-list-database'
  },
  {
    id: 'social-media-production',
    title: 'Social Media Production',
    description: 'Streamline your social media content creation and scheduling.',
    image: '/resources/images/notion/Social_Media_Production.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/social-media-production'
  },
  {
    id: 'social-circle-management',
    title: 'Social Circle Management',
    description: 'Keep track of your relationships and social interactions.',
    image: '/resources/images/notion/Social_Circle_Management.webp',
    categories: ['mindfulness'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/social-circle-management'
  },
  {
    id: 'investments-tracker-database',
    title: 'Investments Tracker Database',
    description: 'Track and analyze your investment portfolio performance.',
    image: '/resources/images/notion/Investments_Tracker_Database.webp',
    categories: ['finances'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/investments-tracker-database'
  },
  {
    id: 'job-application-tracker',
    title: 'Job Application Tracker',
    description: 'Organize and track your job applications and interviews.',
    image: '/resources/images/notion/Job_Application_Tracker.webp',
    categories: ['career'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/job-application-tracker'
  },
  {
    id: 'interactive-media-hub',
    title: 'Interactive Media Hub',
    description: 'Manage your media consumption and recommendations.',
    image: '/resources/images/notion/Interactive_Media_Hub.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/interactive-media-hub'
  },
  {
    id: 'financial-goals-tracker',
    title: 'Financial Goals Tracker',
    description: 'Set and track your financial goals and milestones.',
    image: '/resources/images/notion/Financial_Goals_Tracker.webp',
    categories: ['finances'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/financial-goals-tracker'
  },
  {
    id: 'family-tree-database',
    title: 'Family Tree Database',
    description: 'Document and visualize your family history and relationships.',
    image: '/resources/images/notion/Family_Tree_Database.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/family-tree-database'
  },
  {
    id: 'daily-tracking-2022',
    title: 'Daily Tracking 2022',
    description: 'Track your daily habits and progress throughout the year.',
    image: '/resources/images/notion/Daily_Tracking_2022.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/daily-tracking-2022'
  },
  {
    id: 'digital-art-commissions',
    title: 'Digital Art Commissions',
    description: 'Manage your art commissions and client relationships.',
    image: '/resources/images/notion/Digital_Art_Commissions.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/digital-art-commissions'
  },
  {
    id: 'blog-writing-management',
    title: 'Blog Writing Management',
    description: 'Organize your blog content creation and publishing schedule.',
    image: '/resources/images/notion/Blog_Writing_Management.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/blog-writing-management'
  },
  {
    id: 'assignment-tracking-for-uni',
    title: 'Assignment Tracking for University',
    description: 'Keep track of your university assignments and deadlines.',
    image: '/resources/images/notion/Assignment_Tracking_for_Uni.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/assignment-tracking-for-uni'
  }
];

export default function NotionTemplatesList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const templateRefs = useRef<(HTMLElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ctx = useRef<gsap.Context | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.categories.includes(selectedCategory));

  useEffect(() => {
    // Reset refs array when templates change
    templateRefs.current = [];
  }, [filteredTemplates]);

  useEffect(() => {
    // Cleanup previous animations
    if (ctx.current) {
      ctx.current.revert();
    }

    // Only animate if we have elements and they're not loading
    if (!isLoading && templateRefs.current.length > 0) {
      const elements = templateRefs.current.filter(Boolean);
      if (elements.length > 0) {
        ctx.current = gsap.context(() => {
          gsap.from(elements, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
          });
        });
      }
    }

    // Cleanup function
    return () => {
      if (ctx.current) {
        ctx.current.revert();
      }
    };
  }, [filteredTemplates, isLoading]);

  const handleCategoryChange = (value: string) => {
    setIsLoading(true);
    setSelectedCategory(value);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulate loading delay
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-20">
        <h1 className="text-5xl font-serif font-bold mb-6 tracking-tight text-foreground">
          Notion Templates
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Beautiful, functional templates to help you organize your life and work. 
          Each template is designed with attention to detail and user experience.
        </p>
        <div className="mt-10 w-[280px] mx-auto">
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
          </div>
        ) : (
          filteredTemplates.map((template, index) => (
            <article 
              key={template.id} 
              className="group"
              ref={el => { templateRefs.current[index] = el as HTMLElement }}
            >
              <Link href={template.gumroadLink} target="_blank" rel="noopener noreferrer">
                <div className="relative aspect-square mb-8 overflow-hidden rounded-lg bg-muted transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <Image
                    src={template.image}
                    alt={`${template.title} thumbnail`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {template.categories.map((category) => (
                    <span 
                      key={category}
                      className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                  {template.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-lg font-medium text-foreground">
                    {template.price === '0$' ? 'Free' : template.price}
                  </span>
                  <Link
                    href={template.gumroadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-all duration-300 hover:border-foreground group"
                  >
                    <span className="mr-2">Get Template</span>
                    <svg 
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                {template.productHuntLink && (
                  <a
                    href={template.productHuntLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4"
                  >
                    <img
                      src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${template.id}&theme=dark`}
                      alt={`${template.title} on Product Hunt`}
                      className="h-8"
                    />
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
} 