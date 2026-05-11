import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { LinkButton } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";
import {
  AdminListToolbar,
  DEFAULT_PAGE_SIZE,
} from "../../components/AdminListToolbar";
import { AdminPagination } from "../../components/AdminPagination";

interface Policy {
  id: string;
  title: string;
  type: string;
  active: boolean;
  updatedAt: string;
}

const sampleRows: Policy[] = [];

export function PoliciesList() {
  const [rows, setRows] = useState<Policy[]>(sampleRows);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const toggleActive = (id: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  const columns: Column<Policy>[] = [
    {
      key: "title",
      header: "Policy",
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.title}</div>
          <div className="text-xs text-slate-500">ID: {r.id}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-violet-50 text-violet-700 font-medium">
          {r.type}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-2">
          <StatusToggle
            active={r.active}
            onChange={() => toggleActive(r.id)}
            size="sm"
          />
          <span
            className={`text-xs font-semibold ${r.active ? "text-emerald-600" : "text-slate-400"}`}
          >
            {r.active ? "Live" : "Hidden"}
          </span>
        </div>
      ),
    },
    {
      key: "updated",
      header: "Last Update",
      render: (r) => <span className="text-xs text-slate-500">{r.updatedAt}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-32",
      render: () => (
        <div className="flex items-center justify-end gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">
            <Pencil size={14} />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Policies"
        description="Compliance, privacy, and legal policies displayed on the public Policies page."
        breadcrumbs={[{ label: "Admin" }, { label: "Policies" }]}
        actions={
          <LinkButton to="/admin/policies/new">
            <Plus size={16} /> New Policy
          </LinkButton>
        }
      />

      <AdminListToolbar
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        searchPlaceholder="Search policies…"
      />

      <DataTable
        columns={columns}
        rows={pageRows}
        emptyTitle="No policies yet"
        emptyDescription="Add your first policy. Active policies appear on the public site."
        emptyAction={
          <LinkButton to="/admin/policies/new">
            <Plus size={16} /> Add your first policy
          </LinkButton>
        }
      />

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of{" "}
            {filtered.length} policy(ies)
            {search && ` (filtered from ${rows.length})`}
          </span>
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
