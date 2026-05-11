import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  variant?: "public" | "admin";
}

export function ThemeToggle({ variant = "public" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  // public navigation variant — pill button matching nav style
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 hover:border-[#C8A96A]/60 hover:bg-[#C8A96A]/10 flex items-center justify-center text-[#0B0B0B] dark:text-[#E6D3A3] transition-all"
    >
      <Sun
        size={15}
        className={`absolute transition-all ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        size={15}
        className={`absolute transition-all ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
