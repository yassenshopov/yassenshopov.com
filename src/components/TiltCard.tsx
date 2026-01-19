"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = React.HTMLAttributes<HTMLDivElement> & {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
};

export default function TiltCard({
  children,
  className,
  style,
  maxTilt = 6,
  perspective = 900,
  scale = 1.01,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
  );
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const updateTransform = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * maxTilt).toFixed(2);
    const rotateY = (x * maxTilt).toFixed(2);
    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    );
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(event);
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateTransform(event);
    });
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(event);
    setIsHovering(true);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    setIsHovering(false);
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`);
  };

  return (
    <div
      ref={cardRef}
      className={cn("will-change-transform", className)}
      style={{
        ...style,
        transform,
        transformStyle: "preserve-3d",
        transition: isHovering ? "transform 80ms ease-out" : "transform 200ms ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}
