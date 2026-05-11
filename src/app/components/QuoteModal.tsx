import {
  X,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  Handshake,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCompanyContact } from "../hooks/useCompanyContact";
import { createRequestQuote } from "../api/requestQuotes";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const contact = useCompanyContact();
  const modalEmail = (contact?.contact_email || "").trim();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    product: "",
    quantity: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createRequestQuote({
        category_name: "info",
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        country: formData.country.trim(),
        product_name: formData.product.trim(),
        quantity: formData.quantity.trim(),
        description: formData.message.trim(),
      });
      alert("Thank you! Our team will respond within 24 hours.");
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        country: "",
        product: "",
        quantity: "",
        message: "",
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C8A96A] focus:border-transparent outline-none bg-white transition-all";
  const labelCls =
    "block text-[11px] font-semibold text-[#0B0B0B] mb-1.5 tracking-wider uppercase";

  const benefits = [
    { icon: Clock, title: "24-Hour Response", desc: "We reply every weekday" },
    { icon: Handshake, title: "Factory-Direct Pricing", desc: "No middlemen, no markup" },
    { icon: ShieldCheck, title: "No Obligation", desc: "Quotes are free, always" },
    { icon: CheckCircle2, title: "Founder-Led Service", desc: "A real person, every time" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0B0B0B]/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto lg:overflow-hidden grid lg:grid-cols-12">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-[#0B0B0B] transition-all z-30 shadow-lg"
        >
          <X size={18} />
        </button>

        {/* LEFT — benefits panel (scrolls independently on tall content) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white lg:overflow-y-auto lg:max-h-[92vh]">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#C8A96A]/15 rounded-full blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-[#E6D3A3]/10 rounded-full blur-[100px]" />

          <div className="relative p-7 lg:p-9 h-full flex flex-col">
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm w-fit">
              <Sparkles size={12} className="text-[#C8A96A]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                Get a Quote
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold leading-[1.15] tracking-tight mb-4">
              Tell us what you need.<br />
              <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                We'll do the rest.
              </span>
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              Share your sourcing brief — we'll match suppliers, lock in the
              best price, and ship to your destination.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-7">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                    <b.icon size={16} className="text-[#0B0B0B]" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm font-bold text-white leading-snug">
                      {b.title}
                    </div>
                    <div className="text-[11px] text-gray-400 leading-relaxed">
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-auto pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available now
              </div>
              {modalEmail ? (
                <a
                  href={`mailto:${modalEmail}`}
                  className="inline-flex items-center gap-2 text-xs text-[#E6D3A3] hover:text-[#C8A96A] transition-colors"
                >
                  <Mail size={12} />
                  {modalEmail}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={12} />
                  Replies sent within 24 hours
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="lg:col-span-7 overflow-y-auto max-h-[52vh] lg:max-h-[92vh]">
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-[#0B0B0B] leading-tight">
                Your details
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                All fields with * are required.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
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
              <div>
                <label className={labelCls}>Country *</label>
                <input
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
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email *</label>
                <input
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
                <label className={labelCls}>WhatsApp *</label>
                <input
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
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-bold text-[#0B0B0B] leading-tight mb-1">
                Your requirement
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Product / Category *</label>
                <input
                  type="text"
                  required
                  placeholder="Textiles, Electronics..."
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({ ...formData, product: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Quantity / Volume</label>
                <input
                  type="text"
                  placeholder="1000 units, 5 tons..."
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Additional Notes</label>
              <textarea
                rows={3}
                placeholder="Delivery destination, timeline, certifications needed..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`${inputCls} resize-none`}
              />
            </div>

            {submitError && (
              <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] py-3 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-[#C8A96A]/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Send size={15} />
              {submitting ? "Sending…" : "Send Quote Request"}
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              By submitting, you agree to our privacy practices. We never share
              your details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
