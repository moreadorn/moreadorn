import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build a compact list with ellipses for many pages: 1 ... 4 5 6 ... 10
  const pages: (number | "...")[] = [];
  const window = 1; // pages on each side of current

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
    "min-w-[40px] h-10 px-3 rounded-xl font-semibold text-sm flex items-center justify-center transition-all";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-2 flex-wrap ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseBtn} bg-white border border-gray-200 text-[#0B0B0B] hover:border-[#C8A96A] hover:text-[#C8A96A] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-[#0B0B0B]`}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`e-${idx}`}
            className="min-w-[40px] h-10 flex items-center justify-center text-[#6B7280]"
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
                ? "bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] shadow-md shadow-[#C8A96A]/30"
                : "bg-white border border-gray-200 text-[#0B0B0B] hover:border-[#C8A96A] hover:text-[#C8A96A]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseBtn} bg-white border border-gray-200 text-[#0B0B0B] hover:border-[#C8A96A] hover:text-[#C8A96A] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-[#0B0B0B]`}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
