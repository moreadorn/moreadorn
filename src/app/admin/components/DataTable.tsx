import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Add your first record to see it listed here.",
  emptyAction,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center">
        <div className="inline-flex w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-4">
          <span className="text-2xl">📭</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          {emptyTitle}
        </h3>
        <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
          {emptyDescription}
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500 px-5 py-3 ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3.5 text-slate-700 ${col.className ?? ""}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
