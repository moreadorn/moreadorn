import { useMemo, useState } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Clock,
  ArrowUpRight,
  LifeBuoy,
  HeartHandshake,
  PackageCheck,
  Globe2,
  HelpCircle,
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { useCompanyContact } from "../hooks/useCompanyContact";
import type { BusinessHour, WeekDay } from "../api/companyContact";
import { createRequestQuote } from "../api/requestQuotes";

const DAY_LABEL: Record<WeekDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const FALLBACK_HOURS: BusinessHour[] = [
  { day: "monday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "tuesday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "wednesday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "thursday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "friday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "saturday", is_open: true, open_time: "10:00", close_time: "16:00" },
  { day: "sunday", is_open: false, open_time: "", close_time: "" },
];

function formatTime(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${mStr ?? "00"} ${suffix}`;
}

interface HourSummary {
  label: string;
  value: string;
}

/** Group consecutive identical days like Google: "Mon – Fri  9:00 AM – 6:00 PM". */
function summarizeHours(hours: BusinessHour[]): HourSummary[] {
  const out: HourSummary[] = [];
  let i = 0;
  while (i < hours.length) {
    const start = hours[i];
    let j = i;
    while (
      j + 1 < hours.length &&
      hours[j + 1].is_open === start.is_open &&
      hours[j + 1].open_time === start.open_time &&
      hours[j + 1].close_time === start.close_time
    ) {
      j++;
    }
    const startLabel = DAY_LABEL[start.day].slice(0, 3);
    const endLabel = DAY_LABEL[hours[j].day].slice(0, 3);
    const label = i === j ? startLabel : `${startLabel} – ${endLabel}`;
    const value = start.is_open
      ? `${formatTime(start.open_time)} – ${formatTime(start.close_time)}`
      : "Closed";
    out.push({ label, value });
    i = j + 1;
  }
  return out;
}

export function Contact() {
  const contact = useCompanyContact();

  // Live values only — no fake placeholders. Empty strings flow into the
  // graceful-fallback branches below.
  const channelEmail = (contact?.contact_email || "").trim();
  const queryEmail = (contact?.query_email || "").trim() || channelEmail;
  const phone = (contact?.phone || "").trim();
  const whatsappHref = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : "";
  const officeCity = contact?.city || "";
  const officeState = contact?.state || "";
  const officeCountry = contact?.country || "";

  // Convert whatever the admin pasted (full place URL, short link, or
  // address-only URL) into something Google permits inside an iframe.
  // Google's regular maps URLs are blocked by X-Frame-Options, but the
  // ``?q=…&output=embed`` form on ``maps.google.com`` is allowed. Lat/lng
  // is preferred when we can find it (more accurate than address parsing).
  const mapEmbedUrl = useMemo(() => {
    const raw = (contact?.google_maps_url || "").trim();
    if (!raw) return "";
    // !3d<lat>!4d<lng> is the precise pin location in modern Google URLs.
    const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
    // @<lat>,<lng>,<zoom>z is the camera position — fallback when no pin.
    const cam = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    const m = pin || cam;
    if (m) {
      return `https://maps.google.com/maps?q=${m[1]},${m[2]}&z=15&hl=en&output=embed`;
    }
    // ?q=<query> in the URL → reuse the query directly.
    const q = raw.match(/[?&]q=([^&]+)/);
    if (q) {
      try {
        return `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(q[1]))}&z=15&hl=en&output=embed`;
      } catch {
        /* fall through */
      }
    }
    // Last resort: search the textual address pulled from the contact row.
    const addressQuery = [
      contact?.address,
      contact?.city,
      contact?.state,
      contact?.country,
    ]
      .filter(Boolean)
      .join(", ");
    if (addressQuery) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&z=15&hl=en&output=embed`;
    }
    return "";
  }, [
    contact?.google_maps_url,
    contact?.address,
    contact?.city,
    contact?.state,
    contact?.country,
  ]);
  const fullAddress = [
    contact?.address,
    contact?.city,
    contact?.state,
    contact?.zip_code,
    contact?.country,
  ]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = contact?.google_maps_url;

  const summarizedHours = useMemo(
    () => summarizeHours(contact?.business_hours?.length ? contact.business_hours : FALLBACK_HOURS),
    [contact?.business_hours],
  );

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    whatsapp: "",
    phone: "",
    email: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createRequestQuote({
        category_name: "contact",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip_code: formData.zipCode.trim(),
        description: formData.description.trim(),
      });
      alert("Thank you for contacting us! We will get back to you shortly.");
      setFormData({
        name: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
        whatsapp: "",
        phone: "",
        email: "",
        description: "",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C8A96A] focus:border-transparent outline-none bg-white transition-all";
  const labelCls =
    "block text-[11px] font-semibold text-[#0B0B0B] mb-1.5 tracking-wider uppercase";

  return (
    <div className="bg-white">
      {/* ============== HERO — minimal split with greeting card ============== */}
      <section className="relative bg-[#0B0B0B] text-white pt-32 pb-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#E6D3A3]/15 rounded-full blur-[140px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#C8A96A]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                  Online · Replying within 24h
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
                Hello.<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  How can we help?
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 max-w-xl leading-relaxed">
                Whether you need a custom quote, have a sourcing inquiry, or
                want to explore a partnership — we'd love to hear from you.
              </p>
            </div>

            {/* RIGHT — quick stat tiles */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-[#C8A96A]/40 transition-all">
                  <Mail size={20} className="text-[#C8A96A] mb-3" />
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1">
                    Email
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {channelEmail || "Use the form to reach us"}
                  </div>
                </div>
                {/* Phone tile replaced with Support Mail (query inbox) */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-[#C8A96A]/40 transition-all">
                  <LifeBuoy size={20} className="text-[#C8A96A] mb-3" />
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1">
                    Support Mail
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {queryEmail || "Available on request"}
                  </div>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <Clock size={20} />
                    <span className="text-[10px] tracking-[0.25em] uppercase font-bold">
                      Response Time
                    </span>
                  </div>
                  <div className="text-3xl font-bold leading-none mb-1">
                    &lt; 24 hrs
                  </div>
                  <div className="text-xs">
                    Personal reply, every weekday — no bots.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CHANNEL CARDS ============== */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
          <Reveal>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: channelEmail || "Reach us via the form below",
                  href: channelEmail ? `mailto:${channelEmail}` : "#contact-form",
                  cta: channelEmail ? "Send an email" : "Open contact form",
                  accent: "bg-[#0B0B0B]",
                  textAccent: "text-white",
                  external: false,
                },
                {
                  icon: LifeBuoy,
                  label: "Support Mail",
                  value: queryEmail || "Available on request",
                  href: queryEmail ? `mailto:${queryEmail}` : "#contact-form",
                  cta: queryEmail ? "Email support" : "Open contact form",
                  accent: "bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3]",
                  textAccent: "text-[#0B0B0B]",
                  external: false,
                },
                {
                  icon: MessageSquare,
                  label: "WhatsApp",
                  value: phone ? "Chat instantly" : "Coming soon",
                  href: whatsappHref || "#contact-form",
                  cta: phone ? "Open WhatsApp" : "Use the form for now",
                  accent: "bg-[#25D366]",
                  textAccent: "text-white",
                  external: !!phone,
                },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:-translate-y-1 transition-all duration-500 p-7"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#C8A96A]/10 to-transparent rounded-full blur-2xl group-hover:from-[#C8A96A]/25 transition-all duration-500" />

                  <div className="relative">
                    <div
                      className={`w-12 h-12 ${c.accent} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <c.icon className={c.textAccent} size={22} />
                    </div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1">
                      {c.label}
                    </div>
                    <div className="text-lg font-bold text-[#0B0B0B] mb-3 leading-tight break-words">
                      {c.value}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B0B0B] border-b border-[#C8A96A] pb-0.5 group-hover:gap-2.5 transition-all">
                      {c.cta}
                      <ArrowUpRight size={13} className="text-[#C8A96A]" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== FORM + INFO ============== */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* FORM */}
            <Reveal direction="left" className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 lg:p-10">
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="w-12 h-px bg-[#C8A96A]" />
                  <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                    Send a Message
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0B0B0B] mb-2 leading-tight tracking-tight">
                  Tell us about your project
                </h2>
                <p className="text-sm text-[#6B7280] mb-7">
                  Fill out the form and we'll respond within 24 hours.
                  {queryEmail ? (
                    <>
                      {" "}Inquiries go to{" "}
                      <a
                        href={`mailto:${queryEmail}`}
                        className="text-[#C8A96A] font-semibold hover:underline"
                      >
                        {queryEmail}
                      </a>
                      .
                    </>
                  ) : (
                    <> Every message reaches our trade desk directly.</>
                  )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className={labelCls}>
                        Country *
                      </label>
                      <input
                        id="country"
                        type="text"
                        required
                        placeholder="United States"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelCls}>
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className={labelCls}>
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        placeholder="NY"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className={labelCls}>
                        Zip Code
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsapp" className={labelCls}>
                        WhatsApp *
                      </label>
                      <input
                        id="whatsapp"
                        type="tel"
                        required
                        placeholder="+1 234 567 8900"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelCls}>
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelCls}>
                      Your Message / Requirements *
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={5}
                      placeholder="Tell us about your requirements — products, quantities, delivery location, timeline..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {submitError && (
                    <div className="mb-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-[#C8A96A]/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.1em] uppercase disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <Send size={16} />
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </Reveal>

            {/* SIDE INFO */}
            <Reveal direction="right" delay={150} className="lg:col-span-5">
              <div className="space-y-5 lg:sticky lg:top-32">
                {/* Office card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white rounded-3xl p-8 shadow-xl">
                  <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#C8A96A]/15 rounded-full blur-[100px]" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-8 h-px bg-[#C8A96A]" />
                      <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8A96A] uppercase">
                        Our Office
                      </span>
                    </div>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                        <MapPin size={20} className="text-[#0B0B0B]" />
                      </div>
                      <div>
                        <div className="text-lg font-bold leading-tight">
                          {officeCity || officeCountry
                            ? `${officeCity}${officeState ? `, ${officeState}` : ""}`
                            : "Office details coming soon"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {officeCountry || "We'll publish our address here shortly"}
                        </div>
                      </div>
                    </div>
                    {fullAddress && (
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        {fullAddress}
                      </p>
                    )}
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8A96A] hover:gap-2.5 transition-all"
                      >
                        Open in Google Maps
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Business hours card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-md">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-8 h-px bg-[#C8A96A]" />
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8A96A] uppercase">
                      Business Hours
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                      <Clock size={20} className="text-[#0B0B0B]" />
                    </div>
                    <div className="flex-1 space-y-2 text-sm text-[#2B2B2B]">
                      {summarizedHours.map((s, idx) => (
                        <div key={idx} className="flex justify-between gap-3">
                          <span className="text-[#6B7280]">{s.label}</span>
                          <span
                            className={`font-semibold text-right ${
                              s.value === "Closed" ? "text-red-500" : ""
                            }`}
                          >
                            {s.value}
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 mt-2 border-t border-gray-100 text-[11px] tracking-wider uppercase text-[#C8A96A] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-pulse" />
                        24/7 Email Support
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response promise */}
                <div className="bg-gradient-to-br from-[#F5F1E8] to-white border border-[#C8A96A]/30 rounded-3xl p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                      <Sparkles size={20} className="text-[#0B0B0B]" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#0B0B0B] mb-1">
                        Our response promise
                      </div>
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        Every inquiry gets a personal reply within{" "}
                        <strong className="text-[#0B0B0B]">24 hours</strong> on
                        weekdays. No bots, no auto-replies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== WHY REACH OUT — startup-flavoured value props ============== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute -top-32 left-0 w-[500px] h-[500px] bg-[#C8A96A]/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] bg-[#E6D3A3]/8 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Why Reach Out
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-4">
                What you get when<br />you write to us
              </h2>
              <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                Every message lands directly with our trade desk. Here's what
                happens after you hit send.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              {
                icon: HeartHandshake,
                title: "A real person replies",
                desc: "No auto-responders, no ticket numbers. Just a short note from someone on the trade desk.",
              },
              {
                icon: Clock,
                title: "Within 24 hours",
                desc: "Weekday turnaround time, with WhatsApp follow-up when you've shared a number.",
              },
              {
                icon: PackageCheck,
                title: "A scoped next step",
                desc: "Whether it's a quote, sample, or sourcing question — you'll know exactly what comes next.",
              },
              {
                icon: Globe2,
                title: "Honest answers",
                desc: "If we can't ship to your country or product, we say so up front instead of stringing you along.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group h-full bg-gradient-to-br from-white to-[#FAF8F3] p-7 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={22} className="text-[#0B0B0B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B0B0B] mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quick FAQ — common questions before they get to the form */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <Reveal direction="left" className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-10 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-[10px] uppercase">
                  Before You Write
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-4">
                Three quick answers
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                The most common things people check before reaching out — if
                we've already covered yours, you're a step ahead.
              </p>
            </Reveal>

            <div className="lg:col-span-8 space-y-3">
              {[
                {
                  q: "Do I need to know my full requirements first?",
                  a: "Not at all. Many of our best partnerships start with a one-line message asking if a product is even available. Share what you have and we'll work the rest out together.",
                },
                {
                  q: "Is there a minimum order to talk to you?",
                  a: "No minimums to enquire — and we keep MOQs flexible for first-time partners. We'd rather start small with you than turn you away.",
                },
                {
                  q: "How quickly can you put a quote together?",
                  a: "For products on our catalogue, indicative pricing within 24 hours. For sourcing requests or custom specs, usually 2–3 business days while we line up the right supplier.",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <details className="group bg-gradient-to-br from-[#FAF8F3] to-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 transition-all overflow-hidden">
                    <summary className="flex items-start gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                        <HelpCircle size={14} className="text-[#0B0B0B]" />
                      </span>
                      <h4 className="flex-1 text-[15px] font-bold text-[#0B0B0B] leading-snug pt-1 group-hover:text-[#C8A96A] transition-colors">
                        {item.q}
                      </h4>
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white text-[#C8A96A] border border-[#C8A96A]/20 flex items-center justify-center text-lg font-bold transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-1 pl-[3.75rem]">
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== MAP / LOCATION ============== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            {mapEmbedUrl ? (
              // Real map embedded — wrap in a dark frame so the iframe sits
              // flush inside the rounded card, with a small overlay caption
              // on top so the visitor sees what they're looking at.
              <div className="relative bg-[#0B0B0B] rounded-3xl overflow-hidden shadow-2xl">
                <iframe
                  src={mapEmbedUrl}
                  title="Office location"
                  width="100%"
                  height="420"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full h-[420px] border-0"
                />
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0B0B]/85 backdrop-blur-sm border border-[#C8A96A]/30 text-white text-[10px] tracking-[0.2em] uppercase font-bold">
                  <MapPin size={12} className="text-[#C8A96A]" />
                  Visit Our Office
                </div>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] text-[11px] font-bold tracking-[0.12em] uppercase hover:shadow-lg hover:shadow-[#C8A96A]/40 transition-all"
                  >
                    Open in Google Maps
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            ) : (
              // No URL configured (and no parseable address) — keep the
              // existing branded placeholder card.
              <div className="bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] rounded-3xl overflow-hidden h-[420px] flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 opacity-[0.06]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
                      backgroundSize: "48px 48px",
                    }}
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8A96A]/15 rounded-full blur-[120px]" />

                <div className="relative text-center px-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] mb-6 shadow-lg shadow-[#C8A96A]/30">
                    <MapPin size={32} className="text-[#0B0B0B]" />
                  </div>
                  <p className="text-white font-bold text-2xl lg:text-3xl mb-2">
                    Visit Our Office
                  </p>
                  <p className="text-gray-400 text-base mb-1">
                    {[officeCity, officeState, officeCountry]
                      .filter(Boolean)
                      .join(", ") || "Address coming soon"}
                  </p>
                  {officeCountry && (
                    <p className="text-xs text-gray-500 tracking-wider uppercase">
                      Heart of {officeCountry}'s trade corridor
                    </p>
                  )}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
