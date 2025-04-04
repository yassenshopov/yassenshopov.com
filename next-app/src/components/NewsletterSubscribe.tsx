'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NewsletterSubscribe() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Subscribe to my newsletter</CardTitle>
        <CardDescription>
          Get notified when I publish new articles about productivity, life design, and personal growth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button type="submit">
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 