import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Globe,
  Plane,
  Ship,
  Zap,
  Package,
  Clock,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  Headset,
  CheckCircle2,
  HeartHandshake,
  MessageCircle,
  Layers,
  BadgeIndianRupee,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";
import { EmptyState } from "../components/EmptyState";
import {
  listMarkets,
  REGION_LABELS,
  type Market as ApiMarket,
} from "../api/markets";

const PER_PAGE = 9;

interface Market {
  flag: string;
  country: string;
  region: string;
  code: string;
}

function mapApiMarket(m: ApiMarket): Market {
  return {
    flag: m.flag,
    country: m.country,
    region: REGION_LABELS[m.region] ?? m.region,
    code: m.code,
  };
}

export function Markets() {
  const [page, setPage] = useState(1);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listMarkets();
        if (cancelled) return;
        setMarkets(data.results.map(mapApiMarket));
      } catch (err) {
        console.error("Failed to load markets:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(markets.length / PER_PAGE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return markets.slice(start, start + PER_PAGE);
  }, [page, markets]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("markets-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div className="bg-white">
      {/* ============== HERO — globe with floating flags ============== */}
      <section className="relative bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white pt-32 pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8A96A]/15 rounded-full blur-[160px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm">
              <Sparkles size={12} className="text-[#C8A96A]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                Our Global Reach
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
              Crafted with care,<br />
              <span className="bg-gradient-to-r from-[#C8A96A] via-[#E6D3A3] to-[#C8A96A] bg-clip-text text-transparent">
                delivered to the world.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Active export destinations on five continents — backed by trusted
              carriers and full export documentation.
            </p>
          </div>

          {/* Globe with floating flag chips */}
          <div className="relative h-[320px] lg:h-[380px] flex items-center justify-center">
            {/* Center globe */}
            <div className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96A]/40 to-[#E6D3A3]/20 rounded-full blur-3xl scale-150" />
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center shadow-2xl shadow-[#C8A96A]/40">
                <Globe size={64} className="text-[#0B0B0B]" strokeWidth={1.5} />
              </div>
              {/* Orbiting ring */}
              <div className="absolute -inset-8 border border-[#C8A96A]/20 rounded-full" />
              <div className="absolute -inset-16 border border-[#C8A96A]/10 rounded-full" />
            </div>

            {/* Floating flag chips around globe */}
            {[
              { flag: "🇺🇸", country: "USA", x: "8%", y: "12%" },
              { flag: "🇬🇧", country: "UK", x: "82%", y: "15%" },
              { flag: "🇩🇪", country: "Germany", x: "20%", y: "78%" },
              { flag: "🇦🇪", country: "UAE", x: "70%", y: "78%" },
              { flag: "🇯🇵", country: "Japan", x: "90%", y: "50%" },
              { flag: "🇦🇺", country: "Australia", x: "5%", y: "55%" },
            ].map((m, i) => (
              <div
                key={i}
                className="absolute z-20 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-2 pr-3 py-1.5 shadow-lg"
                style={{
                  left: m.x,
                  top: m.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="text-xl leading-none">{m.flag}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">
                  {m.country}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm mt-4">
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-[#C8A96A]" />
              <CountUp end={50} suffix="+" /> &nbsp;active countries
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#C8A96A]" />
              Worldwide shipping
            </span>
          </div>
        </div>
      </section>

      {/* ============== STATS STRIP ============== */}
      <section className="bg-[#0B0B0B] border-y border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              {
                icon: Globe,
                node: <CountUp end={12} suffix="+" />,
                label: "Active Countries",
              },
              {
                icon: Package,
                node: <CountUp end={1000} suffix="+" />,
                label: "Containers Shipped",
              },
              {
                icon: Clock,
                node: <CountUp end={98} suffix="%" />,
                label: "On-Time Dispatch",
              },
              {
                icon: TrendingUp,
                node: <CountUp end={5} />,
                label: "Continents Reached",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-l-2 border-[#C8A96A] pl-5"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C8A96A]/20 to-[#E6D3A3]/10 flex items-center justify-center flex-shrink-0">
                  <s.icon size={18} className="text-[#C8A96A]" />
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent leading-none mb-1.5">
                    {s.node}
                  </div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MARKETS GRID — simplified cards ============== */}
      <section
        id="markets-grid"
        className="py-20 bg-white relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E6D3A3]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Active Destinations
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight">
              Countries We Serve
            </h2>
          </div>
          </Reveal>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : markets.length === 0 ? (
            <Reveal>
              <EmptyState
                icon={Globe}
                eyebrow="Destinations Loading"
                title="Our Active Destinations List is Being Updated"
                message="We're publishing the live list of countries we currently ship to. While we finalise it, our team can confirm any specific destination directly."
                ctaText="Confirm Your Destination"
                ctaTo="/contact"
              />
            </Reveal>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {pageItems.map((m, idx) => (
                  <Reveal key={m.code} delay={idx * 70}>
                  <article
                    className="group relative bg-gradient-to-br from-white to-[#FAF8F3] p-7 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#C8A96A]/15 to-transparent rounded-full blur-2xl group-hover:from-[#C8A96A]/30 transition-all duration-500" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className="text-7xl leading-none drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                          {m.flag}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] tracking-[0.2em] uppercase font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Active
                        </span>
                      </div>

                      <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1">
                        {m.region}
                      </div>
                      <h3 className="text-2xl font-bold text-[#0B0B0B] leading-tight">
                        {m.country}
                      </h3>
                    </div>
                  </article>
                  </Reveal>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

              <div className="mt-6 text-center text-sm text-[#6B7280]">
                Page {page} of {totalPages} · {markets.length} markets total
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============== SHIPPING MODES ============== */}
      <section className="py-20 bg-gradient-to-b from-[#FAF8F3] to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Shipping Options
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-4">
              Three Ways to Move Goods
            </h2>
            <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Match cost, speed, and reliability to your specific shipment.
            </p>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Ship,
                title: "Sea Freight",
                tag: "Most Economical",
                bestFor: "Bulk goods, non-urgent shipments, FCL/LCL",
              },
              {
                icon: Plane,
                title: "Air Freight",
                tag: "Fast & Premium",
                bestFor: "High-value, time-sensitive, or perishable goods",
              },
              {
                icon: Zap,
                title: "Express Courier",
                tag: "Door-to-door",
                bestFor: "Samples, urgent replacements, small consignments",
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 120}>
              <div
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-[#C8A96A]/10 to-transparent rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <s.icon size={26} className="text-[#0B0B0B]" />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#C8A96A] font-bold bg-[#C8A96A]/10 px-2.5 py-1 rounded-full">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B0B0B] mb-3">
                    {s.title}
                  </h3>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B7280] mb-1.5">
                      Best For
                    </div>
                    <p className="text-sm text-[#2B2B2B] leading-relaxed">
                      {s.bestFor}
                    </p>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== EXPORT PROMISE / SERVICE INCLUSIONS ============== */}
      <section className="py-20 bg-[#0B0B0B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C8A96A]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* LEFT — heading + intro */}
            <Reveal direction="left" className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Export Promise
                </span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                What's Included<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  with Every Shipment
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed max-w-md mb-6">
                From sourcing to dispatch, we handle the moving parts so you
                receive a complete export-ready package — no hidden gaps, no
                surprises.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-wider uppercase text-[#E6D3A3]">
                <CheckCircle2 size={14} className="text-[#C8A96A]" />
                Standard on every order
              </div>
            </Reveal>

            {/* RIGHT — checklist */}
            <div className="lg:col-span-7">
              <div className="space-y-3">
                {[
                  {
                    icon: FileCheck2,
                    title: "Complete Export Documentation",
                    desc: "Commercial invoice, packing list, certificate of origin, and bill of lading prepared and verified.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Cargo Insurance",
                    desc: "Coverage up to 110% of invoice value, protecting your shipment from origin to destination port.",
                  },
                  {
                    icon: MapPin,
                    title: "Real-time Shipment Tracking",
                    desc: "Live visibility from factory dispatch to destination port, with milestone notifications.",
                  },
                  {
                    icon: Package,
                    title: "Quality Inspection Report",
                    desc: "Pre-shipment QC report with photos and AQL sampling data delivered before final payment.",
                  },
                  {
                    icon: Globe,
                    title: "Customs Clearance Support",
                    desc: "Origin-side documentation and clearance handled; destination clearance assistance available.",
                  },
                  {
                    icon: Headset,
                    title: "Dedicated Account Manager",
                    desc: "Direct line to a single point of contact who knows your account and resolves issues quickly.",
                  },
                ].map((f, i) => (
                  <Reveal key={i} delay={i * 80} direction="right">
                  <div
                    className="group flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C8A96A]/40 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <f.icon size={20} className="text-[#0B0B0B]" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold">
                          0{i + 1}
                        </span>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {f.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHY BUYERS CHOOSE US — startup-flavoured differentiators ============== */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FAF8F3] relative overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[#C8A96A]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  The Moreadorn Way
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-4">
                Why buyers love<br />working with us
              </h2>
              <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                We're a young, founder-led trade house — which means real
                conversations, fast decisions, and shipments built around what
                you actually need.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: HeartHandshake,
                title: "Founder-led conversations",
                desc: "Talk directly to the people running the business — no call-centres, no scripted replies.",
              },
              {
                icon: MessageCircle,
                title: "Replies within 24 hours",
                desc: "Quotes, samples, follow-ups — answered the same day, with WhatsApp and email both open.",
              },
              {
                icon: Layers,
                title: "Flexible volumes",
                desc: "From a single trial pallet to a full container — we tailor every shipment to fit your stage.",
              },
              {
                icon: BadgeIndianRupee,
                title: "Transparent pricing",
                desc: "An itemised landed-cost breakdown with every quote — what you see is what you pay.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group h-full bg-white p-7 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
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
        </div>
      </section>

      {/* ============== INFO STRIP ============== */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#0B0B0B] mb-4 leading-tight tracking-tight">
            Don't see your country?
          </h3>
          <p className="text-[#6B7280] leading-relaxed mb-6 max-w-2xl mx-auto">
            We continuously expand our shipping network. If your destination
            isn't listed, contact us — we likely already serve it or can arrange
            it.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 group hover:gap-3 transition-all"
          >
            Reach our team
            <ArrowRight size={18} className="text-[#C8A96A]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
