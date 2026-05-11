import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Facebook,
  Github,
  Globe2,
  Instagram,
  LifeBuoy,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Pin,
  Send as SendIcon,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import { useCompanyContact } from "../hooks/useCompanyContact";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { LucideIcon } from "lucide-react";

interface SocialLink {
  url: string;
  Icon: LucideIcon;
  label: string;
}

export function Footer() {
  const contact = useCompanyContact();
  const social = useSocialMedia();

  const socialLinks: SocialLink[] = social
    ? (
        [
          { url: social.facebook_url, Icon: Facebook, label: "Facebook" },
          { url: social.instagram_url, Icon: Instagram, label: "Instagram" },
          { url: social.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
          { url: social.twitter_url, Icon: Twitter, label: "Twitter / X" },
          { url: social.youtube_url, Icon: Youtube, label: "YouTube" },
          { url: social.whatsapp_url, Icon: MessageCircle, label: "WhatsApp" },
          { url: social.telegram_url, Icon: SendIcon, label: "Telegram" },
          { url: social.pinterest_url, Icon: Pin, label: "Pinterest" },
          { url: social.github_url, Icon: Github, label: "GitHub" },
          { url: social.website_url, Icon: Globe2, label: "Website" },
        ] as SocialLink[]
      ).filter((s) => s.url && s.url.trim().length > 0)
    : [];
  // Pull live values; never fall back to fake placeholders that look real.
  const email = (contact?.contact_email || "").trim();
  const queryEmail = (contact?.query_email || "").trim() || email;
  const phone = (contact?.phone || "").trim();
  const locationLine = contact
    ? [contact.city, contact.state, contact.country].filter(Boolean).join(", ")
    : "";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/products", label: "Products" },
    { to: "/markets", label: "Markets" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/policies", label: "Policies" },
  ];

  const promises = [
    { icon: Clock, label: "Replies < 24h" },
    { icon: Globe2, label: "Shipping to 50+ countries" },
    { icon: Sparkles, label: "Founder-led service" },
    { icon: LifeBuoy, label: "Personal trade desk" },
  ];

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0B0B0B] text-white overflow-hidden">
      {/* ============== Top gold accent line ============== */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent" />

      {/* ============== Background ambience ============== */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-[#C8A96A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-[#E6D3A3]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        {/* ============== PROMISE STRIP — 4 trust pills ============== */}
        <div className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {promises.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 group"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <p.icon size={15} className="text-[#0B0B0B]" />
                  </span>
                  <span className="text-[11.5px] sm:text-xs tracking-[0.06em] text-gray-300 font-medium">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============== MAIN FOOTER ============== */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* ===== Brand + contact channels (5 cols) ===== */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <span className="absolute -inset-1 rounded-2xl bg-[#C8A96A]/40 blur-md" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-lg shadow-[#C8A96A]/20">
                    <span className="text-[#0B0B0B] font-bold text-xl">M</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight leading-none">
                    MORE<span className="text-[#C8A96A]">ADORN</span>
                  </div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mt-1.5">
                    Global Trade Co.
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-7 leading-relaxed max-w-md text-[14.5px]">
                Premium global export and bulk supply solutions delivered to
                worldwide destinations — your trusted partner in international
                trade.
              </p>

              <div className="space-y-2">
                {/* Channel 1 — contact email */}
                <ChannelRow
                  icon={Mail}
                  href={email ? `mailto:${email}` : undefined}
                  eyebrow="Email"
                  value={email || "Reach us via the contact form"}
                  muted={!email}
                />
                {/* Channel 2 — Support Mail */}
                <ChannelRow
                  icon={LifeBuoy}
                  href={queryEmail ? `mailto:${queryEmail}` : undefined}
                  eyebrow="Support Mail"
                  value={queryEmail || "Coming soon — use the contact form"}
                  muted={!queryEmail}
                />
                {/* Channel 3 — phone (only when configured) */}
                {phone && (
                  <ChannelRow
                    icon={Phone}
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    eyebrow="Phone"
                    value={phone}
                  />
                )}
                {/* Channel 4 — location (only when configured) */}
                {locationLine && (
                  <ChannelRow
                    icon={MapPin}
                    href={contact?.google_maps_url || undefined}
                    external={!!contact?.google_maps_url}
                    eyebrow="Visit"
                    value={locationLine}
                  />
                )}
              </div>
            </div>

            {/* ===== Quick Links (4 cols) ===== */}
            <div className="md:col-span-4">
              <SectionHeading>Quick Links</SectionHeading>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-6">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="group inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-[#C8A96A] transition-colors"
                  >
                    <ArrowRight
                      size={12}
                      className="text-[#C8A96A]/40 group-hover:text-[#C8A96A] -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                    />
                    <span className="border-b border-transparent group-hover:border-[#C8A96A]/40">
                      {l.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* ===== Connect (3 cols) ===== */}
            <div className="md:col-span-3">
              <SectionHeading>Connect With Us</SectionHeading>
              {socialLinks.length === 0 ? (
                <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Add social profile URLs from the admin panel to display
                    them here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {socialLinks.map(({ url, Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="group relative w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#0B0B0B] hover:border-transparent transition-all overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon
                        size={18}
                        className="relative z-10 group-hover:scale-110 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Mini CTA card — pushes traffic into the contact form */}
              <div className="mt-7 p-4 rounded-xl bg-gradient-to-br from-[#C8A96A]/15 via-[#C8A96A]/5 to-transparent border border-[#C8A96A]/20">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1.5">
                  Need a quote?
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-[#C8A96A] group transition-colors"
                >
                  Reach our trade desk
                  <ArrowRight
                    size={14}
                    className="text-[#C8A96A] group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============== Bottom hairline (gradient) ============== */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A]/40 to-transparent" />

        {/* ============== BOTTOM BAR ============== */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 tracking-wide">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-gray-300 font-semibold">Moreadorn</span> —
              All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <p className="text-[11px] text-gray-500 tracking-[0.18em] uppercase hidden sm:block">
                Designed for{" "}
                <span className="text-[#C8A96A] font-semibold">
                  global trade
                </span>
              </p>

              {/* Back to top */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#C8A96A] font-bold transition-colors"
              >
                Back to top
                <span className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 group-hover:bg-gradient-to-br group-hover:from-[#C8A96A] group-hover:to-[#E6D3A3] group-hover:border-transparent flex items-center justify-center transition-all">
                  <ArrowUp
                    size={13}
                    className="text-[#C8A96A] group-hover:text-[#0B0B0B] transition-colors"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ====================================================================
// Subcomponents — kept inline so the footer file is self-contained.
// ====================================================================

interface ChannelRowProps {
  icon: LucideIcon;
  eyebrow: string;
  value: string;
  href?: string;
  external?: boolean;
  muted?: boolean;
}

/** A single contact line — icon tile + uppercase eyebrow + value. Becomes
 * a link when ``href`` is provided; otherwise renders as plain text. */
function ChannelRow({
  icon: Icon,
  eyebrow,
  value,
  href,
  external,
  muted,
}: ChannelRowProps) {
  const inner = (
    <>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 group-hover:border-[#C8A96A]/40 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/10 transition-all">
        <Icon size={16} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9.5px] tracking-[0.22em] uppercase text-gray-500 font-bold leading-none mb-1">
          {eyebrow}
        </span>
        <span
          className={`text-[14px] truncate ${
            muted ? "text-gray-500" : "text-gray-300 group-hover:text-[#C8A96A]"
          } transition-colors`}
        >
          {value}
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group flex items-center gap-3.5 py-1.5 transition-colors"
      >
        {inner}
      </a>
    );
  }
  return <div className="group flex items-center gap-3.5 py-1.5">{inner}</div>;
}

/** Section heading with the brand's gold-dash + uppercase pattern. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 h-px bg-[#C8A96A]" />
      <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C8A96A]">
        {children}
      </span>
    </div>
  );
}
