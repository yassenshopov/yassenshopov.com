'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mediaTypes, statusTypes } from '@/data/library';

interface FilterBadgesProps {
  searchQuery: string;
  selectedType: string;
  selectedStatus: string;
  selectedGenres: string[];
  ratingRange: [number, number];
  showThisYearOnly?: boolean;
  onRemoveThisYear?: () => void;
  onRemoveSearch: () => void;
  onRemoveType: () => void;
  onRemoveStatus: () => void;
  onRemoveGenre: (genre: string) => void;
  onRemoveRating: () => void;
}

export default function FilterBadges({
  searchQuery,
  selectedType,
  selectedStatus,
  selectedGenres,
  ratingRange,
  showThisYearOnly,
  onRemoveThisYear,
  onRemoveSearch,
  onRemoveType,
  onRemoveStatus,
  onRemoveGenre,
  onRemoveRating,
}: FilterBadgesProps) {
  const hasActiveFilters = searchQuery || 
    selectedType !== 'all' || 
    selectedStatus !== 'all' || 
    selectedGenres.length > 0 || 
    ratingRange[0] !== 1 || 
    ratingRange[1] !== 5 ||
    showThisYearOnly;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search Badge */}
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>Search: "{searchQuery}"</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveSearch}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {/* Type Badge */}
      {selectedType !== 'all' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>
            {mediaTypes.find(type => type.value === selectedType)?.label || selectedType}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveType}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {/* Status Badge */}
      {selectedStatus !== 'all' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>
            {statusTypes.find(status => status.value === selectedStatus)?.label || selectedStatus}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveStatus}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {/* Genre Badges */}
      {selectedGenres.map((genre) => (
        <Badge key={genre} variant="secondary" className="flex items-center gap-1">
          <span>{genre}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveGenre(genre)}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      ))}

      {/* Rating Badge */}
      {(ratingRange[0] !== 1 || ratingRange[1] !== 5) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>{ratingRange[0]}★ - {ratingRange[1]}★</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveRating}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {/* This Year Badge */}
      {showThisYearOnly && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>This Year</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveThisYear}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
} 