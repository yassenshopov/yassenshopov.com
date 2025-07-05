'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, X, Search, Grid, List, BarChart3, Download, 
  Star, BookOpen, Clapperboard, Monitor 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mediaTypes, statusTypes } from '@/data/library';

interface LibraryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: 'recent' | 'rating' | 'title' | 'date';
  setSortBy: (sort: 'recent' | 'rating' | 'title' | 'date') => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  allGenres: string[];
  sortedItemsLength: number;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onClearFilters: () => void;
}

const iconMap = {
  Filter,
  BookOpen,
  Clapperboard,
  Monitor,
};

export default function LibraryFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedGenres,
  setSelectedGenres,
  ratingRange,
  setRatingRange,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  showStats,
  setShowStats,
  allGenres,
  sortedItemsLength,
  onExportCSV,
  onExportJSON,
  onClearFilters,
}: LibraryFiltersProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40">
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 w-80 max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Library Controls</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-2 flex-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showStats ? 'Hide' : 'Show'} Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRatingRange([5, 5]);
                    setSelectedStatus('completed');
                  }}
                  className="flex items-center gap-2 flex-1"
                >
                  <Star className="w-4 h-4" />
                  5-Star Favorites
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Media Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Media Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {mediaTypes.map((type) => {
                    const Icon = iconMap[type.icon as keyof typeof iconMap];
                    return (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type.value)}
                        className="flex items-center gap-2 h-9 justify-start"
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Genres</label>
                <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                  {allGenres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedGenres((prev: string[]) => 
                          prev.includes(genre) 
                            ? prev.filter((g: string) => g !== genre)
                            : [...prev, genre]
                        );
                      }}
                      className="text-xs h-8 justify-start"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rating Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating Range</label>
                <div className="flex items-center gap-2">
                  <Select value={ratingRange[0].toString()} onValueChange={(value) => setRatingRange([parseInt(value), ratingRange[1]])}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>{rating}★</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">to</span>
                  <Select value={ratingRange[1].toString()} onValueChange={(value) => setRatingRange([ratingRange[0], parseInt(value)])}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>{rating}★</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View & Sort */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">View</label>
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3 flex-1"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3 flex-1"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExportCSV}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExportJSON}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>

              {/* Results Summary */}
              <div className="text-center pt-4 border-t">
                <div className="text-sm font-medium text-foreground">
                  {sortedItemsLength} {sortedItemsLength === 1 ? 'item' : 'items'}
                  {searchQuery && <span className="text-primary"> matching "{searchQuery}"</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Filter className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
} 