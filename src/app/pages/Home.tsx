import { useState } from "react";
import { Link } from "react-router";
import {
  Globe,
  DollarSign,
  ShieldCheck,
  Hotel,
  Plane,
  Building2,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Award,
  Clock,
  PackageSearch,
  Truck,
  Handshake,
  CheckCircle2,
  Play,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import { QuoteModal } from "../components/QuoteModal";
import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";

export function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const faqs = [
    {
      q: "What is the minimum order quantity (MOQ)?",
      a: "MOQ varies by product category — most items start at 100 units, while bulk commodities have higher thresholds. Share your requirements and we'll confirm what's possible.",
    },
    {
      q: "How long does shipping typically take?",
      a: "Sea freight: 25–45 days; Air freight: 5–10 days; Express: 3–5 business days. Transit times depend on origin, destination, and customs clearance.",
    },
    {
      q: "Are import duties and taxes included in your quote?",
      a: "Our quotes cover product cost, packaging, and shipping. Local import duties, VAT, and customs fees are payable by the buyer at destination unless otherwise agreed.",
    },
    {
      q: "Do you handle customs clearance?",
      a: "We handle export-side documentation and clearance from origin. Destination customs clearance is typically managed by the buyer or their customs broker — we provide all required paperwork.",
    },
    {
      q: "Can I request product samples before placing a bulk order?",
      a: "Yes. Most categories support sample requests. Sample fees and shipping are at cost, often credited toward your first bulk order.",
    },
    {
      q: "What payment terms do you offer?",
      a: "Standard terms include 30% advance + 70% before dispatch via T/T or L/C. For repeat partners, we offer flexible terms. Escrow and trade finance options are available.",
    },
  ];

  const industries = [
    { icon: Hotel, name: "Hotels & Hospitality" },
    { icon: Plane, name: "Travel & Tourism" },
    { icon: Building2, name: "Corporate & B2B" },
    { icon: ShoppingBag, name: "Retail" },
    { icon: Calendar, name: "Events & Exhibitions" },
  ];

  const stats: { node: React.ReactNode; label: string }[] = [
    {
      node: <CountUp end={50} suffix="+" />,
      label: "Countries Served",
    },
    {
      node: <CountUp end={500} suffix="+" />,
      label: "Happy Clients",
    },
    {
      node: <CountUp end={1000} suffix="+" />,
      label: "Successful Shipments",
    },
    { node: "24/7", label: "Support Available" },
  ];

  const process = [
    {
      icon: PackageSearch,
      step: "01",
      title: "Discover",
      description:
        "Share your sourcing requirements and we curate the best matches.",
    },
    {
      icon: Handshake,
      step: "02",
      title: "Negotiate",
      description:
        "Factory-direct pricing locked in with transparent terms.",
    },
    {
      icon: ShieldCheck,
      step: "03",
      title: "Quality Check",
      description:
        "Every shipment passes our multi-stage QC before dispatch.",
    },
    {
      icon: Truck,
      step: "04",
      title: "Deliver",
      description:
        "Door-to-door logistics with real-time tracking worldwide.",
    },
  ];

  return (
    <div className="bg-white">
      {/* ============== HERO (only section with video) ============== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0B0B]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/moreAdorn.mp4" type="video/mp4" />
        </video>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-[#0B0B0B]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/40" />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Glow accents */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#C8A96A]/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 z-10 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm">
              <Sparkles size={14} className="text-[#C8A96A]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#E6D3A3] uppercase">
                Premium Exports · Global Reach
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
              Crafting Global<br />
              Trade with{" "}
              <span className="bg-gradient-to-r from-[#C8A96A] via-[#E6D3A3] to-[#C8A96A] bg-clip-text text-transparent">
                Precision
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-light">
              Premium products, transparent pricing, and seamless logistics —
              delivered to businesses across continents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <button
                onClick={() => setQuoteOpen(true)}
                className="group bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] px-10 py-5 rounded-full font-bold text-base hover:shadow-2xl hover:shadow-[#C8A96A]/40 transform hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center tracking-wide"
              >
                Request a Quote
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </button>
              <Link
                to="/products"
                className="group bg-white/5 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-semibold text-base hover:bg-white/10 hover:border-[#C8A96A]/60 transition-all duration-300 inline-flex items-center justify-center tracking-wide"
              >
                <Play size={16} className="mr-2 text-[#C8A96A]" fill="#C8A96A" />
                Explore Products
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/10 max-w-3xl">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent mb-1">
                    {stat.node}
                  </div>
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ============== TRUST STRIP ============== */}
      <section className="bg-[#0B0B0B] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-gray-500 text-sm tracking-wider uppercase">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#C8A96A]" /> 50+ Countries
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#C8A96A]" /> 24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#C8A96A]" /> Factory-Direct Pricing
            </span>
          </div>
        </div>
      </section>

      {/* ============== ABOUT PREVIEW ============== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#C8A96A]/20 to-[#E6D3A3]/10 rounded-[2rem] blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&h=600&fit=crop"
                    alt="Global shipping"
                    className="rounded-2xl shadow-xl w-full h-72 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=400&fit=crop"
                    alt="Quality products"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover"
                  />
                </div>
                <div className="space-y-4 pt-12">
                  <img
                    src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=500&h=400&fit=crop"
                    alt="Warehouse"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=600&fit=crop"
                    alt="Business"
                    className="rounded-2xl shadow-xl w-full h-72 object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] p-8 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold text-[#0B0B0B] mb-1">10+</div>
                <div className="text-[#0B0B0B] font-semibold text-sm tracking-wide uppercase">
                  Years Excellence
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  About Moreadorn
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-8 leading-[1.1] tracking-tight">
                Your Trusted Global<br />Trade Partner
              </h2>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                Moreadorn is a leading global export company specializing in
                bulk supply and international trade. We connect manufacturers
                with businesses worldwide — delivering premium quality at
                competitive prices.
              </p>
              <p className="text-lg text-[#6B7280] mb-12 leading-relaxed">
                With an extensive logistics network and decade-long expertise,
                we make global trade simple, transparent, and efficient.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Award, title: "Premium Quality", sub: "Certified products only" },
                  { icon: Clock, title: "Fast Delivery", sub: "Express worldwide shipping" },
                  { icon: ShieldCheck, title: "Trusted Partner", sub: "10+ years of excellence" },
                  { icon: Globe, title: "Global Reach", sub: "50+ countries served" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-[#0B0B0B]" size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-[#0B0B0B] mb-0.5">
                        {item.title}
                      </div>
                      <div className="text-sm text-[#6B7280]">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 group hover:gap-3 transition-all"
              >
                Discover Our Story
                <ArrowRight size={18} className="text-[#C8A96A]" />
              </Link>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ============== PROCESS / HOW WE WORK ============== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                How We Work
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-6 leading-tight tracking-tight">
              From Inquiry to Delivery
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              A streamlined four-step process designed for clarity, speed, and
              accountability.
            </p>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <Reveal key={i} delay={i * 100} className="relative group">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <p.icon className="text-[#0B0B0B]" size={26} />
                    </div>
                    <span className="text-5xl font-bold text-gray-100 group-hover:text-[#C8A96A]/30 transition-colors">
                      {p.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B0B0B] mb-3">
                    {p.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed text-sm">
                    {p.description}
                  </p>
                </div>
                {i < process.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-[#C8A96A]/40 z-10"
                  />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== WHAT SETS US APART — old way vs Moreadorn way ============== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6D3A3]/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Why Us
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-5">
                Big-house service,<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  startup-fast.
                </span>
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                Cross-border trade often feels slow, opaque, and impersonal.
                Here's how we do it differently.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT — the old way */}
            <Reveal direction="left">
              <div className="relative h-full bg-gradient-to-br from-gray-50 to-white p-8 lg:p-10 rounded-2xl border border-gray-200">
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-[10px] tracking-[0.2em] uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  The Old Way
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-7 leading-tight">
                  Traditional trade houses
                </h3>

                <ul className="space-y-4">
                  {[
                    "Quotes take 5–7 business days — sometimes longer",
                    "Layered communication, no single owner of your account",
                    "Mystery margin baked into the landed-cost number",
                    "Rigid MOQs designed for bulk-only buyers",
                    'Generic "we\'ll get back to you" auto-responders',
                    "Status updates only when you chase them",
                  ].map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mt-0.5">
                        <X size={12} strokeWidth={2.5} />
                      </span>
                      <span className="text-[15px] text-gray-600 leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* RIGHT — the Moreadorn way */}
            <Reveal direction="right" delay={150}>
              <div className="relative h-full overflow-hidden bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white p-8 lg:p-10 rounded-2xl border border-[#C8A96A]/30 shadow-2xl shadow-[#C8A96A]/20">
                {/* Ambient glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C8A96A]/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E6D3A3]/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#C8A96A]/15 border border-[#C8A96A]/30 text-[#E6D3A3] text-[10px] tracking-[0.2em] uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-pulse" />
                    The Moreadorn Way
                  </div>
                  <h3 className="text-2xl font-bold mb-7 leading-tight">
                    Founder-led, partner-first
                  </h3>

                  <ul className="space-y-4">
                    {[
                      "Replies under 24 hours, every weekday",
                      "Direct line to the founder and trade desk",
                      "Itemised landed-cost breakdown with every quote",
                      "Trial pallets, mixed containers, full FCL — your call",
                      "WhatsApp + email updates through the whole shipment",
                      "Pre-shipment inspection photos before you pay the balance",
                    ].map((line, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] flex items-center justify-center mt-0.5">
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                        </span>
                        <span className="text-[15px] text-gray-200 leading-relaxed">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 group hover:gap-3 transition-all"
              >
                See it for yourself — request a quote
                <ArrowRight size={18} className="text-[#C8A96A]" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== GLOBAL REACH PREVIEW — flag chips ============== */}
      <section className="py-20 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#E6D3A3]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT — heading + stats */}
            <Reveal direction="left" className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Global Reach
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                One trade desk,<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  every major market.
                </span>
              </h2>
              <p className="text-base text-gray-400 leading-relaxed mb-8 max-w-md">
                Active in 50+ countries across five continents — backed by
                trusted carrier partnerships and full export documentation.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                {[
                  { value: "50+", label: "Countries" },
                  { value: "5", label: "Continents" },
                  { value: "1000+", label: "Shipments" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent leading-none">
                      {s.value}
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-1.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/markets"
                className="inline-flex items-center gap-2 text-white font-semibold border-b-2 border-[#C8A96A] pb-1 group hover:gap-3 transition-all"
              >
                Explore all destinations
                <ArrowRight size={18} className="text-[#C8A96A]" />
              </Link>
            </Reveal>

            {/* RIGHT — flag chip grid */}
            <Reveal direction="right" delay={150} className="lg:col-span-7">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[
                  { flag: "🇺🇸", country: "USA", region: "N. America" },
                  { flag: "🇬🇧", country: "UK", region: "Europe" },
                  { flag: "🇩🇪", country: "Germany", region: "Europe" },
                  { flag: "🇦🇪", country: "UAE", region: "Middle East" },
                  { flag: "🇯🇵", country: "Japan", region: "E. Asia" },
                  { flag: "🇦🇺", country: "Australia", region: "Oceania" },
                  { flag: "🇨🇦", country: "Canada", region: "N. America" },
                  { flag: "🇸🇬", country: "Singapore", region: "SE Asia" },
                  { flag: "🇫🇷", country: "France", region: "Europe" },
                  { flag: "🇸🇦", country: "Saudi Arabia", region: "Middle East" },
                  { flag: "🇧🇷", country: "Brazil", region: "S. America" },
                  { flag: "🇿🇦", country: "South Africa", region: "Africa" },
                ].map((m, i) => (
                  <Reveal key={i} delay={200 + i * 40}>
                    <Link
                      to="/markets"
                      className="group block bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#C8A96A]/40 rounded-xl p-3 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl leading-none flex-shrink-0">
                          {m.flag}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white truncate group-hover:text-[#C8A96A] transition-colors">
                            {m.country}
                          </div>
                          <div className="text-[9.5px] tracking-[0.15em] uppercase text-gray-500 truncate">
                            {m.region}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {/* "and more" callout */}
              <Reveal delay={700}>
                <Link
                  to="/markets"
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#C8A96A]/30 hover:border-[#C8A96A]/60 hover:bg-[#C8A96A]/5 transition-all text-xs tracking-[0.15em] uppercase text-[#C8A96A] font-bold"
                >
                  <MapPin size={13} />
                  <CountUp end={38} suffix="+" /> &nbsp;more destinations
                  <ArrowRight size={13} />
                </Link>
              </Reveal>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== WHY CHOOSE US ============== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6D3A3]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Why Choose Us
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-6 leading-tight tracking-tight">
              Excellence in Every Detail
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Built around three uncompromising principles — value, reliability,
              and quality.
            </p>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Factory Direct Pricing",
                description:
                  "Direct manufacturer relationships and bulk-buying power deliver the most competitive rates available.",
              },
              {
                icon: Globe,
                title: "Global Shipping Network",
                description:
                  "Reliable worldwide delivery through partnerships with the world's leading carriers.",
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                description:
                  "Multi-stage QC processes ensure that only premium, compliance-checked products reach you.",
              },
            ].map((item, index) => (
              <Reveal key={index} delay={index * 120}>
                <div className="group relative p-10 rounded-3xl bg-white border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="text-[#0B0B0B]" size={30} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B0B0B] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== INDUSTRIES ============== */}
      <section className="py-20 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-[#C8A96A]/10 rounded-full blur-[140px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Industries We Serve
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Tailored Solutions<br />for Every Sector
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              From hospitality to retail, we power supply chains across diverse
              industries.
            </p>
          </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {industries.map((industry, index) => (
              <Reveal key={index} delay={index * 80}>
                <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#C8A96A]/50 hover:bg-white/10 transition-all duration-500 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <industry.icon className="text-[#0B0B0B]" size={26} />
                  </div>
                  <h3 className="font-semibold text-white text-sm tracking-wide">
                    {industry.name}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ — split editorial layout ============== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E6D3A3]/8 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT — sticky header */}
            <Reveal direction="left" className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-10 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  FAQ · {faqs.length}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B0B0B] mb-5 leading-tight tracking-tight">
                Common Questions,<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  clear answers.
                </span>
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed mb-8">
                Everything buyers typically ask before placing their first
                order — at a glance, no clicks needed.
              </p>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1.5">
                  Still curious?
                </div>
                <p className="text-sm text-[#2B2B2B] leading-relaxed">
                  Our trade desk replies within 24 hours.
                </p>
              </div>
            </Reveal>

            {/* RIGHT — Q&A cards */}
            <div className="lg:col-span-8 space-y-4">
              {faqs.map((f, i) => (
                <Reveal key={i} delay={i * 70}>
                  <article className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#C8A96A] to-[#E6D3A3] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                    <div className="relative p-6 lg:p-7">
                      <div className="flex items-start gap-5">
                        {/* Number badge */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5F1E8] to-[#FAF8F3] border border-[#C8A96A]/20 flex items-center justify-center group-hover:from-[#C8A96A] group-hover:to-[#E6D3A3] group-hover:border-transparent transition-all">
                            <span className="text-lg font-bold text-[#C8A96A] group-hover:text-[#0B0B0B] transition-colors">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Q&A */}
                        <div className="flex-1 pt-1">
                          <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-2 flex items-center gap-2">
                            Question
                            <span className="w-6 h-px bg-[#C8A96A]/40" />
                          </div>
                          <h3 className="text-base lg:text-lg font-bold text-[#0B0B0B] mb-3 leading-snug group-hover:text-[#C8A96A] transition-colors">
                            {f.q}
                          </h3>
                          <p className="text-sm text-[#6B7280] leading-relaxed">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA BANNER ============== */}
      <section className="relative py-20 overflow-hidden bg-[#F5F1E8]">
        {/* Decorative bg accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/20 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0B0B0B] border border-[#C8A96A]/20 rounded-3xl p-10 lg:p-16 overflow-hidden shadow-2xl shadow-black/40">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C8A96A]/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E6D3A3]/10 rounded-full blur-[120px]" />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-12 h-px bg-[#C8A96A]" />
                  <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                    Get Started
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
                  Ready to Start Your<br />Global Trade Journey?
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                  Get in touch with our team today for a customized quote
                  tailored to your business needs.
                </p>
              </div>

              <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-white/10 flex flex-col gap-4">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="group inline-flex items-center justify-between gap-2 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] px-8 py-5 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-[#C8A96A]/30 transition-all duration-300 tracking-wide"
                >
                  Request a Quote
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <Link
                  to="/about"
                  className="group inline-flex items-center justify-between gap-2 bg-white/5 backdrop-blur-sm border border-white/15 text-white px-8 py-5 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-[#C8A96A]/40 transition-all duration-300 tracking-wide"
                >
                  Learn More
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="flex items-center gap-2 text-xs text-white/50 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Average response within 24 hours
                </div>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
