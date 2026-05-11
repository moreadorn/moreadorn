import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { FormField, Input, TextArea, Select } from "../../components/FormField";
import { Button } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";
import {
  createMarket,
  getMarket,
  updateMarket,
  type RegionCode,
} from "../../../api/markets";

export function MarketForm() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEdit = Boolean(editId);

  const [active, setActive] = useState(true);
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState("");
  const [region, setRegion] = useState<RegionCode | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Hydrate when editing.
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      try {
        const m = await getMarket(editId);
        if (cancelled) return;
        setActive(m.active);
        setCountry(m.country);
        setCode(m.code);
        setFlag(m.flag);
        setRegion(m.region);
        setNotes(m.notes);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load market.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region) {
      setError("Please select a region.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        country: country.trim(),
        code: code.trim().toUpperCase(),
        flag: flag.trim(),
        region: region as RegionCode,
        notes: notes.trim(),
        active,
      };
      if (isEdit && editId) {
        await updateMarket(editId, payload);
      } else {
        await createMarket(payload);
      }
      navigate("/admin/markets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save market.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Market" : "Add Market"}
        description={
          isEdit
            ? "Update an existing export destination."
            : "Add a new export destination. Active markets show up on the public Markets page."
        }
        breadcrumbs={[
          { label: "Admin" },
          { label: "Markets" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <Link
            to="/admin/markets"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} /> Back to list
          </Link>
        }
      />

      {loading && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm">
          Loading market…
        </div>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Country details
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Information shown on the country card.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Country name" required>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                  required
                />
              </FormField>
              <FormField
                label="Country code (ISO)"
                required
                hint="3-letter ISO code, e.g. USA, GBR."
              >
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. USA"
                  maxLength={3}
                  required
                />
              </FormField>
              <FormField
                label="Flag emoji"
                required
                hint="Paste the country's flag emoji."
              >
                <Input
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="🇺🇸"
                  required
                />
              </FormField>
              <FormField label="Region" required>
                <Select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionCode)}
                  required
                >
                  <option value="">Select region</option>
                  <option value="north_america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="middle_east">Middle East</option>
                  <option value="east_asia">East Asia</option>
                  <option value="southeast_asia">Southeast Asia</option>
                  <option value="south_asia">South Asia</option>
                  <option value="africa">Africa</option>
                  <option value="oceania">Oceania</option>
                  <option value="south_america">South America</option>
                  <option value="central_america">Central America</option>
                </Select>
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                label="Notes"
                hint="Internal notes about this market (not shown publicly)."
              >
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Trade-volume notes, customs quirks, key partners…"
                />
              </FormField>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Publishing
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Active
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Show this market on the public site.
                </div>
              </div>
              <StatusToggle active={active} onChange={setActive} />
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting || loading}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Update market"
                  : "Save market"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/markets")}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
