'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchPostsProps {
  onSearch: (query: string) => void;
}

export function SearchPosts({ onSearch }: SearchPostsProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search articles..."
        className="pl-9 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
} 