'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, ArrowDown } from 'lucide-react';

export function BlogHero() {
  const scrollToNewsletter = () => {
    const newsletterSection = document.getElementById('newsletter');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="absolute inset-0 bg-grid-white/10 -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <BookOpen className="w-4 h-4" />
            <span>A blog series by Yassen Shopov</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
            Life Engineering:<br />
            <span className="text-primary">Ideas That Matter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Exploring the intersection of productivity, personal development, and intentional living through practical insights and real experiences.
          </p>
          <Button onClick={scrollToNewsletter} className="group">
            Join the Journey
            <ArrowDown className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      </div>
    </section>
  );
} 