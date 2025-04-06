'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  end: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ end, suffix = '', className = '', duration = 2000 }: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumber();
        }
      });
    }, { threshold: 0.1 });

    const element = document.getElementById(`animated-number-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();

    function animateNumber() {
      const start = 0;
      const startTime = performance.now();

      function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.round(start + (end - start) * eased);
        setDisplayed(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }, [end, hasAnimated, duration]);

  return (
    <span id={`animated-number-${end}`} className={className}>
      {displayed}{suffix}
    </span>
  );
} 