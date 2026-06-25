'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <motion.div
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 20, repeat: Infinity, ease: 'linear' }
              }
              className="absolute -top-8 -right-8 w-16 h-16 border-4 border-dashed rounded-full border-primary/30"
            />
            <motion.div
              animate={prefersReducedMotion ? undefined : { rotate: -360 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 15, repeat: Infinity, ease: 'linear' }
              }
              className="absolute -bottom-8 -left-8 w-12 h-12 border-4 border-dashed rounded-full border-primary/20"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-bold">Oops! You{'\u2019'}re Lost</h2>
            <p className="text-muted-foreground text-lg">
              The page you{'\u2019'}re looking for seems to have wandered off into the digital
              wilderness. Don{'\u2019'}t worry, we can help you find your way back home.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.4 }}
          >
            <Button asChild size="lg" className="group">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" aria-hidden="true" />
                Take Me Home
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            <p className="mb-4">Or try one of these:</p>
            <div className="flex flex-wrap justify-center gap-6 mt-2">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200 text-secondary-foreground"
              >
                Blog
              </Link>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200 text-secondary-foreground"
              >
                Projects
              </Link>
              <Link
                href="/notion"
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200 text-secondary-foreground"
              >
                Notion Templates
              </Link>
              <Link
                href="/contact-me"
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200 text-secondary-foreground"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
