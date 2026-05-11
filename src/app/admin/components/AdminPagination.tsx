import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Slate / indigo themed pagination for the admin tables. Mirrors the public
 * Pagination component but with the admin colour palette.
 */
export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  // Compact list with ellipses: 1 … 4 5 6 … 10
  const pages: (number | "...")[] = [];
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - window && i <= currentPage + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const baseBtn =
    "min-w-[36px] h-9 px-2.5 rounded-lg font-semibold text-xs flex items-center justify-center transition-all";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 flex-wrap ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseBtn} bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-700`}
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`e-${idx}`}
            className="min-w-[36px] h-9 flex items-center justify-center text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${baseBtn} ${
              p === currentPage
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseBtn} bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-700`}
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
