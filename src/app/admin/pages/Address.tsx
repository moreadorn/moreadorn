import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Globe, RefreshCw } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { FormField, Input, TextArea } from "../components/FormField";
import { Button } from "../components/Buttons";
import {
  DEFAULT_BUSINESS_HOURS,
  fetchCompanyContact,
  updateCompanyContact,
  type BusinessHour,
  type CompanyContactInput,
  type WeekDay,
} from "../../api/companyContact";

/**
 * Accept any Google Maps URL the user pastes — with, without, or
 * partially with a protocol — and return a clean ``https://…`` link.
 * Empty input passes through unchanged.
 */
function normaliseMapsUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  // strip any leading "//" or accidental "http:/" / "https:/" without slashes
  const cleaned = v.replace(/^\/+/, "").replace(/^https?:\/?(?!\/)/i, "");
  return `https://${cleaned}`;
}

const DAY_LABEL: Record<WeekDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const EMPTY: CompanyContactInput = {
  query_email: "",
  contact_email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  google_maps_url: "",
  business_hours: DEFAULT_BUSINESS_HOURS,
};

export function Address() {
  const [form, setForm] = useState<CompanyContactInput>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await fetchCompanyContact(true);
      setForm({
        query_email: c.query_email,
        contact_email: c.contact_email,
        phone: c.phone,
        address: c.address,
        city: c.city,
        state: c.state,
        country: c.country,
        zip_code: c.zip_code,
        google_maps_url: c.google_maps_url,
        business_hours: c.business_hours,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setField = <K extends keyof CompanyContactInput>(
    key: K,
    value: CompanyContactInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const setHourField = (
    day: WeekDay,
    patch: Partial<BusinessHour>,
  ) =>
    setForm((f) => ({
      ...f,
      business_hours: f.business_hours.map((h) =>
        h.day === day ? { ...h, ...patch } : h,
      ),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Normalise the maps URL — accept "google.com/maps/..." pasted without
      // a protocol so HTML5 url-validation, mailto-style links, and the
      // public-site iframe all work without further fiddling.
      const normalised = {
        ...form,
        google_maps_url: normaliseMapsUrl(form.google_maps_url),
      };
      await updateCompanyContact(normalised);
      setForm(normalised);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Address &amp; Contact"
        description="Manage the company contact details shown across the public Contact page, footer, and navigation bar."
        breadcrumbs={[{ label: "Admin" }, { label: "Settings" }, { label: "Address" }]}
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

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ============== BASIC INFORMATION ============== */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Mail size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Basic Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Public contact channels and office address.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Support & Query email" required>
                <Input
                  type="email"
                  required
                  placeholder="query@moreadorn.com"
                  value={form.query_email}
                  onChange={(e) => setField("query_email", e.target.value)}
                />
              </FormField>
              <FormField label="Contact email" required>
                <Input
                  type="email"
                  required
                  placeholder="hello@moreadorn.com"
                  value={form.contact_email}
                  onChange={(e) => setField("contact_email", e.target.value)}
                />
              </FormField>
              <FormField label="Phone number" required>
                <Input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </FormField>
              <FormField label="ZIP / Postal code" required>
                <Input
                  required
                  placeholder="380015"
                  value={form.zip_code}
                  onChange={(e) => setField("zip_code", e.target.value)}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label="Address" required hint="Full street address line.">
                <TextArea
                  required
                  rows={3}
                  placeholder="123 Trade Avenue, Sarkhej–Gandhinagar Highway"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <FormField label="City" required>
                <Input
                  required
                  placeholder="Ahmedabad"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                />
              </FormField>
              <FormField label="State" required>
                <Input
                  required
                  placeholder="Gujarat"
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                />
              </FormField>
              <FormField label="Country" required>
                <Input
                  required
                  placeholder="India"
                  value={form.country}
                  onChange={(e) => setField("country", e.target.value)}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                label="Google Maps URL"
                hint="Optional — paste any Google Maps share link (with or without https://). The map embed loads automatically on the Contact page."
              >
                <Input
                  type="text"
                  placeholder="google.com/maps/place/... (any format works)"
                  value={form.google_maps_url}
                  onChange={(e) => setField("google_maps_url", e.target.value)}
                />
              </FormField>
            </div>
          </section>

          {/* ============== BUSINESS HOURS ============== */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Clock size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Business Hours
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toggle each day open or closed and pick opening / closing times.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {form.business_hours.map((h) => (
                <BusinessHourRow
                  key={h.day}
                  hour={h}
                  onChange={(patch) => setHourField(h.day, patch)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ============== SAVE PANEL ============== */}
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Save changes
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Updates apply immediately to the public site.
            </p>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={saving || loading}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={load}
                disabled={loading}
              >
                Discard
              </Button>
            </div>

            {saved && (
              <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                ✓ Saved successfully
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <InfoLine
                icon={<Mail size={13} />}
                text="Updates the footer, top contact bar, and Contact page automatically."
              />
              <InfoLine
                icon={<Phone size={13} />}
                text="The phone number is also used for click-to-call links."
              />
              <InfoLine
                icon={<MapPin size={13} />}
                text="The Google Maps URL turns the office card into a link."
              />
              <InfoLine
                icon={<Globe size={13} />}
                text="All fields are public — don't store private data here."
              />
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

function InfoLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}

interface RowProps {
  hour: BusinessHour;
  onChange: (patch: Partial<BusinessHour>) => void;
}

function BusinessHourRow({ hour, onChange }: RowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-white">
      {/* Day label */}
      <div className="sm:w-32 text-sm font-semibold text-slate-800">
        {DAY_LABEL[hour.day]}
      </div>

      {/* Open / Closed toggle */}
      <button
        type="button"
        onClick={() =>
          onChange({
            is_open: !hour.is_open,
            open_time: !hour.is_open ? hour.open_time || "09:00" : "",
            close_time: !hour.is_open ? hour.close_time || "18:00" : "",
          })
        }
        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ring-1 transition-colors ${
          hour.is_open
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-slate-100 text-slate-500 ring-slate-200"
        }`}
      >
        {hour.is_open ? "Open" : "Closed"}
      </button>

      {/* Time inputs — only when open */}
      {hour.is_open ? (
        <div className="flex items-center gap-2 sm:ml-auto">
          <input
            type="time"
            value={hour.open_time}
            onChange={(e) => onChange({ open_time: e.target.value })}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="time"
            value={hour.close_time}
            onChange={(e) => onChange({ close_time: e.target.value })}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      ) : (
        <div className="text-xs text-slate-400 sm:ml-auto italic">
          No hours
        </div>
      )}
    </div>
  );
}
