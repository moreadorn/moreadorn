import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { LinkButton, Button } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";
import {
  AdminListToolbar,
  DEFAULT_PAGE_SIZE,
} from "../../components/AdminListToolbar";
import { AdminPagination } from "../../components/AdminPagination";
import {
  deleteMarket,
  listMarkets,
  REGION_LABELS,
  updateMarket,
  type Market,
} from "../../../api/markets";

export function MarketsList() {
  const [rows, setRows] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.country.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        REGION_LABELS[r.region].toLowerCase().includes(q),
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

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await listMarkets({ all: true });
      setRows(page.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load markets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const updated = await updateMarket(id, { active });
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  const handleDelete = async (id: string, country: string) => {
    if (!confirm(`Delete "${country}"? This cannot be undone.`)) return;
    try {
      await deleteMarket(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const columns: Column<Market>[] = [
    {
      key: "country",
      header: "Country",
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{r.flag}</span>
          <div>
            <div className="font-semibold text-slate-900">{r.country}</div>
            <div className="text-xs text-slate-500">{r.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "region",
      header: "Region",
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
          {REGION_LABELS[r.region]}
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
            onChange={(next) => handleToggle(r.id, next)}
            size="sm"
          />
          <span
            className={`text-xs font-semibold ${r.active ? "text-emerald-600" : "text-slate-400"}`}
          >
            {r.active ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (r) => (
        <span className="text-xs text-slate-500">
          {new Date(r.updated_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-32",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/markets/${r.id}/edit`}
            aria-label={`Edit ${r.country}`}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(r.id, r.country)}
            aria-label={`Delete ${r.country}`}
            className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Markets"
        description="Active export destinations shown on the public Markets page."
        breadcrumbs={[{ label: "Admin" }, { label: "Markets" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={load} disabled={loading}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <LinkButton to="/admin/markets/new">
              <Plus size={16} /> New Market
            </LinkButton>
          </div>
        }
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

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
        searchPlaceholder="Search markets…"
      />

      {loading && rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading markets…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={pageRows}
          emptyTitle="No markets yet"
          emptyDescription="Add the first export destination. Active markets are listed on the public Markets page."
          emptyAction={
            <LinkButton to="/admin/markets/new">
              <Plus size={16} /> Add your first market
            </LinkButton>
          }
        />
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of{" "}
            {filtered.length} market(s)
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
