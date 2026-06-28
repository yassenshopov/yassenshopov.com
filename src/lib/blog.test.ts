import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from './blog';

describe('getAllPosts', () => {
  const posts = getAllPosts();

  it('returns posts', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('is sorted newest-first by date', () => {
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it('resolves reading metrics for every post', () => {
    for (const post of posts) {
      expect(post.readingTime).toMatch(/^\d+ min read$/);
      expect(post.wordCount).toBeGreaterThan(0);
    }
  });

  it('does not mutate across calls (stable reference / order)', () => {
    expect(getAllPosts()).toBe(posts);
  });
});

describe('getPostBySlug', () => {
  const posts = getAllPosts();

  it('returns null for an unknown slug', () => {
    expect(getPostBySlug('definitely-not-a-real-slug')).toBeNull();
  });

  it('links neighbours consistently with the sorted order', () => {
    const middleIndex = Math.floor(posts.length / 2);
    const target = posts[middleIndex];
    const resolved = getPostBySlug(target.slug);
    expect(resolved).not.toBeNull();
    expect(resolved!.post.slug).toBe(target.slug);
    // nextPost is the chronologically newer (earlier index) neighbour.
    expect(resolved!.nextPost?.slug).toBe(posts[middleIndex - 1]?.slug);
    expect(resolved!.prevPost?.slug).toBe(posts[middleIndex + 1]?.slug);
  });

  it('gives the newest post no newer neighbour', () => {
    const newest = getPostBySlug(posts[0].slug);
    expect(newest!.nextPost).toBeNull();
  });

  it('gives the oldest post no older neighbour', () => {
    const oldest = getPostBySlug(posts[posts.length - 1].slug);
    expect(oldest!.prevPost).toBeNull();
  });
});
