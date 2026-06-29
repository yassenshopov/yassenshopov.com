'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import FullscreenImage from './FullscreenImage';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  mainImg: string;
  mainImgCaption: string;
  sideImg: string;
  sideImgCaption: string;
  links: { text: string; url: string }[];
  index: number;
}

type FullscreenTarget = { src: string; alt: string; caption: string };

export default function TimelineItem({
  year,
  title,
  description,
  icon,
  color,
  mainImg,
  mainImgCaption,
  sideImg,
  sideImgCaption,
  links,
  index,
}: TimelineItemProps) {
  const [fullscreenImage, setFullscreenImage] = useState<FullscreenTarget | null>(null);

  // Even rows put the card on the left and the images on the right; odd rows
  // mirror it. The two layouts are otherwise identical, so render one set of
  // shared blocks and just flip their order + the image rotation direction.
  const cardOnLeft = index % 2 === 0;

  const card = (
    <div className="md:w-1/2">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 group overflow-visible relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={`${color} group-hover:scale-110 transition-transform`}>{icon}</div>
          <div className="text-primary font-bold">{year}</div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {links.map((link) => (
                  <Link
                    key={`${link.text}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-[transform,color,background-color] duration-300 hover:scale-105 hover:-translate-y-0.5 border border-white/10"
                  >
                    {link.text}
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const images = mainImg ? (
    <div className="hidden md:block md:w-1/2">
      <div className="relative aspect-video group/images">
        <button
          type="button"
          onClick={() => setFullscreenImage({ src: mainImg, alt: title, caption: mainImgCaption })}
          aria-label={`View image for ${title}`}
          className={`block w-full relative aspect-video rounded-lg overflow-hidden transform transition-all duration-300 group-hover/images:scale-105 group-hover/images:-translate-y-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            cardOnLeft ? 'group-hover/images:rotate-1' : 'group-hover/images:-rotate-1'
          }`}
        >
          <Image src={mainImg} alt={title} fill className="object-contain" />
        </button>
        {sideImg && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage({
                src: sideImg,
                alt: `${title} (detail)`,
                caption: sideImgCaption,
              });
            }}
            aria-label={`View detail image for ${title}`}
            style={{ transformOrigin: 'center center' }}
            className={`absolute -top-6 w-24 h-24 transform transition-all duration-300 z-10 cursor-pointer backdrop-blur-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
              cardOnLeft
                ? '-right-6 rotate-3 group-hover/images:rotate-12 group-hover/images:translate-x-2 group-hover/images:-translate-y-2'
                : '-left-6 -rotate-3 group-hover/images:-rotate-12 group-hover/images:-translate-x-2 group-hover/images:-translate-y-2'
            }`}
          >
            <Image src={sideImg} alt={`${title} (detail)`} fill className="object-contain" />
          </button>
        )}
      </div>
    </div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Mobile Timeline Dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary md:hidden" />

      <div className="flex items-start gap-8">
        {cardOnLeft ? (
          <>
            {card}
            {images}
          </>
        ) : (
          <>
            {images}
            {card}
          </>
        )}
      </div>

      {fullscreenImage && (
        <FullscreenImage
          src={fullscreenImage.src}
          alt={fullscreenImage.alt}
          caption={fullscreenImage.caption}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </motion.div>
  );
}
