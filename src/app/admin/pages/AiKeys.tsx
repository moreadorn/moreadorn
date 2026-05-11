import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { FormField, Input, Select, TextArea } from "../components/FormField";
import { Button } from "../components/Buttons";
import { StatusToggle } from "../components/StatusToggle";
import { DataTable, type Column } from "../components/DataTable";
import {
  fetchAiSettings,
  updateAiSettings,
  type AiSettings,
} from "../../api/aiSettings";
import {
  createAiApiKey,
  deleteAiApiKey,
  listAiApiKeys,
  updateAiApiKey,
  type AiApiKey,
  type CreateAiApiKeyPayload,
} from "../../api/aiApiKeys";

// Provider is always Groq — the field has been dropped from both UI and DB.
const MODEL_OPTIONS: { value: string; label: string }[] = [
  {
    value: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B Versatile (recommended)",
  },
  {
    value: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B Instant (fastest)",
  },
  {
    value: "llama-3.2-90b-vision-preview",
    label: "Llama 3.2 90B (preview)",
  },
  {
    value: "gemma2-9b-it",
    label: "Gemma 2 9B IT",
  },
];

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

interface KeyFormState {
  open: boolean;
  editing: AiApiKey | null;
  label: string;
  modelName: string;
  apiKeyInput: string;
  active: boolean;
  showKey: boolean;
  submitting: boolean;
  error: string | null;
}

const EMPTY_FORM: KeyFormState = {
  open: false,
  editing: null,
  label: "",
  modelName: DEFAULT_MODEL,
  apiKeyInput: "",
  active: false,
  showKey: false,
  submitting: false,
  error: null,
};

