import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  Eye,
  EyeOff,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { FormField, Input } from "../components/FormField";
import { Button } from "../components/Buttons";
import { StatusToggle } from "../components/StatusToggle";
import { DataTable, type Column } from "../components/DataTable";
import {
  createEmailConfig,
  deleteEmailConfig,
  listEmailConfigs,
  updateEmailConfig,
  type EmailConfig,
  type CreateEmailConfigPayload,
} from "../../api/emailConfig";

interface ConfigFormState {
  open: boolean;
  editing: EmailConfig | null;
  label: string;
  email: string;
  host: string;
  port: string;
  useTls: boolean;
  appPasswordInput: string;
  active: boolean;
  showPassword: boolean;
  submitting: boolean;
  error: string | null;
}

const EMPTY_FORM: ConfigFormState = {
  open: false,
  editing: null,
  label: "",
  email: "",
  host: "smtp.gmail.com",
  port: "587",
  useTls: true,
  appPasswordInput: "",
  active: false,
  showPassword: false,
  submitting: false,
  error: null,
};

export function EmailConfigs() {
  const [configs, setConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ConfigFormState>(EMPTY_FORM);

  const activeConfig = useMemo(
    () => configs.find((c) => c.active) || null,
    [configs],
  );

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listEmailConfigs();
      setConfigs(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, open: true });
  };

  const openEdit = (c: EmailConfig) => {
    setForm({
      ...EMPTY_FORM,
      open: true,
      editing: c,
      label: c.label,
      email: c.email,
      host: c.host,
      port: String(c.port),
      useTls: c.use_tls,
      active: c.active,
      appPasswordInput: "",
    });
  };

  const closeForm = () => setForm(EMPTY_FORM);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((f) => ({ ...f, submitting: true, error: null }));
    try {
      const portNumber = Number(form.port) || 587;
      if (form.editing) {
        const payload: Parameters<typeof updateEmailConfig>[1] = {
          label: form.label.trim(),
          email: form.email.trim(),
          host: form.host.trim() || "smtp.gmail.com",
          port: portNumber,
          use_tls: form.useTls,
          active: form.active,
        };
        if (form.appPasswordInput.trim()) {
          payload.app_password_input = form.appPasswordInput.trim();
        }
        await updateEmailConfig(form.editing.id, payload);
      } else {
        const payload: CreateEmailConfigPayload = {
          label: form.label.trim(),
          email: form.email.trim(),
          host: form.host.trim() || "smtp.gmail.com",
          port: portNumber,
          use_tls: form.useTls,
          active: form.active,
          app_password_input: form.appPasswordInput.trim(),
        };
        await createEmailConfig(payload);
      }
      closeForm();
      void loadAll();
    } catch (err) {
      setForm((f) => ({
        ...f,
        submitting: false,
        error: err instanceof Error ? err.message : "Failed to save.",
      }));
    }
  };

  const handleDelete = async (c: EmailConfig) => {
    if (
      !confirm(
        `Delete email config "${c.label}"? This cannot be undone${
          c.active
            ? " and outgoing emails will fall back to environment defaults"
            : ""
        }.`,
      )
    ) {
      return;
    }
    try {
      await deleteEmailConfig(c.id);
      setConfigs((rs) => rs.filter((r) => r.id !== c.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleToggle = async (c: EmailConfig, next: boolean) => {
    if (next && activeConfig && activeConfig.id !== c.id) {
      alert(
        `"${activeConfig.label}" is already active. Deactivate or delete it first — only one config may be active at a time.`,
      );
      return;
    }
    try {
      const updated = await updateEmailConfig(c.id, { active: next });
      setConfigs((rs) => rs.map((r) => (r.id === c.id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  const columns: Column<EmailConfig>[] = [
    {
      key: "label",
      header: "Label",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Mail size={15} />
          </div>
          <div className="font-semibold text-slate-900">{r.label}</div>
        </div>
      ),
    },
    {
      key: "email",
      header: "From address",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <AtSign size={13} className="text-slate-400" />
          <span>{r.email}</span>
        </div>
      ),
    },
    {
      key: "host",
      header: "SMTP",
      render: (r) => (
        <code className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
          {r.host}:{r.port}
          {r.use_tls ? " · TLS" : ""}
        </code>
      ),
    },
    {
      key: "password",
      header: "App Password",
      render: (r) => (
        <code className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
          {r.app_password || "—"}
        </code>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-2">
          <StatusToggle
            active={r.active}
            onChange={(next) => handleToggle(r, next)}
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
      key: "actions",
      header: "",
      className: "text-right w-24",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(r)}
            aria-label={`Edit ${r.label}`}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r)}
            aria-label={`Delete ${r.label}`}
            className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const blockedByActive = !!activeConfig;

  return (
    <div>
      <PageHeader
        title="Email Configuration"
        description="The active config is used to send all outgoing emails (quote and contact thank-yous). Only one config may be active at a time."
        breadcrumbs={[
          { label: "Admin" },
          { label: "Settings" },
          { label: "Email Config" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={loadAll} disabled={loading}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              onClick={() => {
                if (blockedByActive) {
                  alert(
                    `"${activeConfig?.label}" is currently active. Deactivate or delete it first — only one config may be active at a time.`,
                  );
                  return;
                }
                openAdd();
              }}
            >
              <Plus size={15} /> Add Email Config
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ============== Help / how-to ============== */}
      <div className="mb-6 p-5 rounded-xl bg-violet-50/60 border border-violet-200/70">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
            <Mail size={15} />
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Using Gmail?</strong> Generate
            an{" "}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-700 font-semibold underline"
            >
              App Password
            </a>{" "}
            (with 2-Step Verification enabled) and paste it below. SMTP is
            <code className="mx-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs">
              smtp.gmail.com:587
            </code>
            with TLS — already pre-filled.
          </div>
        </div>
      </div>

      {/* ============== Single-active warning bar ============== */}
      {blockedByActive && (
        <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">
              "{activeConfig?.label}"
            </strong>{" "}
            is the active config. To add another, deactivate or delete this
            one first — outgoing emails only use a single config at a time.
          </div>
        </div>
      )}

      {/* ============== Configs list ============== */}
      {loading && configs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading configs…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={configs}
          emptyTitle="No email configs yet"
          emptyDescription="Add a Gmail address + app password to start sending outgoing email."
          emptyAction={
            <Button onClick={openAdd}>
              <Plus size={15} /> Add Email Config
            </Button>
          }
        />
      )}

      {configs.length > 0 && (
        <div className="mt-4 text-xs text-slate-500">
          {configs.length} config(s) saved ·{" "}
          {configs.filter((c) => c.active).length} active
        </div>
      )}

      {/* ============== Add / Edit modal ============== */}
      {form.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={form.submitting ? undefined : closeForm}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {form.editing ? "Edit Email Config" : "Add Email Config"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored on the backend — the password is never sent back to
                  the browser in plain text.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={form.submitting}
                aria-label="Close"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submitForm} className="px-6 py-5 space-y-4">
              {form.error && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {form.error}
                </div>
              )}

              <FormField label="Label" required hint="e.g. 'Production Gmail'">
                <Input
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="Production Gmail"
                  required
                />
              </FormField>

              <FormField
                label="Email address"
                required
                hint="The address that emails will be sent FROM."
              >
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="hello@yourdomain.com"
                  required
                />
              </FormField>

              <FormField
                label={
                  form.editing
                    ? "App Password (leave blank to keep existing)"
                    : "App Password"
                }
                required={!form.editing}
                hint={
                  form.editing
                    ? `Currently set: ${form.editing.app_password}. Type a new one to overwrite.`
                    : "16-character Gmail app password (no spaces)."
                }
              >
                <div className="relative">
                  <input
                    type={form.showPassword ? "text" : "password"}
                    value={form.appPasswordInput}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        appPasswordInput: e.target.value,
                      }))
                    }
                    placeholder={
                      form.editing
                        ? "Paste new password to overwrite"
                        : "xxxx xxxx xxxx xxxx"
                    }
                    required={!form.editing}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, showPassword: !f.showPassword }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      form.showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {form.showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </FormField>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FormField label="SMTP host">
                    <Input
                      value={form.host}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, host: e.target.value }))
                      }
                      placeholder="smtp.gmail.com"
                    />
                  </FormField>
                </div>
                <FormField label="Port">
                  <Input
                    type="number"
                    value={form.port}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, port: e.target.value }))
                    }
                    placeholder="587"
                  />
                </FormField>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Use TLS
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Standard for Gmail and most providers on port 587.
                  </div>
                </div>
                <StatusToggle
                  active={form.useTls}
                  onChange={(next) => setForm((f) => ({ ...f, useTls: next }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Activate now
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {blockedByActive &&
                    form.editing?.id !== activeConfig?.id
                      ? `Blocked — "${activeConfig?.label}" is currently active.`
                      : "Use this config for outgoing emails immediately."}
                  </div>
                </div>
                <StatusToggle
                  active={form.active}
                  onChange={(next) => {
                    if (
                      next &&
                      blockedByActive &&
                      form.editing?.id !== activeConfig?.id
                    ) {
                      alert(
                        `"${activeConfig?.label}" is already active. Deactivate or delete it first.`,
                      );
                      return;
                    }
                    setForm((f) => ({ ...f, active: next }));
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={closeForm}
                  disabled={form.submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.submitting}>
                  {form.submitting
                    ? "Saving…"
                    : form.editing
                      ? "Update config"
                      : "Add config"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
