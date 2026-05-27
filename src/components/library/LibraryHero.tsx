'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clapperboard, Star, TrendingUp } from 'lucide-react';

interface LibraryStats {
  books: number;
  movies: number;
  series: number;
  avgRating: number;
  thisYear: number;
}

interface LibraryHeroProps {
  stats: LibraryStats;
}

export default function LibraryHero({ stats }: LibraryHeroProps) {
  const watchables = stats.movies + stats.series;

  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
            My Library
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
            Books, movies, and series that have shaped my thinking and worldview.
            Complete with my notes, ratings, and recommendations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">{stats.books} Books</span>
            </div>
            <div className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">{watchables} Movies &amp; Series</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-sm sm:text-base">{stats.avgRating.toFixed(1)} Avg Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">{stats.thisYear} This Year</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
