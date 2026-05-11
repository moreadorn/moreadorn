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
  deleteBlog,
  listBlogs,
  updateBlogStatus,
  type Blog,
} from "../../../api/blogs";

export function BlogsList() {
  const [rows, setRows] = useState<Blog[]>([]);
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
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.toLowerCase().includes(q),
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
      const page = await listBlogs({ all: true });
      setRows(page.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleToggle = async (id: string, published: boolean) => {
    try {
      const updated = await updateBlogStatus(id, published);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteBlog(id);
      // Optimistic remove + re-fetch so we stay in sync with the server
      // (covers cascade deletes and other server-side side effects).
      setRows((rs) => rs.filter((r) => r.id !== id));
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const columns: Column<Blog>[] = [
    {
      key: "title",
      header: "Article",
      render: (r) => {
        const thumb = r.images?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
              {thumb && (
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 line-clamp-1">
                {r.title}
              </div>
              <div className="text-xs text-slate-500">by {r.author}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-2">
          <StatusToggle
            active={r.published}
            onChange={(next) => handleToggle(r.id, next)}
            size="sm"
          />
          <span
            className={`text-xs font-semibold ${r.published ? "text-emerald-600" : "text-slate-400"}`}
          >
            {r.published ? "Published" : "Draft"}
          </span>
        </div>
      ),
    },
    {
      key: "published",
      header: "Date",
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.publish_date || new Date(r.created_at).toLocaleDateString()}
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
            to={`/admin/blogs/${r.id}/edit`}
            aria-label={`Edit ${r.title}`}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(r.id, r.title)}
            aria-label={`Delete ${r.title}`}
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
        title="Blogs"
        description="Publish and manage articles shown on the public Blog page."
        breadcrumbs={[{ label: "Admin" }, { label: "Blogs" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={load} disabled={loading}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <LinkButton to="/admin/blogs/new">
              <Plus size={16} /> Write Blog
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
        searchPlaceholder="Search articles…"
      />

      {loading && rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading articles…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={pageRows}
          emptyTitle="No articles yet"
          emptyDescription="Write your first article to share with prospects and clients."
          emptyAction={
            <LinkButton to="/admin/blogs/new">
              <Plus size={16} /> Write your first article
            </LinkButton>
          }
        />
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of{" "}
            {filtered.length} article(s)
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
