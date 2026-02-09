import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

interface SmoothScrollProps {
  children: ReactNode;
  /** Smoothing amount — higher = more lag/smoothness (default 1.2) */
  smooth?: number;
  /** Scroll speed multiplier (default 1) */
  speed?: number;
  /** Touch device smoothing (default: same as smooth) */
  smoothTouch?: number | false;
  className?: string;
}

export function SmoothScroll({
  children,
  smooth = 1.2,
  speed = 1,
  smoothTouch = false,
  className,
}: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth,
      speed,
      smoothTouch,
      effects: true,
    });

    // Smooth anchor link scrolling with physics easing
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a[href*='#']");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      const hash = href.includes("#") ? `#${href.split("#")[1]}` : null;
      if (!hash) return;

      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();
      smoother.scrollTo(el, true, "top top");
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      smoother.kill();
    };
  }, [smooth, speed, smoothTouch]);

  return (
    <div id="smooth-wrapper" ref={wrapperRef} className={className}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
