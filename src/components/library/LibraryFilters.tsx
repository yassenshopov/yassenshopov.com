'use client';

import { useState } from 'react';
import { 
  Settings, BarChart3, Download, 
  BookOpen, Clapperboard, Monitor, Star,
  SlidersHorizontal
} from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mediaTypes, statusTypes } from '@/data/library';

interface LibraryFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  allGenres: string[];
  sortedItemsLength: number;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onClearFilters: () => void;
}

const iconMap = {
  Filter: SlidersHorizontal,
  BookOpen,
  Clapperboard,
  Monitor,
};

export default function LibraryFilters({
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedGenres,
  setSelectedGenres,
  ratingRange,
  setRatingRange,
  showStats,
  setShowStats,
  allGenres,
  sortedItemsLength,
  onExportCSV,
  onExportJSON,
  onClearFilters,
}: LibraryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev: string[]) => 
      prev.includes(genre) 
        ? prev.filter((g: string) => g !== genre)
        : [...prev, genre]
    );
  };

  const hasActiveFilters = selectedType !== 'all' || 
    selectedStatus !== 'all' || 
    selectedGenres.length > 0 || 
    ratingRange[0] !== 1 || 
    ratingRange[1] !== 5;

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 relative"
          >
            <Settings className="w-6 h-6" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto px-0">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Library filters</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Results Summary */}
            <div className="px-6 pt-6 pb-2 border-b border-muted">
              <div className="text-3xl font-bold text-primary">{sortedItemsLength}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {sortedItemsLength === 1 ? 'item' : 'items'} found
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Media Type */}
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide">Media Type</div>
                <div className="flex flex-col gap-2">
                  {mediaTypes.map((type) => {
                    const Icon = iconMap[type.icon as keyof typeof iconMap];
                    return (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type.value)}
                        className="flex items-center gap-2 h-9 justify-start w-full"
                      >
                        {Icon ? <Icon className="w-4 h-4" /> : null}
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide">Status</div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
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
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide">Genres</div>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {allGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer px-2 py-1 text-xs rounded-md ${selectedGenres.includes(genre) ? 'hover:bg-primary/90' : 'hover:bg-secondary'}`}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rating Range */}
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide flex items-center gap-1"><Star className="w-3 h-3" /> Rating Range</div>
                <div className="flex items-center gap-2">
                  <Select 
                    value={ratingRange[0].toString()} 
                    onValueChange={(value) => setRatingRange([parseInt(value), ratingRange[1]])}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating}★
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">to</span>
                  <Select 
                    value={ratingRange[1].toString()} 
                    onValueChange={(value) => setRatingRange([ratingRange[0], parseInt(value)])}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating}★
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-2 border-t border-muted flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 w-full"
              >
                <BarChart3 className="w-4 h-4" />
                {showStats ? 'Hide' : 'Show'} Analytics
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportCSV}
                  className="flex items-center gap-2 w-1/2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportJSON}
                  className="flex items-center gap-2 w-1/2"
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 