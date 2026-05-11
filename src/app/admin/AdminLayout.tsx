import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { useTheme } from "../components/ThemeProvider";
import { isLoggedIn } from "./auth";

const MOBILE_QUERY = "(max-width: 1023px)";

export function AdminLayout() {
  const location = useLocation();
  const { theme } = useTheme();

  // Route guard — recomputed every render so a logout in another tab is
  // reflected immediately. Hooks are still called in the same order
  // because the early return below happens AFTER every hook.
  const authed = isLoggedIn();

  // default open on desktop, closed on mobile
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(MOBILE_QUERY).matches;
  });

  // Auto-close drawer when navigating on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    if (isMobile) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while drawer is open on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    document.body.style.overflow = open && isMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Re-evaluate default when crossing the breakpoint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => {
      if (!e.matches) setOpen(true); // entering desktop → show
      else setOpen(false); // entering mobile → hide
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Redirect AFTER all hooks have been called so React's rules of hooks
  // are satisfied even when the user is logged out.
  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 admin-shell ${theme === "dark" ? "dark" : ""}`}
    >
      <Sidebar open={open} onClose={close} />

      {/* Mobile backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Main column — shifts right when sidebar open on desktop */}
      <div
        className={`flex flex-col min-h-screen transition-[margin] duration-300 ease-out ${
          open ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Topbar onToggleSidebar={toggle} sidebarOpen={open} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
