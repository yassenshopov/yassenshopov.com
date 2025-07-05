'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, BookOpen, Clapperboard, Monitor } from 'lucide-react';
import { LibraryItem } from '@/data/library';

interface LibraryStatsProps {
  showStats: boolean;
  libraryItems: LibraryItem[];
  stats: {
    totalCompleted: number;
    books: number;
    movies: number;
    series: number;
    avgRating: number;
    topGenres: [string, number][];
    thisYear: number;
    fiveStarCount: number;
  };
  isLoading?: boolean;
}

// Skeleton component for loading state
function StatCardSkeleton() {
  return (
    <div className="bg-background rounded-lg p-6 border">
      <div className="h-6 bg-muted animate-pulse rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="w-20 h-4 bg-muted animate-pulse rounded" />
            <div className="w-8 h-4 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LibraryStats({ showStats, libraryItems, stats, isLoading = false }: LibraryStatsProps) {
  return (
    <AnimatePresence>
      {showStats && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="py-12 bg-muted/50"
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Show skeleton loading state
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                // Show actual stats
                <>
                  {/* Total Stats */}
                  <div className="bg-background rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-4">Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Completed</span>
                        <span className="font-medium">{stats.totalCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">5-Star Items</span>
                        <span className="font-medium">{stats.fiveStarCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">This Year</span>
                        <span className="font-medium">{stats.thisYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="bg-background rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-4">Rating Distribution</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = libraryItems.filter(item => item.rating === rating && item.status === 'completed').length;
                        const percentage = stats.totalCompleted > 0 ? (count / stats.totalCompleted) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: rating }, (_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Genres */}
                  <div className="bg-background rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-4">Top Genres</h3>
                    <div className="space-y-2">
                      {stats.topGenres.map(([genre, count]) => (
                        <div key={genre} className="flex justify-between items-center">
                          <span className="text-sm">{genre}</span>
                          <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media Breakdown */}
                  <div className="bg-background rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-4">Media Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Books</span>
                        </div>
                        <span className="font-medium">{stats.books}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clapperboard className="w-4 h-4" />
                          <span>Movies</span>
                        </div>
                        <span className="font-medium">{stats.movies}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          <span>Series</span>
                        </div>
                        <span className="font-medium">{stats.series}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
} 