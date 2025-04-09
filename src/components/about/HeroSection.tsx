import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
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
  );
} 