import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-slate-700 font-medium"
                      : ""
                  }
                >
                  {b.label}
                </span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
