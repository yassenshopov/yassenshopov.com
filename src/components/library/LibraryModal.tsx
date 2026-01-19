'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Star, Calendar, Clock, 
  ExternalLink, BookOpen, Clapperboard, Monitor, MessageSquare 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LibraryItem } from '@/data/library';

interface LibraryModalProps {
  selectedItem: LibraryItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isTransitioning: boolean;
  sortedItems: LibraryItem[];
  getCreatorLabel: (item: LibraryItem) => string;
  getStatusColor: (status: string) => string;
  getRelatedItems: (item: LibraryItem, limit?: number) => LibraryItem[];
  getSeriesInfo: (item: LibraryItem) => any;
  getRelationshipLabel: (fromItem: LibraryItem, toItem: LibraryItem) => string;
  onSelectItem: (item: LibraryItem) => void;
}

// Add a helper to boost color vividness
function boostColor(rgb: string, satBoost = 1.3, lightBoost = 1.15) {
  let [r, g, b] = rgb.split(',').map(Number);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  s = Math.min(s * satBoost, 1);
  l = Math.min(l * lightBoost, 1);
  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  g = Math.round(hue2rgb(p, q, h) * 255);
  b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  return `${r},${g},${b}`;
}

export default function LibraryModal({
  selectedItem,
  onClose,
  onNavigate,
  isTransitioning,
  sortedItems,
  getCreatorLabel,
  getStatusColor,
  getRelatedItems,
  getSeriesInfo,
  getRelationshipLabel,
  onSelectItem,
}: LibraryModalProps) {
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [colorCache, setColorCache] = useState<{ [key: string]: string[] }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Extract dominant colors from image
  const extractColorsFromImage = (imageSrc: string) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      const colorCounts: { [key: string]: number } = {};
      
      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];
        
        if (alpha < 125) continue; // Skip transparent pixels
        
        // Skip very dark or very light colors
        const brightness = (r + g + b) / 3;
        if (brightness < 30 || brightness > 225) continue;
        
        const color = `${r},${g},${b}`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
      
      // Get top 4 most frequent colors
      const sortedColors = Object.entries(colorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([color]) => color);
      
      // Cache the results
      setColorCache(prev => ({ ...prev, [imageSrc]: sortedColors }));
      setDominantColors(sortedColors);
    };
    img.src = imageSrc;
  };

  // Extract colors when modal opens (with caching)
  useEffect(() => {
    if (selectedItem?.coverImage) {
      // Check cache first
      if (colorCache[selectedItem.coverImage]) {
        setDominantColors(colorCache[selectedItem.coverImage]);
      } else {
        // Extract colors in next frame to avoid blocking
        requestAnimationFrame(() => {
          extractColorsFromImage(selectedItem.coverImage!);
        });
      }
    } else {
      setDominantColors([]);
    }
  }, [selectedItem, colorCache]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-12 h-12" />;
      case 'movie':
        return <Clapperboard className="w-12 h-12" />;
      case 'series':
        return <Monitor className="w-12 h-12" />;
      default:
        return null;
    }
  };

  if (!selectedItem) return null;

  // When using dominantColors in the gradient, boost them:
  const boostedColors = dominantColors.map(c => boostColor(c));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-hidden bg-background rounded-2xl border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-6 sm:right-6 z-20 rounded-full w-10 h-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <X className="w-6 h-6 sm:w-5 sm:h-5" />
          </Button>

          {/* Navigation buttons */}
          {sortedItems.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('prev')}
                disabled={isTransitioning}
                className="absolute top-6 left-6 z-20 rounded-full w-10 h-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 disabled:opacity-50 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('next')}
                disabled={isTransitioning}
                className="absolute top-6 left-20 z-20 rounded-full w-10 h-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 disabled:opacity-50 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          <div className="overflow-y-auto max-h-[95vh]">
            {/* Hidden canvas for color extraction */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* Hero Section */}
            <div className="relative p-4 sm:p-8 md:p-12 pb-6 sm:pb-8 overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 opacity-25 dark:opacity-28">
                {dominantColors.length > 0 ? (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse 120% 80% at 10% 50%, rgba(${boostedColors[0]}, 0.8) 0%, transparent 70%), 
                                  radial-gradient(ellipse 100% 60% at 15% 30%, rgba(${boostedColors[1] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                                  radial-gradient(ellipse 80% 100% at 5% 70%, rgba(${boostedColors[2] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                                  radial-gradient(ellipse 60% 80% at 20% 80%, rgba(${boostedColors[3] || boostedColors[0]}, 0.4) 0%, transparent 50%)`
                    }}
                    animate={{
                      background: [
                        `radial-gradient(ellipse 120% 80% at 10% 50%, rgba(${boostedColors[0]}, 0.8) 0%, transparent 70%), 
                         radial-gradient(ellipse 100% 60% at 15% 30%, rgba(${boostedColors[1] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 80% 100% at 5% 70%, rgba(${boostedColors[2] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 60% 80% at 20% 80%, rgba(${boostedColors[3] || boostedColors[0]}, 0.4) 0%, transparent 50%)`,
                        `radial-gradient(ellipse 100% 60% at 25% 20%, rgba(${boostedColors[1] || boostedColors[0]}, 0.8) 0%, transparent 70%), 
                         radial-gradient(ellipse 80% 100% at 0% 85%, rgba(${boostedColors[2] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 60% 80% at 30% 60%, rgba(${boostedColors[3] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 120% 80% at 5% 40%, rgba(${boostedColors[0]}, 0.4) 0%, transparent 50%)`,
                        `radial-gradient(ellipse 80% 100% at 0% 85%, rgba(${boostedColors[2] || boostedColors[0]}, 0.8) 0%, transparent 70%), 
                         radial-gradient(ellipse 60% 80% at 30% 60%, rgba(${boostedColors[3] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 120% 80% at 5% 40%, rgba(${boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 100% 60% at 25% 20%, rgba(${boostedColors[1] || boostedColors[0]}, 0.4) 0%, transparent 50%)`,
                        `radial-gradient(ellipse 60% 80% at 30% 60%, rgba(${boostedColors[3] || boostedColors[0]}, 0.8) 0%, transparent 70%), 
                         radial-gradient(ellipse 120% 80% at 5% 40%, rgba(${boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 100% 60% at 25% 20%, rgba(${boostedColors[1] || boostedColors[0]}, 0.6) 0%, transparent 60%), 
                         radial-gradient(ellipse 80% 100% at 0% 85%, rgba(${boostedColors[2] || boostedColors[0]}, 0.4) 0%, transparent 50%)`
                      ]
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/20" />
                )}
              </div>
              
              {/* Content overlay */}
              <div className="relative z-10 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-xl p-8">
                <motion.div 
                  key={selectedItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isTransitioning ? 0.4 : 1, y: isTransitioning ? 5 : 0 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col md:flex-row items-start gap-4 md:gap-8"
                >
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-48 sm:w-40 sm:h-60 relative bg-muted dark:bg-black rounded-xl overflow-hidden border mx-auto md:mx-0">
                      {selectedItem.coverImage ? (
                        <Image
                          src={selectedItem.coverImage}
                          alt={selectedItem.title}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          {getTypeIcon(selectedItem.type)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title and Meta */}
                  <div className="flex-1 space-y-3 mt-4 md:mt-0">
                    <div>
                      <div className="flex items-start gap-3 mb-1">
                        <h1 className="text-2xl font-bold flex-1">{selectedItem.title}</h1>
                        {selectedItem.series && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2 py-1 mt-1">
                            <span className="text-xs font-medium">
                              {selectedItem.series} #{selectedItem.seriesOrder}
                            </span>
                          </Badge>
                        )}
                      </div>
                      {getCreatorLabel(selectedItem) && (
                        <p className="text-muted-foreground">by {getCreatorLabel(selectedItem)}</p>
                      )}
                      {selectedItem.series && (() => {
                        const seriesInfo = getSeriesInfo(selectedItem);
                        return seriesInfo && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Part {seriesInfo.currentIndex + 1} of {seriesInfo.totalItems} in the {selectedItem.series} series
                          </p>
                        );
                      })()}
                    </div>

                    {/* Rating and Status */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {renderStars(selectedItem.rating)}
                        <span className="text-sm font-medium ml-1">
                          {selectedItem.rating}/5
                        </span>
                      </div>
                      <Badge className={`${getStatusColor(selectedItem.status)} text-xs px-2 py-1`}>
                        {selectedItem.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.genre.map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs px-2 py-1">
                          {g}
                        </Badge>
                      ))}
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-6 text-muted-foreground">
                      {selectedItem.dateCompleted && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Completed {new Date(selectedItem.dateCompleted).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedItem.dateStarted && selectedItem.status === 'in-progress' && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Started {new Date(selectedItem.dateStarted).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Content Section */}
            <motion.div 
              key={`content-${selectedItem.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isTransitioning ? 0.4 : 1, y: isTransitioning ? 5 : 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1], delay: 0.03 }}
              className="p-8 space-y-6 bg-background/95 backdrop-blur-sm"
            >
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Personal Notes */}
              {selectedItem.notes && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    My Thoughts
                  </h2>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-200 dark:border-blue-800/30">
                    <p className="leading-relaxed text-gray-800 dark:text-gray-200">{selectedItem.notes}</p>
                  </div>
                </div>
              )}

              {/* External Links */}
              {selectedItem.links && Object.keys(selectedItem.links).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Links</h2>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(selectedItem.links).map(([platform, url]) => (
                      url && (
                        <Link
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-lg text-sm transition-all"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Related Items */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Related & Connected Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRelatedItems(selectedItem, 6).map((relatedItem) => (
                    <div
                      key={relatedItem.id}
                      className="cursor-pointer group flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-all"
                      onClick={() => onSelectItem(relatedItem)}
                    >
                      <div className="w-16 h-20 relative bg-muted dark:bg-black rounded-md overflow-hidden flex-shrink-0">
                        {relatedItem.coverImage ? (
                          <Image
                            src={relatedItem.coverImage}
                            alt={relatedItem.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            {getTypeIcon(relatedItem.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {relatedItem.title}
                          </h3>
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                            {getRelationshipLabel(selectedItem, relatedItem)}
                          </Badge>
                        </div>
                        {getCreatorLabel(relatedItem) && (
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                            by {getCreatorLabel(relatedItem)}
                          </p>
                        )}
                        {relatedItem.series && (
                          <p className="text-xs text-primary mb-1">
                            {relatedItem.series} #{relatedItem.seriesOrder}
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: relatedItem.rating }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {relatedItem.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 