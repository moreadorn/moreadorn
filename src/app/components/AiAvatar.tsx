interface AiAvatarProps {
  /** Kept for API compatibility — no longer used now that the avatar is inline. */
  seed?: string;
  /** Pixel size of the rendered avatar. */
  size?: number;
  /** Optional className for the wrapper. */
  className?: string;
  /**
   * Visual treatment of the wrapper. "ring" adds a subtle gold ring + soft
   * shadow; "plain" is a flat avatar without the frame.
   */
  variant?: "ring" | "plain";
}

/**
 * Friendly business-style AI bot avatar drawn as inline SVG.
 *
 * - Rendered in-process so it can never 404, time out, or fall back to a
 *   plain initial disc.
 * - Visual language matches the sample reference: white robot head with a
 *   dark visor + two glowing blue eyes, a small smile, headphones, and a
 *   tiny glowing antenna.
 * - Scales cleanly to any size; the warm peach/cream gradient background
 *   keeps it consistent with the rest of the chat UI.
 */
export function AiAvatar({
  size = 48,
  className = "",
  variant = "ring",
}: AiAvatarProps) {
  const wrapperRing =
    variant === "ring"
      ? "ring-1 ring-black/5 shadow-[0_4px_16px_-6px_rgba(11,11,11,0.18)]"
      : "";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full overflow-hidden ${wrapperRing} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4DD" />
            <stop offset="55%" stopColor="#FFE9C2" />
            <stop offset="100%" stopColor="#F4ECDB" />
          </linearGradient>
          <linearGradient id="aiSuit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F2A44" />
            <stop offset="100%" stopColor="#0F1730" />
          </linearGradient>
          <linearGradient id="aiHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6E9F0" />
          </linearGradient>
          <radialGradient id="aiVisor" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1A2240" />
            <stop offset="100%" stopColor="#0A1024" />
          </radialGradient>
          <radialGradient id="aiEye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7FD4FF" />
            <stop offset="60%" stopColor="#3AA8FF" />
            <stop offset="100%" stopColor="#1A6FCC" />
          </radialGradient>
          <radialGradient id="aiAntenna" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8E6FF" />
            <stop offset="100%" stopColor="#1A8AD6" />
          </radialGradient>
        </defs>

        {/* warm background disc */}
        <circle cx="50" cy="50" r="50" fill="url(#aiBg)" />

        {/* shoulders / suit */}
        <path
          d="M14 92 Q14 70 30 64 L70 64 Q86 70 86 92 Z"
          fill="url(#aiSuit)"
        />
        {/* shirt collar */}
        <path d="M42 64 L50 76 L58 64 Z" fill="#F8FAFC" />
        {/* tie */}
        <path d="M48 70 L52 70 L54 84 L50 90 L46 84 Z" fill="#2C7BE5" />

        {/* antenna */}
        <line x1="50" y1="14" x2="50" y2="22" stroke="#3A4358" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="50" cy="13" r="3" fill="url(#aiAntenna)" />
        <circle cx="50" cy="13" r="5" fill="#7FD4FF" opacity="0.25" />

        {/* head */}
        <rect
          x="22"
          y="20"
          width="56"
          height="44"
          rx="20"
          ry="18"
          fill="url(#aiHead)"
          stroke="#C8CDD8"
          strokeWidth="0.8"
        />

        {/* visor */}
        <rect x="29" y="30" width="42" height="22" rx="11" fill="url(#aiVisor)" />

        {/* eyes */}
        <circle cx="41" cy="41" r="4.2" fill="url(#aiEye)" />
        <circle cx="59" cy="41" r="4.2" fill="url(#aiEye)" />
        <circle cx="40" cy="40" r="1.2" fill="#EAF7FF" />
        <circle cx="58" cy="40" r="1.2" fill="#EAF7FF" />

        {/* smile */}
        <path
          d="M44 56 Q50 60 56 56"
          stroke="#7FD4FF"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* headphones */}
        <rect x="18" y="36" width="7" height="14" rx="3" fill="#222B40" />
        <rect x="75" y="36" width="7" height="14" rx="3" fill="#222B40" />
        <path
          d="M22 36 Q22 18 50 18 Q78 18 78 36"
          stroke="#222B40"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* mic boom */}
        <path
          d="M25 50 Q30 58 38 58"
          stroke="#222B40"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="38" cy="58" r="1.6" fill="#222B40" />
      </svg>
    </span>
  );
}
