import type { ReactNode } from "react";
import { Link } from "react-router";

const baseBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
  secondary:
    "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
  ghost: "text-slate-600 hover:bg-slate-100",
};

interface ButtonProps {
  variant?: keyof typeof variants;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  type = "button",
  onClick,
  children,
  className = "",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseBtn} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  to,
  variant = "primary",
  children,
  className = "",
}: LinkButtonProps) {
  return (
    <Link to={to} className={`${baseBtn} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
