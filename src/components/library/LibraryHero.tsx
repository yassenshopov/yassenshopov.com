'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clapperboard, Monitor, Star, TrendingUp } from 'lucide-react';

interface LibraryStats {
  books: number;
  movies: number;
  series: number;
  avgRating: number;
  thisYear: number;
}

interface LibraryHeroProps {
  stats: LibraryStats;
  onCategoryClick?: (type: string) => void;
}

export default function LibraryHero({ stats, onCategoryClick }: LibraryHeroProps) {
  return (
    <section className="relative py-24 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            My Library
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Books, movies, and series that have shaped my thinking and worldview. 
            Complete with my notes, ratings, and recommendations.
          </p>
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div
              className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
              onClick={onCategoryClick ? () => onCategoryClick('book') : undefined}
              tabIndex={onCategoryClick ? 0 : undefined}
              role={onCategoryClick ? 'button' : undefined}
              aria-label="Filter by books"
            >
              <BookOpen className="w-5 h-5" />
              <span>{stats.books} Books</span>
            </div>
            <div
              className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
              onClick={onCategoryClick ? () => onCategoryClick('movie') : undefined}
              tabIndex={onCategoryClick ? 0 : undefined}
              role={onCategoryClick ? 'button' : undefined}
              aria-label="Filter by movies"
            >
              <Clapperboard className="w-5 h-5" />
              <span>{stats.movies} Movies</span>
            </div>
            <div
              className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
              onClick={onCategoryClick ? () => onCategoryClick('series') : undefined}
              tabIndex={onCategoryClick ? 0 : undefined}
              role={onCategoryClick ? 'button' : undefined}
              aria-label="Filter by series"
            >
              <Monitor className="w-5 h-5" />
              <span>{stats.series} Series</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{stats.avgRating.toFixed(1)} Avg Rating</span>
            </div>
            <div
              className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
              onClick={onCategoryClick ? () => onCategoryClick('thisYear') : undefined}
              tabIndex={onCategoryClick ? 0 : undefined}
              role={onCategoryClick ? 'button' : undefined}
              aria-label="Filter by this year"
            >
              <TrendingUp className="w-5 h-5" />
              <span>{stats.thisYear} This Year</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 