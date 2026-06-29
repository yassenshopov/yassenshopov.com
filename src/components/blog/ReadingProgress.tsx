'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Fixed reading-progress indicator that lives just under the navbar.
 * Tracks the scroll progress of the *page* (not a specific element) and
 * grows from left to right as the reader moves through the article.
 *
 * - Sits directly below the 4rem navbar so it never overlaps content.
 * - Uses a spring on scrollYProgress so the bar feels weighty rather than
 *   twitchy on fast scrolls.
 * - Disabled visually for prefers-reduced-motion users (still rendered, but
 *   without the spring smoothing — the user already opted into instant UI).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent"
    >
      <motion.div
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothed,
          transformOrigin: '0% 50%',
        }}
        className="h-full w-full bg-linear-to-r from-primary/70 via-primary to-primary/70"
      />
    </div>
  );
}