export function AiKeys() {
  // ---------- assistant settings (kept compact at the top) ----------
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [assistantName, setAssistantName] = useState("Aria");
  const [welcome, setWelcome] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ---------- keys list ----------
  const [keys, setKeys] = useState<AiApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<KeyFormState>(EMPTY_FORM);

  const activeKey = useMemo(() => keys.find((k) => k.active) || null, [keys]);

  // ---------- loaders ----------
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, list] = await Promise.all([fetchAiSettings(), listAiApiKeys()]);
      setSettings(s);
      setAssistantName(s.assistant_name);
      setWelcome(s.welcome_message);
      setEnabled(s.enabled);
      setKeys(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  // ---------- assistant settings save ----------
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateAiSettings({
        assistant_name: assistantName.trim() || "Aria",
        welcome_message: welcome,
        enabled,
      });
      setSettings(updated);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // ---------- key CRUD ----------
  const openAdd = () => {
    setForm({ ...EMPTY_FORM, open: true });
  };

  const openEdit = (k: AiApiKey) => {
    setForm({
      ...EMPTY_FORM,
      open: true,
      editing: k,
      label: k.label,
      modelName: k.model_name,
      active: k.active,
      apiKeyInput: "", // empty = keep existing
    });
  };

  const closeForm = () => setForm(EMPTY_FORM);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((f) => ({ ...f, submitting: true, error: null }));
    try {
      if (form.editing) {
        const payload: Parameters<typeof updateAiApiKey>[1] = {
          label: form.label.trim(),
          model_name: form.modelName,
          active: form.active,
        };
        if (form.apiKeyInput.trim()) {
          payload.api_key_input = form.apiKeyInput.trim();
        }
        await updateAiApiKey(form.editing.id, payload);
      } else {
        const payload: CreateAiApiKeyPayload = {
          label: form.label.trim(),
          model_name: form.modelName,
          active: form.active,
          api_key_input: form.apiKeyInput.trim(),
        };
        await createAiApiKey(payload);
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

  const handleDelete = async (k: AiApiKey) => {
    if (
      !confirm(
        `Delete API key "${k.label}"? This cannot be undone${k.active ? " and will take the AI assistant offline" : ""}.`,
      )
    ) {
      return;
    }
    try {
      await deleteAiApiKey(k.id);
      setKeys((rs) => rs.filter((r) => r.id !== k.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleToggle = async (k: AiApiKey, next: boolean) => {
    if (next && activeKey && activeKey.id !== k.id) {
      alert(
        `"${activeKey.label}" is already active. Deactivate or delete it first — only one key may be active at a time.`,
      );
      return;
    }
    try {
      const updated = await updateAiApiKey(k.id, { active: next });
      setKeys((rs) => rs.map((r) => (r.id === k.id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  // ---------- columns ----------
  const columns: Column<AiApiKey>[] = [
    {
      key: "label",
      header: "Label",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <KeyRound size={15} />
          </div>
          <div className="font-semibold text-slate-900">{r.label}</div>
        </div>
      ),
    },
    {
      key: "model",
      header: "Model",
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-violet-50 text-violet-700 font-medium">
          {r.model_name}
        </span>
      ),
    },
    {
      key: "key",
      header: "API Key",
      render: (r) => (
        <code className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
          {r.api_key || "—"}
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

  // Whether the "Add new key" CTA should warn that another key is active.
  const blockedByActive = !!activeKey;

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Manage the assistant identity and the API keys it uses. Only one key may be active at a time."
        breadcrumbs={[
          { label: "Admin" },
          { label: "Settings" },
          { label: "AI Assistant" },
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
                    `"${activeKey?.label}" is currently active. Deactivate or delete it first — only one key may be active at a time.`,
                  );
                  return;
                }
                openAdd();
              }}
            >
              <Plus size={15} /> Add API Key
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ============== Assistant identity (compact) ============== */}
      <form
        onSubmit={saveSettings}
        className="bg-white border border-slate-200 rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <Sparkles size={17} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Assistant identity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Display name, welcome message, and master on/off switch.
            </p>
          </div>
          {settingsSaved && (
            <div className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
              ✓ Saved
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Assistant name" required>
            <Input
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="Aria"
              required
            />
          </FormField>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Enabled
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                When off, chat shows an offline message.
              </div>
            </div>
            <StatusToggle active={enabled} onChange={setEnabled} />
          </div>
        </div>

        <div className="mt-4">
          <FormField
            label="Welcome message"
            hint="First message shown when a visitor opens the chat."
          >
            <TextArea
              value={welcome}
              onChange={(e) => setWelcome(e.target.value)}
              rows={2}
              placeholder="Hi 👋  I'm Aria — Moreadorn's trade assistant…"
            />
          </FormField>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={savingSettings}>
            {savingSettings ? "Saving…" : "Save assistant settings"}
          </Button>
        </div>
      </form>

      {/* ============== Single-active warning bar ============== */}
      {blockedByActive && (
        <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">
              "{activeKey?.label}"
            </strong>{" "}
            is the active key. To add another, deactivate or delete this one
            first — the assistant only uses a single key at a time.
          </div>
        </div>
      )}

      {/* ============== Keys list ============== */}
      {loading && keys.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl px-8 py-16 text-center text-sm text-slate-500">
          Loading keys…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={keys}
          emptyTitle="No API keys yet"
          emptyDescription="Add your first Groq key to bring the assistant online."
          emptyAction={
            <Button onClick={openAdd}>
              <Plus size={15} /> Add API Key
            </Button>
          }
        />
      )}

      {keys.length > 0 && (
        <div className="mt-4 text-xs text-slate-500">
          {keys.length} key(s) saved · {keys.filter((k) => k.active).length}{" "}
          active
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
                  {form.editing ? "Edit API Key" : "Add API Key"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored on the backend, never exposed to the browser.
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

              <FormField label="Label" required hint="e.g. 'Production', 'Test'">
                <Input
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="Production"
                  required
                />
              </FormField>

              <FormField
                label="Model"
                required
                hint={
                  form.modelName &&
                  !MODEL_OPTIONS.some((m) => m.value === form.modelName)
                    ? "⚠ Saved model is no longer in the recommended list. Pick a current one."
                    : undefined
                }
              >
                <Select
                  value={form.modelName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, modelName: e.target.value }))
                  }
                  required
                >
                  {form.modelName &&
                    !MODEL_OPTIONS.some((m) => m.value === form.modelName) && (
                      <option value={form.modelName}>
                        {form.modelName} (legacy)
                      </option>
                    )}
                  {MODEL_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label={
                  form.editing
                    ? "API Key (leave blank to keep existing)"
                    : "API Key"
                }
                required={!form.editing}
                hint={
                  form.editing
                    ? `Currently set: ${form.editing.api_key}. Type a new key to overwrite.`
                    : "Paste your Groq key. Free key at console.groq.com/keys."
                }
              >
                <div className="relative">
                  <input
                    type={form.showKey ? "text" : "password"}
                    value={form.apiKeyInput}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, apiKeyInput: e.target.value }))
                    }
                    placeholder={
                      form.editing ? "Paste new key to overwrite" : "gsk_..."
                    }
                    required={!form.editing}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, showKey: !f.showKey }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={form.showKey ? "Hide key" : "Show key"}
                  >
                    {form.showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Activate now
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {blockedByActive &&
                    form.editing?.id !== activeKey?.id
                      ? `Blocked — "${activeKey?.label}" is currently active.`
                      : "Use this key for the chat assistant immediately."}
                  </div>
                </div>
                <StatusToggle
                  active={form.active}
                  onChange={(next) => {
                    if (
                      next &&
                      blockedByActive &&
                      form.editing?.id !== activeKey?.id
                    ) {
                      alert(
                        `"${activeKey?.label}" is already active. Deactivate or delete it first.`,
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
                      ? "Update key"
                      : "Add key"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
