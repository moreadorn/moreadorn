import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  name,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-slate-700 tracking-wide"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const baseInput =
  "w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";

export const inputClass = baseInput;

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${baseInput} resize-none ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
  },
) {
  return (
    <select
      {...props}
      className={`${baseInput} cursor-pointer ${props.className ?? ""}`}
    >
      {props.children}
    </select>
  );
}
