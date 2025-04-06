import { Sparkles } from "lucide-react";

interface NotionHeroProps {
  templateCount: number;
}

export function NotionHero({ templateCount }: NotionHeroProps) {
  return (
    <section className="relative py-16 md:py-24 flex items-center overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="absolute inset-0 bg-grid-white/10 -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{templateCount} templates available</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
            Notion<br />
            Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Streamline your life with my collection of carefully crafted Notion templates.
          </p>
        </div>
      </div>
    </section>
  );
} 