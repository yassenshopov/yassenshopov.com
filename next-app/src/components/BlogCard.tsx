import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { type Post } from 'contentlayer/generated';

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  readingTime: string;
  tags: string[];
  coverImage?: string;
  isFeatured?: boolean;
}

export function BlogCard({
  title,
  description,
  slug,
  date,
  readingTime,
  tags,
  coverImage,
  isFeatured = false,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className={`block group ${isFeatured ? 'md:col-span-2' : ''}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        {coverImage && (
          <div className={`aspect-video relative ${isFeatured ? 'md:aspect-[2/1]' : ''}`}>
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <time dateTime={date}>{format(new Date(date), 'MMMM d, yyyy')}</time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default BlogCard; 