import type { BlogPost } from '@/types/blog';

// Card/list view of a blog post: the shared fields from the canonical
// `BlogPost` type (see src/types/blog.ts), with reading time required and an
// optional "featured" flag. Derived from BlogPost so the two never drift.
export type Post = Pick<
  BlogPost,
  'title' | 'description' | 'date' | 'slug' | 'tags' | 'coverImage'
> & {
  readingTime: string;
  isFeatured?: boolean;
};
