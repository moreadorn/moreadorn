import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  PanelLeftClose,
  Inbox,
  ExternalLink,
  UserCog,
  KeyRound,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  CATEGORY_BADGE_STYLES,
  CATEGORY_LABELS,
  listRequestQuotes,
  type RequestQuote,
} from "../../api/requestQuotes";
import {
  adminLogout,
  adminResetPassword,
  adminResetUsername,
} from "../../api/adminAuth";
import { clearAuth, getProfile, getToken } from "../auth";

interface TopbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const POLL_INTERVAL_MS = 60_000; // 1 minute
const DISPLAY_NAME = "moreAdorn";

type ResetMode = "username" | "password" | null;

export function Topbar({ onToggleSidebar, sidebarOpen }: TopbarProps) {
  const [recent, setRecent] = useState<RequestQuote[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [resetMode, setResetMode] = useState<ResetMode>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const profile = getProfile();
  const username = profile?.username || "";

  // Pull "new" status quotes for the notification bell. Polled every minute
  // so admins see fresh leads without a manual refresh.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const page = await listRequestQuotes({ status: "new" });
        if (!cancelled) setRecent(page.results);
      } catch {
        /* network failure — bell stays empty */
      }
    };
    void load();
    const id = window.setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // Close the notification dropdown when clicking outside.
  useEffect(() => {
    if (!openMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openMenu]);

  // Same for the profile dropdown.
  useEffect(() => {
    if (!openProfile) return;
    const onDoc = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openProfile]);

  const handleLogout = async () => {
    setOpenProfile(false);
    const token = getToken();
    if (token) await adminLogout(token);
    clearAuth();
    navigate("/admin/login", { replace: true });
  };

  const newCount = recent.length;

  const goToAll = () => {
    setOpenMenu(false);
    navigate("/admin/request-quotes");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30">
      {/* Left cluster — sidebar toggle + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <Menu size={16} />}
        </button>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search…"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <ThemeToggle variant="admin" />

        <div ref={wrapRef} className="relative">
          <button
            type="button"
            aria-label={`Notifications${newCount ? ` (${newCount} new)` : ""}`}
            onClick={() => setOpenMenu((v) => !v)}
            className="relative w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Bell size={16} />
            {newCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                  {newCount > 9 ? "9+" : newCount}
                </span>
              </>
            )}
          </button>

          {openMenu && (
            <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] max-h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-40 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    New requests
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {newCount === 0
                      ? "You're all caught up."
                      : `${newCount} unread`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={goToAll}
                  className="text-[10px] tracking-[0.15em] uppercase text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {recent.length === 0 ? (
                  <div className="px-4 py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                    <Inbox size={20} className="mx-auto mb-2 opacity-50" />
                    No new requests right now.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recent.slice(0, 8).map((q) => (
                      <li key={q.id}>
                        <Link
                          to="/admin/request-quotes"
                          onClick={() => setOpenMenu(false)}
                          className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {q.name}
                            </span>
                            <span
                              className={`flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ring-1 ${CATEGORY_BADGE_STYLES[q.category_name]}`}
                            >
                              {CATEGORY_LABELS[q.category_name]}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {q.email}
                            {q.product_name && ` · ${q.product_name}`}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {new Date(q.created_at).toLocaleString()}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {recent.length > 0 && (
                <button
                  type="button"
                  onClick={goToAll}
                  className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Open Request Quotes
                  <ExternalLink size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* ============== PROFILE DROPDOWN ============== */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setOpenProfile((v) => !v)}
            aria-label="Account menu"
            className="flex items-center gap-2.5 pr-2 pl-1 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                {DISPLAY_NAME}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Administrator
              </div>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 hidden md:block transition-transform ${openProfile ? "rotate-180" : ""}`}
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-40">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {DISPLAY_NAME}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Logged in as{" "}
                  <code className="font-mono text-slate-700 dark:text-slate-300">
                    {username || "—"}
                  </code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(false);
                  setResetMode("username");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <UserCog size={15} className="text-slate-500" />
                Reset username
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(false);
                  setResetMode("password");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <KeyRound size={15} className="text-slate-500" />
                Reset password
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============== RESET MODAL ============== */}
      <ResetModal mode={resetMode} onClose={() => setResetMode(null)} />
    </header>
  );
}

// ====================================================================
// Reset username / password modal — collects current password +
// new value, hits the backend, then forces a logout.
// ====================================================================
interface ResetModalProps {
  mode: ResetMode;
  onClose: () => void;
}

function ResetModal({ mode, onClose }: ResetModalProps) {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newValue, setNewValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever the modal opens / changes mode
  useEffect(() => {
    if (mode) {
      setCurrentPassword("");
      setNewValue("");
      setError(null);
    }
  }, [mode]);

  if (!mode) return null;

  const isUsername = mode === "username";
  const title = isUsername ? "Reset username" : "Reset password";
  const newLabel = isUsername ? "New username" : "New password";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newValue) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isUsername) {
        await adminResetUsername(currentPassword, newValue.trim());
      } else {
        await adminResetPassword(currentPassword, newValue);
      }
      // Force the session to terminate — the backend has already wiped
      // the token, so any further authenticated request would 401.
      clearAuth();
      alert(
        isUsername
          ? "Username updated. You'll need to sign in again with the new username."
          : "Password updated. You'll need to sign in again with the new password.",
      );
      navigate("/admin/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save the change. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={submitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You'll be signed out automatically once the change saves.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
              Current password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
              {newLabel}
            </label>
            <input
              type={isUsername ? "text" : "password"}
              autoComplete={isUsername ? "username" : "new-password"}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder={isUsername ? "new-username" : "••••••••"}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
            >
              {submitting ? "Saving…" : isUsername ? "Update username" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
