import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"], .cursor-pointer';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on touch / no-hover devices
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };
    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);
    const handleDown = () => setPressing(true);
    const handleUp = () => setPressing(false);

    const handleOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(INTERACTIVE_SELECTOR)) setHovering(true);
    };
    const handleOut = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const related = (e as PointerEvent).relatedTarget as HTMLElement | null;
      const wasInteractive = t?.closest?.(INTERACTIVE_SELECTOR);
      const stillInteractive = related?.closest?.(INTERACTIVE_SELECTOR);
      if (wasInteractive && !stillInteractive) setHovering(false);
    };

    const animate = () => {
      // Dot — fast follow
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;
      // Ring — softer trailing follow
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };

    document.documentElement.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerout", handleOut, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      document.documentElement.classList.remove("custom-cursor-active");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  // Compose visual state
  const ringScale = pressing ? "scale(0.8)" : hovering ? "scale(1.6)" : "scale(1)";
  const dotScale = pressing ? "scale(1.4)" : hovering ? "scale(0)" : "scale(1)";
  const opacity = visible ? 1 : 0;

  return (
    <>
      {/* Outer ring — soft trailing.
          mix-blend-mode: difference makes a white element auto-invert against
          whatever is behind it: white on dark backgrounds, dark on light. */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity,
          mixBlendMode: "difference",
          transition: "opacity 200ms ease",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 38,
            height: 38,
            border: hovering
              ? "1.5px solid rgba(255, 255, 255, 0.95)"
              : "1.5px solid rgba(255, 255, 255, 0.7)",
            background: hovering ? "rgba(255, 255, 255, 0.12)" : "transparent",
            transform: ringScale,
            transformOrigin: "center",
            transition:
              "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease, background 200ms ease",
          }}
        />
      </div>

      {/* Inner dot — fast follow, also blended */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity,
          mixBlendMode: "difference",
          transition: "opacity 200ms ease",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "#FFFFFF",
            transform: dotScale,
            transformOrigin: "center",
            transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </>
  );
}
