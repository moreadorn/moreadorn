import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Slide direction. Default: "up" (fades in + slides up). */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** How much of element must be visible before triggering (0-1). Default 0.12. */
  threshold?: number;
  /** Pixel offset from viewport bottom. Default -80px. */
  rootMarginBottom?: number;
}

const directionTransforms: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  none: "",
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  threshold = 0.12,
  rootMarginBottom = 80,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: `0px 0px -${rootMarginBottom}px 0px`,
      }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMarginBottom]);

  const hiddenTransform = directionTransforms[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hiddenTransform}`
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
