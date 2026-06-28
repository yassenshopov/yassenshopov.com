import { compareDesc } from 'date-fns';
import { z } from 'zod';
import blogData from '@/data/blog-posts.json';
import type { BlogPost } from '@/types/blog';

// Validate the post payload at the module boundary. This file is only ever
// imported by server components/route handlers, so Zod stays out of the client
// bundle while still failing the build loudly on malformed content (a missing
// `content`, a bad `date`, etc.) rather than rendering garbage at runtime.
const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid date',
  }),
  coverImage: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  author: z.string(),
  readingTime: z.string().optional(),
}) satisfies z.ZodType<BlogPost>;

const blogDataSchema = z.object({ posts: z.array(blogPostSchema) });

/**
 * A blog post with its derived reading metrics resolved. `readingTime` and
 * `wordCount` are computed once at module load (effectively at build time for
 * the static pages) rather than recomputed on every request/render.
 */
export type ResolvedPost = BlogPost & {
  readingTime: string;
  wordCount: number;
};

const WORDS_PER_MINUTE = 200;

function wordCountOf(content: string): number {
  const trimmed = content.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function readingTimeOf(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))} min read`;
}

// Canonical, newest-first ordering. We sort a *copy* so the imported JSON
// module array is never mutated (a previous in-place `.sort()` on the shared
// array could subtly reorder prev/next navigation elsewhere).
const validatedPosts = blogDataSchema.parse(blogData).posts;
const posts: ResolvedPost[] = [...validatedPosts]
  .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  .map((post) => {
    const wordCount = wordCountOf(post.content);
    return { ...post, wordCount, readingTime: readingTimeOf(wordCount) };
  });

const indexBySlug = new Map(posts.map((post, index) => [post.slug, index]));

/** All posts, newest first, with reading metrics resolved. */
export function getAllPosts(): ResolvedPost[] {
  return posts;
}

/**
 * A single post plus its neighbours in the newest-first ordering. `nextPost`
 * is the chronologically newer post, `prevPost` the older one. Returns `null`
 * for an unknown slug.
 */
export function getPostBySlug(slug: string): {
  post: ResolvedPost;
  prevPost: ResolvedPost | null;
  nextPost: ResolvedPost | null;
} | null {
  const index = indexBySlug.get(slug);
  if (index === undefined) return null;

  return {
    post: posts[index],
    nextPost: index > 0 ? posts[index - 1] : null,
    prevPost: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
