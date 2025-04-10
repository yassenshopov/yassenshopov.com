export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
  content: string;
  author: string;
  readingTime?: string;
}

export interface BlogData {
  posts: BlogPost[];
} 