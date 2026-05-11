import { useEffect, useMemo, useState } from "react";
import { Trash2, RefreshCw, Mail, Phone, MessageCircle, Eye } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Buttons";
import {
  AdminListToolbar,
  DEFAULT_PAGE_SIZE,
} from "../../components/AdminListToolbar";
import { AdminPagination } from "../../components/AdminPagination";
import {
  CATEGORY_BADGE_STYLES,
  CATEGORY_LABELS,
  deleteRequestQuote,
  listRequestQuotes,
  updateRequestQuoteStatus,
  type QuoteCategory,
  type QuoteStatus,
  type RequestQuote,
} from "../../../api/requestQuotes";

const STATUS_STYLES: Record<QuoteStatus, string> = {
  new: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  quoted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
];

const CATEGORY_OPTIONS: { value: QuoteCategory; label: string }[] = [
  { value: "product", label: "Product" },
  { value: "contact", label: "ContactUs" },
  { value: "info", label: "RequestInfoQuote" },
];

export function ProductQuotesList() {
  const [rows, setRows] = useState<RequestQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<QuoteCategory | "">("");
  const [active, setActive] = useState<RequestQuote | null>(null);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        (r.country || "").toLowerCase().includes(q),
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
      const result = await listRequestQuotes(
        categoryFilter ? { category: categoryFilter } : {},
      );
      setRows(result.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const handleStatusChange = async (id: string, status: QuoteStatus) => {
    try {
      const updated = await updateRequestQuoteStatus(id, status);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
      if (active?.id === id) setActive(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete request from "${name}"? This cannot be undone.`)) return;
    try {
      await deleteRequestQuote(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      if (active?.id === id) setActive(null);
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const columns: Column<RequestQuote>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.name}</div>
          <div className="text-xs text-slate-500">{r.email}</div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          {r.product_image && (
            <div className="w-9 h-9 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
              <img
                src={r.product_image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-medium text-slate-800 line-clamp-1">
              {r.product_name || "—"}
            </div>
            {r.quantity && (
              <div className="text-xs text-slate-500">Qty: {r.quantity}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (r) => (
        <span className="text-xs text-slate-600">
          {[r.city, r.state, r.country].filter(Boolean).join(", ") || "—"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${CATEGORY_BADGE_STYLES[r.category_name]}`}
        >
          {CATEGORY_LABELS[r.category_name]}
        </span>
      ),
    },
    {
      key: "created",
      header: "Received",
      render: (r) => (
        <span className="text-xs text-slate-500">
          {new Date(r.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-32",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setActive(r)}
            aria-label="View details"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r.id, r.name)}
            aria-label="Delete"
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
        title="Request Quotes"
        description="Customer enquiries from product cards, the contact form, and the Get Quote modal."
        breadcrumbs={[{ label: "Admin" }, { label: "Request Quotes" }]}
        actions={
          <Button variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
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
        searchPlaceholder="Search by name, email, product…"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              categoryFilter === ""
                ? "bg-slate-900 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setCategoryFilter(c.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                categoryFilter === c.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </AdminListToolbar>

      {loading && rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading requests…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={pageRows}
          emptyTitle="No requests yet"
          emptyDescription="Customer enquiries from the public site will appear here."
        />
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of{" "}
            {filtered.length} request(s)
            {search && ` (filtered from ${rows.length})`}
          </span>
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Detail drawer */}
      {active && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setActive(null)}
          />
          <div className="relative ml-auto bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ${CATEGORY_BADGE_STYLES[active.category_name]}`}
                  >
                    {CATEGORY_LABELS[active.category_name]}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-indigo-600">
                    Request · #{String(active.id).slice(0, 8)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {active.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Subject (product / topic) */}
              {(active.product_name || active.quantity) && (
                <section>
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
                    {active.category_name === "product" ? "Product" : "Subject"}
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    {active.product_image && (
                      <img
                        src={active.product_image}
                        alt=""
                        className="w-14 h-14 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">
                        {active.product_name || "—"}
                      </div>
                      {active.quantity && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          Quantity: <strong>{active.quantity}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Contact */}
              <section>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
                  Contact
                </div>
                <div className="space-y-2">
                  <a
                    href={`mailto:${active.email}`}
                    className="flex items-center gap-2.5 text-sm text-slate-800 hover:text-indigo-600"
                  >
                    <Mail size={14} className="text-slate-400" />
                    {active.email}
                  </a>
                  {active.phone && (
                    <a
                      href={`tel:${active.phone}`}
                      className="flex items-center gap-2.5 text-sm text-slate-800 hover:text-indigo-600"
                    >
                      <Phone size={14} className="text-slate-400" />
                      {active.phone}
                    </a>
                  )}
                  {active.whatsapp && (
                    <a
                      href={`https://wa.me/${active.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-sm text-slate-800 hover:text-emerald-600"
                    >
                      <MessageCircle size={14} className="text-slate-400" />
                      {active.whatsapp}
                    </a>
                  )}
                </div>
              </section>

              {/* Address */}
              {[active.address, active.city, active.state, active.zip_code, active.country].some(Boolean) && (
                <section>
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
                    {active.category_name === "product"
                      ? "Delivery Address"
                      : "Location"}
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {[
                      active.address,
                      active.city,
                      active.state,
                      active.zip_code,
                      active.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </section>
              )}

              {/* Description */}
              <section>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
                  {active.category_name === "contact" ? "Message" : "Requirements"}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap p-3 rounded-lg bg-slate-50 border border-slate-200">
                  {active.description}
                </p>
              </section>

              {/* Status — workflow tracking, kept here so the table column
                  can show the highlighted Category instead. */}
              <section>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
                  Status
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleStatusChange(active.id, s.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ring-1 transition-colors ${
                        active.status === s.value
                          ? STATUS_STYLES[s.value]
                          : "bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Received {new Date(active.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
