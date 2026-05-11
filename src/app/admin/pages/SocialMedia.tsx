import { useEffect, useState } from "react";
import {
  Facebook,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  MessageCircle,
  Pin,
  RefreshCw,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { FormField, Input } from "../components/FormField";
import { Button } from "../components/Buttons";
import {
  fetchSocialMedia,
  updateSocialMedia,
  type SocialMediaInput,
} from "../../api/socialMedia";

interface PlatformDef {
  key: keyof SocialMediaInput;
  label: string;
  Icon: LucideIcon;
  accent: string;
  placeholder: string;
}

const PLATFORMS: PlatformDef[] = [
  {
    key: "facebook_url",
    label: "Facebook",
    Icon: Facebook,
    accent: "bg-[#1877F2]/10 text-[#1877F2]",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    key: "instagram_url",
    label: "Instagram",
    Icon: Instagram,
    accent: "bg-[#E4405F]/10 text-[#E4405F]",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    key: "linkedin_url",
    label: "LinkedIn",
    Icon: Linkedin,
    accent: "bg-[#0A66C2]/10 text-[#0A66C2]",
    placeholder: "https://linkedin.com/company/yourcompany",
  },
  {
    key: "twitter_url",
    label: "Twitter / X",
    Icon: Twitter,
    accent: "bg-slate-900/10 text-slate-900",
    placeholder: "https://x.com/yourhandle",
  },
  {
    key: "youtube_url",
    label: "YouTube",
    Icon: Youtube,
    accent: "bg-[#FF0000]/10 text-[#FF0000]",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    key: "whatsapp_url",
    label: "WhatsApp",
    Icon: MessageCircle,
    accent: "bg-[#25D366]/10 text-[#25D366]",
    placeholder: "https://wa.me/919876543210",
  },
  {
    key: "telegram_url",
    label: "Telegram",
    Icon: Send,
    accent: "bg-[#0088CC]/10 text-[#0088CC]",
    placeholder: "https://t.me/yourchannel",
  },
  {
    key: "pinterest_url",
    label: "Pinterest",
    Icon: Pin,
    accent: "bg-[#E60023]/10 text-[#E60023]",
    placeholder: "https://pinterest.com/yourhandle",
  },
  {
    key: "github_url",
    label: "GitHub",
    Icon: Github,
    accent: "bg-slate-900/10 text-slate-900",
    placeholder: "https://github.com/yourorg",
  },
  {
    key: "website_url",
    label: "Other Website",
    Icon: Globe2,
    accent: "bg-slate-500/10 text-slate-600",
    placeholder: "https://example.com",
  },
];

const EMPTY: SocialMediaInput = {
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  twitter_url: "",
  youtube_url: "",
  whatsapp_url: "",
  telegram_url: "",
  pinterest_url: "",
  github_url: "",
  website_url: "",
};

export function SocialMedia() {
  const [form, setForm] = useState<SocialMediaInput>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await fetchSocialMedia(true);
      setForm({
        facebook_url: s.facebook_url,
        instagram_url: s.instagram_url,
        linkedin_url: s.linkedin_url,
        twitter_url: s.twitter_url,
        youtube_url: s.youtube_url,
        whatsapp_url: s.whatsapp_url,
        telegram_url: s.telegram_url,
        pinterest_url: s.pinterest_url,
        github_url: s.github_url,
        website_url: s.website_url,
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

  const set = (key: keyof SocialMediaInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSocialMedia(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const visibleCount = PLATFORMS.filter((p) => (form[p.key] || "").trim()).length;

  return (
    <div>
      <PageHeader
        title="Social Media"
        description="Add the social profile URLs shown in the public footer. Empty fields are hidden automatically."
        breadcrumbs={[{ label: "Admin" }, { label: "Settings" }, { label: "Social Media" }]}
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
        <div className="lg:col-span-2 space-y-4">
          {PLATFORMS.map(({ key, label, Icon, accent, placeholder }) => (
            <section
              key={key}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <FormField label={label}>
                    <Input
                      type="url"
                      value={form[key] as string}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                    />
                  </FormField>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div>
          <section className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Save changes
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Updates apply instantly to the public footer.
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

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-700">
                  {visibleCount}
                </span>{" "}
                of {PLATFORMS.length} profiles visible in the footer. Empty
                fields are automatically hidden — no on/off toggle needed.
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
