interface StatusToggleProps {
  active: boolean;
  onChange: (next: boolean) => void;
  size?: "sm" | "md";
}

export function StatusToggle({ active, onChange, size = "md" }: StatusToggleProps) {
  const dim = size === "sm" ? "w-9 h-5" : "w-11 h-6";
  const knob =
    size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={`relative inline-flex items-center ${dim} rounded-full transition-colors ${
        active ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block ${knob} bg-white rounded-full shadow transform transition-transform ${
          active ? translate : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
