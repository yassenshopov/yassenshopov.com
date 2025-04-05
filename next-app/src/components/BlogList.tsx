'use client';

import { useState } from 'react';
import BlogCard from "@/components/BlogCard";
import { SearchPosts } from "@/components/SearchPosts";
import { type Post } from '@/data/blog-posts';

interface BlogListProps {
  initialPosts: Post[];
}

const BlogList = ({ initialPosts }: BlogListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = initialPosts.filter((post: Post) => {
    const searchContent = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  const featuredPost = initialPosts.find((post: Post) => post.isFeatured);
  const regularPosts = filteredPosts.filter((post: Post) => !post.isFeatured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my thoughts, tutorials, and insights on web development, design, and technology.
          </p>
        </div>

        <SearchPosts onSearch={setSearchQuery} />

        {featuredPost && searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Post</h2>
            <BlogCard
              key={featuredPost.slug}
              title={featuredPost.title}
              description={featuredPost.description}
              date={featuredPost.date}
              slug={featuredPost.slug}
              readingTime={featuredPost.readingTime}
              tags={featuredPost.tags}
              coverImage={featuredPost.coverImage}
              isFeatured={true}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map(post => (
            <BlogCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              readingTime={post.readingTime}
              tags={post.tags}
              coverImage={post.coverImage}
            />
          ))}
        </div>

        {regularPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your search criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList; 