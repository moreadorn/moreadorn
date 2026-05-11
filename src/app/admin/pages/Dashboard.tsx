import { Link } from "react-router";
import {
  Package,
  Globe2,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const stats = [
  {
    label: "Total Products",
    value: "0",
    delta: "+0",
    icon: Package,
    color: "indigo",
  },
  {
    label: "Active Markets",
    value: "0",
    delta: "+0",
    icon: Globe2,
    color: "emerald",
  },
  {
    label: "Published Blogs",
    value: "12",
    delta: "+2",
    icon: FileText,
    color: "amber",
  },
  {
    label: "Live Policies",
    value: "4",
    delta: "+0",
    icon: ShieldCheck,
    color: "violet",
  },
];

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
  violet: "bg-violet-500/10 text-violet-600",
};

const quickActions = [
  { to: "/admin/products/new", label: "Add Product", icon: Package },
  { to: "/admin/markets/new", label: "Add Market", icon: Globe2 },
  { to: "/admin/blogs/new", label: "Write Blog", icon: FileText },
  { to: "/admin/policies/new", label: "Add Policy", icon: ShieldCheck },
];

export function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening across your trade catalogue."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[s.color]}`}
              >
                <s.icon size={18} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <TrendingUp size={10} /> {s.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 leading-none">
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick actions</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jump into common tasks.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex items-center justify-between gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition-colors">
                    <q.icon size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {q.label}
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Site activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-900">Site activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last 7 days.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <Eye size={16} />
                </div>
                <span className="text-sm text-slate-700">Page views</span>
              </div>
              <span className="text-sm font-bold text-slate-900">2,438</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <Users size={16} />
                </div>
                <span className="text-sm text-slate-700">Unique visitors</span>
              </div>
              <span className="text-sm font-bold text-slate-900">912</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <FileText size={16} />
                </div>
                <span className="text-sm text-slate-700">Quote requests</span>
              </div>
              <span className="text-sm font-bold text-slate-900">38</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent updates</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest changes published from the admin console.
            </p>
          </div>
        </div>
        <div className="text-center py-10 text-sm text-slate-500">
          Activity log will appear here once you start publishing content.
        </div>
      </div>
    </div>
  );
}
