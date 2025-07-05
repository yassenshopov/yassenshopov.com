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
  isLoading?: boolean;
}

// Skeleton component for loading state
function StatSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted animate-pulse rounded" />
      <div className="w-12 h-4 bg-muted animate-pulse rounded" />
    </div>
  );
}

export default function LibraryHero({ stats, onCategoryClick, isLoading = false }: LibraryHeroProps) {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
            My Library
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
            Books, movies, and series that have shaped my thinking and worldview. 
            Complete with my notes, ratings, and recommendations.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-muted-foreground">
            {isLoading ? (
              // Show skeleton loading state
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              // Show actual stats
              <>
                <div
                  className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
                  onClick={onCategoryClick ? () => onCategoryClick('book') : undefined}
                  tabIndex={onCategoryClick ? 0 : undefined}
                  role={onCategoryClick ? 'button' : undefined}
                  aria-label="Filter by books"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{stats.books} Books</span>
                </div>
                <div
                  className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
                  onClick={onCategoryClick ? () => onCategoryClick('movie') : undefined}
                  tabIndex={onCategoryClick ? 0 : undefined}
                  role={onCategoryClick ? 'button' : undefined}
                  aria-label="Filter by movies"
                >
                  <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{stats.movies} Movies</span>
                </div>
                <div
                  className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
                  onClick={onCategoryClick ? () => onCategoryClick('series') : undefined}
                  tabIndex={onCategoryClick ? 0 : undefined}
                  role={onCategoryClick ? 'button' : undefined}
                  aria-label="Filter by series"
                >
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{stats.series} Series</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm sm:text-base">{stats.avgRating.toFixed(1)} Avg Rating</span>
                </div>
                <div
                  className={`flex items-center gap-2 transition cursor-pointer ${onCategoryClick ? 'hover:text-primary' : ''}`}
                  onClick={onCategoryClick ? () => onCategoryClick('thisYear') : undefined}
                  tabIndex={onCategoryClick ? 0 : undefined}
                  role={onCategoryClick ? 'button' : undefined}
                  aria-label="Filter by this year"
                >
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{stats.thisYear} This Year</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 