import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, User as UserIcon, Lock, ShieldCheck } from "lucide-react";
import { adminLogin } from "../../api/adminAuth";
import { isLoggedIn, setProfile, setToken } from "../auth";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user is already logged in, jump straight to the dashboard.
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminLogin(username.trim(), password);
      setToken(res.token);
      setProfile({ username: res.username, is_superuser: res.is_superuser });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't sign in. Please check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 admin-shell flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* LEFT — branding panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-lg">
                M
              </div>
              <div>
                <div className="font-bold tracking-wide">Moreadorn</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-slate-400 mt-0.5">
                  Admin Console
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
              Manage your<br />trade catalogue<br />with confidence.
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Sign in to publish products, markets, blogs, and compliance
              policies — all from one place.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Secure session
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Tokens rotate when you reset your username or password.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-none">
                  Moreadorn
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mt-1">
                  Admin Console
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Sign in with your admin username and password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Username
                </label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="moreadorn@77"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              Protected admin area. Unauthorized access prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
