export type Post = {
  title: string;
  description: string;
  date: string;
  slug: string;
  readingTime: string;
  tags: string[];
  coverImage: string;
  isFeatured?: boolean;
}; 