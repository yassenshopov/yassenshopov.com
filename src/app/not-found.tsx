'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-2xl"
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="relative"
        >
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-8 -right-8 w-16 h-16 border-4 border-dashed rounded-full border-primary/30"
          />
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-8 -left-8 w-12 h-12 border-4 border-dashed rounded-full border-primary/20"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-bold">Oops! You're Lost</h2>
          <p className="text-muted-foreground text-lg">
            The page you're looking for seems to have wandered off into the digital wilderness.
            Don't worry, we can help you find your way back home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">
            <Button size="lg" className="group">
              <Home className="mr-2 h-5 w-5" />
              Take Me Home
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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
  );
} 