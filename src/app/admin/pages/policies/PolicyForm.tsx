import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { FormField, Input, TextArea, Select } from "../../components/FormField";
import { Button } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";

export function PolicyForm() {
  const navigate = useNavigate();
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/policies");
  };

  return (
    <div>
      <PageHeader
        title="Add Policy"
        description="Add a new policy. Live policies are visible on the public Policies page."
        breadcrumbs={[
          { label: "Admin" },
          { label: "Policies" },
          { label: "New" },
        ]}
        actions={
          <Link
            to="/admin/policies"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} /> Back to list
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Policy details</h3>
            <p className="text-xs text-slate-500 mb-5">
              The policy title, summary, and full text.
            </p>
            <div className="space-y-4">
              <FormField label="Policy title" required>
                <Input placeholder="e.g. Export Compliance Policy" required />
              </FormField>
              <FormField label="Short summary" required hint="Shown on the policy card.">
                <TextArea
                  rows={2}
                  placeholder="A summary of how we handle export compliance for international shipments…"
                  required
                />
              </FormField>
              <FormField label="Full content" required hint="Markdown supported.">
                <TextArea
                  rows={16}
                  placeholder="## Section 1&#10;Detailed policy text…"
                  required
                />
              </FormField>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Publishing</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-900">Live</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Visible on the public Policies page.
                </div>
              </div>
              <StatusToggle active={active} onChange={setActive} />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Metadata</h3>
            <div className="space-y-4">
              <FormField label="Type" required>
                <Select required>
                  <option value="">Select type</option>
                  <option>Compliance</option>
                  <option>Quality</option>
                  <option>Privacy</option>
                  <option>Legal</option>
                  <option>Operational</option>
                </Select>
              </FormField>
              <FormField label="Effective date">
                <Input type="date" />
              </FormField>
              <FormField label="Version">
                <Input placeholder="v1.0" />
              </FormField>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit">Save policy</Button>
            <Button variant="secondary" onClick={() => navigate("/admin/policies")}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
