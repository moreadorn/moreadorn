import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  Globe2,
  FileText,
  ShieldCheck,
  MapPin,
  Share2,
  KeyRound,
  LogOut,
  Mail,
  X,
  Inbox,
} from "lucide-react";

const navGroups = [
  {
    title: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/markets", label: "Markets", icon: Globe2 },
      { to: "/admin/blogs", label: "Blogs", icon: FileText },
      { to: "/admin/policies", label: "Policies", icon: ShieldCheck },
    ],
  },
  {
    title: "Leads",
    items: [
      {
        to: "/admin/request-quotes",
        label: "Request Quotes",
        icon: Inbox,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { to: "/admin/address", label: "Address", icon: MapPin },
      { to: "/admin/social", label: "Social Media", icon: Share2 },
      { to: "/admin/ai-keys", label: "AI API Keys", icon: KeyRound },
      { to: "/admin/email-configs", label: "Email Config", icon: Mail },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      aria-hidden={!open}
      className={`fixed top-0 left-0 h-screen w-64 z-50 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand + close toggle */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0">
            M
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-wide text-white leading-none truncate">
              Moreadorn
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-slate-400 mt-1 truncate">
              Admin Console
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-3 space-y-6
          [scrollbar-width:thin]
          [scrollbar-color:#334155_transparent]
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-700/70
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-500"
      >
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.25em] uppercase text-slate-500">
              {group.title}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`
                    }
                  >
                    <item.icon size={17} strokeWidth={1.8} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800">
        <NavLink
          to="/admin/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </NavLink>
      </div>
    </aside>
  );
}
