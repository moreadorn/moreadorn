import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: boolean; // adds thousand separators
  className?: string;
}

export function CountUp({
  end,
  duration = 1800,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = true,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion: snap to final value
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(end);
      startedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(end * eased);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setValue(end);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  const display = (() => {
    if (decimals > 0) {
      return value.toFixed(decimals);
    }
    const rounded = Math.floor(value);
    return separator ? rounded.toLocaleString() : String(rounded);
  })();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
