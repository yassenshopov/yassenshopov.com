'use client';

import { motion } from 'framer-motion';
import { Star, Heart, BookOpen, Clapperboard, Monitor, Copy, Check, Clock, Bookmark, Eye } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LibraryItem } from '@/data/library';
import { useEffect, useState } from 'react';

interface LibraryItemCardProps {
  item: LibraryItem;
  viewMode: 'grid' | 'list';
  favorites: string[];
  animatingHearts: string[];
  copiedId: string | null;
  onItemClick: (item: LibraryItem) => void;
  onToggleFavorite: (itemId: string) => void;
  getCreatorLabel: (item: LibraryItem) => string;
  getStatusColor: (status: string) => string;
  getReadingTime: (item: LibraryItem) => string;
}

// Utility to cache images in localStorage
async function getCachedImage(url: string, cacheKey: string): Promise<string> {
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      try { localStorage.setItem(cacheKey, dataUrl); } catch {}
      resolve(dataUrl);
    };
    reader.readAsDataURL(blob);
  });
}

function isValidDataUrl(dataUrl: string | null): boolean {
  return !!dataUrl && dataUrl.startsWith('data:image/');
}

const statusIconMap: Record<string, JSX.Element> = {
  completed: <Check className="w-4 h-4" />,
  'in-progress': <Clock className="w-4 h-4" />,
  'want-to-read': <Bookmark className="w-4 h-4" />,
  'want-to-watch': <Eye className="w-4 h-4" />,
};
const statusLabelMap: Record<string, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  'want-to-read': 'Want to Read',
  'want-to-watch': 'Want to Watch',
};

export default function LibraryItemCard({
  item,
  viewMode,
  favorites,
  animatingHearts,
  copiedId,
  onItemClick,
  onToggleFavorite,
  getCreatorLabel,
  getStatusColor,
  getReadingTime,
}: LibraryItemCardProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(item.coverImage);
  useEffect(() => {
    let isMounted = true;
    if (item.coverImage) {
      const cacheKey = `cover-${item.id}`;
      const cached = localStorage.getItem(cacheKey);
      if (isValidDataUrl(cached)) {
        setImgSrc(cached!);
      } else {
        setImgSrc(item.coverImage); // Show direct URL immediately
        getCachedImage(item.coverImage, cacheKey)
          .then((dataUrl) => { if (isMounted && isValidDataUrl(dataUrl)) setImgSrc(dataUrl); })
          .catch(() => { if (isMounted) setImgSrc(item.coverImage); });
      }
    }
    return () => { isMounted = false; };
  }, [item.coverImage, item.id]);

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
        return <BookOpen className="w-5 h-5 text-muted-foreground" />;
      case 'movie':
        return <Clapperboard className="w-5 h-5 text-muted-foreground" />;
      case 'series':
        return <Monitor className="w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTypeIconLarge = (type: string) => {
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

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden h-full hover:bg-muted/50 transition-all group cursor-pointer flex flex-row p-4" onClick={() => onItemClick(item)}>
        <div className="flex-shrink-0 w-16 h-20 bg-muted dark:bg-black rounded-lg mr-4 overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={item.title}
              width={64}
              height={80}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {getTypeIconLarge(item.type)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate flex items-center gap-2">
                {getTypeIcon(item.type)}
                {item.title}
              </h3>
              {getCreatorLabel(item) && (
                <p className="text-muted-foreground text-sm mb-2">
                  by {getCreatorLabel(item)}
                </p>
              )}
              {item.series && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {item.series} #{item.seriesOrder}
                  </Badge>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-2">
                {item.genre.slice(0, 4).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {getReadingTime(item)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="flex items-center gap-1">
                {renderStars(item.rating)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className="p-1 h-8 w-8 relative overflow-hidden"
              >
                <motion.div
                  animate={animatingHearts.includes(item.id) ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, -10, 10, 0],
                  } : {}}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="relative"
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 ${
                    favorites.includes(item.id) 
                      ? 'fill-red-500 text-red-500 drop-shadow-sm' 
                      : 'text-muted-foreground hover:text-red-500 hover:scale-110'
                  }`} />
                  
                  {animatingHearts.includes(item.id) && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-full bg-red-500/20"
                    />
                  )}
                  
                  {animatingHearts.includes(item.id) && !favorites.includes(item.id) && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            scale: 0,
                            x: 0,
                            y: 0,
                            opacity: 1
                          }}
                          animate={{ 
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 24],
                            y: [0, (Math.random() - 0.5) * 24],
                            opacity: [1, 1, 0]
                          }}
                          transition={{ 
                            duration: 0.6,
                            delay: i * 0.1,
                            ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-400 rounded-full pointer-events-none"
                          style={{
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="overflow-hidden h-full hover:bg-muted/50 transition-all group cursor-pointer" onClick={() => onItemClick(item)}>
      <div className="aspect-video relative bg-black dark:bg-black bg-muted flex items-center justify-center">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.title}
            fill
            className="object-contain"
          />
        ) : (
          <div className="text-muted-foreground transition-transform group-hover:scale-105">
            {getTypeIconLarge(item.type)}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            className={
              getStatusColor(item.status) +
              ' flex items-center gap-1 font-semibold px-2 py-1 text-sm transition-all duration-200 overflow-hidden max-w-[2rem] group hover:max-w-[10rem] cursor-pointer'
            }
            style={{ minWidth: '2rem' }}
          >
            {statusIconMap[item.status]}
            <span className="ml-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {statusLabelMap[item.status]}
            </span>
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="p-1 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 relative overflow-hidden"
          >
            <motion.div
              animate={animatingHearts.includes(item.id) ? {
                scale: [1, 1.4, 1],
                rotate: [0, -15, 15, 0],
              } : {}}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="relative"
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${
                favorites.includes(item.id) 
                  ? 'fill-red-500 text-red-500 drop-shadow-lg' 
                  : 'text-muted-foreground hover:text-red-500 hover:scale-110'
              }`} />
              
              {animatingHearts.includes(item.id) && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-red-500/30"
                  />
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute inset-0 rounded-full bg-red-500/40"
                  />
                </>
              )}
              
              {animatingHearts.includes(item.id) && !favorites.includes(item.id) && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        scale: 0,
                        x: 0,
                        y: 0,
                        opacity: 1
                      }}
                      animate={{ 
                        scale: [0, 1.2, 0],
                        x: [0, (Math.random() - 0.5) * 32],
                        y: [0, (Math.random() - 0.5) * 32],
                        opacity: [1, 1, 0],
                        rotate: [0, Math.random() * 360]
                      }}
                      transition={{ 
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full pointer-events-none"
                      style={{
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                  
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`heart-${i}`}
                      initial={{ 
                        scale: 0,
                        x: 0,
                        y: 0,
                        opacity: 0.8
                      }}
                      animate={{ 
                        scale: [0, 0.6, 0],
                        x: [0, (Math.random() - 0.5) * 28],
                        y: [0, -Math.random() * 20 - 10],
                        opacity: [0.8, 0.8, 0]
                      }}
                      transition={{ 
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 pointer-events-none"
                      style={{
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Heart className="w-2 h-2 fill-red-400 text-red-400" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </Button>
        </div>
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
              {getTypeIcon(item.type)}
              {item.title}
            </h3>
            {getCreatorLabel(item) && (
              <p className="text-muted-foreground text-sm mt-1">
                by {getCreatorLabel(item)}
              </p>
            )}
            {item.series && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {item.series} #{item.seriesOrder}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {renderStars(item.rating)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.genre.map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            {getReadingTime(item)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-6">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
} 