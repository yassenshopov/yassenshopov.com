'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from 'react';

type RevealOwnProps<T extends ElementType> = {
  /** Element to render. Defaults to `div`. */
  as?: T;
  /** Stagger delay in milliseconds before this element reveals. */
  delay?: number;
};

type RevealProps<T extends ElementType> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

/**
 * Scroll-reveal wrapper that replaces the previous `framer-motion`
 * `whileInView` fade-ins. It's a tiny client leaf — sections that use it can
 * stay React Server Components, so only this ~40-line island ships to the
 * browser instead of an entire section plus framer-motion.
 *
 * The fade/translate and the reduced-motion + no-JS fallbacks live in CSS
 * (`globals.css`, keyed off `[data-reveal]`), so the markup renders fully
 * styled on the server and is progressively enhanced once observed.
 */
export function Reveal<T extends ElementType = 'div'>({
  as,
  delay,
  style,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already in view on mount (e.g. above-the-fold) → reveal immediately.
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          node.setAttribute('data-visible', 'true');
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...rest}
    />
  );
}
