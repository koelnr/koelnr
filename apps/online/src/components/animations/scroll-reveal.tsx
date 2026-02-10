"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  /** Stagger children elements by this interval (seconds) */
  stagger?: number;
  /** CSS selector to target children for staggering (e.g. "> div", ".card") */
  staggerTarget?: string;
  /** ScrollTrigger start position */
  start?: string;
  className?: string;
  /** Set false to animate on mount instead of on scroll */
  scroll?: boolean;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 40,
  stagger,
  staggerTarget,
  start = "top 85%",
  className,
  scroll = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offset = directionOffset[direction];
    const targets =
      stagger && staggerTarget ? el.querySelectorAll(staggerTarget) : el;

    gsap.set(targets, {
      opacity: 0,
      x: offset.x * distance,
      y: offset.y * distance,
    });

    const tween = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      stagger: stagger || 0,
      scrollTrigger: scroll
        ? {
            trigger: el,
            start,
            toggleActions: "play none none none",
          }
        : undefined,
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [
    direction,
    delay,
    duration,
    distance,
    stagger,
    staggerTarget,
    start,
    scroll,
  ]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
