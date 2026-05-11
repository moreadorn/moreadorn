import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, RefreshCw, Film } from "lucide-react";
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
  deleteProduct,
  listProducts,
  updateProductStatus,
  type Product,
} from "../../../api/products";

export function ProductsList() {
  const [rows, setRows] = useState<Product[]>([]);
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
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  // Reset to page 1 whenever the result set shrinks below current page.
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await listProducts({ all: true });
      setRows(page.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product.");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const updated = await updateProductStatus(id, active);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (r) => {
        const thumb = r.images?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                {r.name}
                {(r.videos?.length ?? 0) > 0 && (
                  <span
                    title="Has video"
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"
                  >
                    <Film size={10} /> VIDEO
                  </span>
                )}
                {(r.images?.length ?? 0) > 1 && (
                  <span
                    title={`${r.images.length} images`}
                    className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    +{r.images.length - 1}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {String(r.id).slice(0, 8)}…
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Category",
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
          {r.category}
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
            to={`/admin/products/${r.id}/edit`}
            aria-label={`Edit ${r.name}`}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(r.id, r.name)}
            aria-label={`Delete ${r.name}`}
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
        title="Products"
        description="Manage your full product catalogue. Add, edit, or deactivate items shown on the public site."
        breadcrumbs={[{ label: "Admin" }, { label: "Products" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={load} disabled={loading}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <LinkButton to="/admin/products/new">
              <Plus size={16} /> New Product
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
        searchPlaceholder="Search products…"
      />

      {loading && rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading products…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={pageRows}
          emptyTitle="No products yet"
          emptyDescription="Start by adding your first product. It will instantly appear on the public catalogue."
          emptyAction={
            <LinkButton to="/admin/products/new">
              <Plus size={16} /> Add your first product
            </LinkButton>
          }
        />
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of{" "}
            {filtered.length} product(s)
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
