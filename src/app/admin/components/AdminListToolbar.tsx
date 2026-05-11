import { Search } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40];

interface AdminListToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  searchPlaceholder?: string;
  /** Optional extra controls rendered between search and page-size. */
  children?: React.ReactNode;
}

/**
 * Standard toolbar shown above every admin list table:
 *   [ search input ............... ] [ extra ] [ per-page dropdown ]
 *
 * The per-page dropdown is fixed at 10 / 20 / 30 / 40 across all pages.
 */
export function AdminListToolbar({
  search,
  onSearch,
  pageSize,
  onPageSizeChange,
  searchPlaceholder = "Search…",
  children,
}: AdminListToolbarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {children}

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        Per page
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export const DEFAULT_PAGE_SIZE = 10;
