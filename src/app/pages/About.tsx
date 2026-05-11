import {
  Target,
  Eye,
  Globe,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Zap,
  Sparkles,
  HeartHandshake,
  Leaf,
  Lock,
  Clock,
  MessageCircle,
  Layers,
  Quote,
  Rocket,
} from "lucide-react";
import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";

export function About() {
  const stats: { node: React.ReactNode; label: string }[] = [
    { node: <CountUp end={50} suffix="+" />, label: "Countries Served" },
    { node: <CountUp end={500} suffix="+" />, label: "Happy Clients" },
    { node: <CountUp end={1000} suffix="+" />, label: "Successful Shipments" },
    { node: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Rigorous multi-stage quality control ensures every product meets international standards.",
    },
    {
      icon: Users,
      title: "Export Compliance",
      description:
        "Full compliance with DGFT regulations and all applicable international import laws.",
    },
    {
      icon: TrendingUp,
      title: "Worldwide Shipping",
      description:
        "A reliable global logistics network ensuring timely delivery across continents.",
    },
  ];

  return (
    <div className="bg-white">
      {/* ============== HERO — dark editorial split ============== */}
      <section className="relative bg-[#0B0B0B] text-white pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT — content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm w-fit">
                <Sparkles size={12} className="text-[#C8A96A]" />
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                  Est. 2015 · Made in India
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
                A trade house<br />
                built on{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                    trust.
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#C8A96A]/20 -z-0 rounded" />
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl mb-8">
                Connecting Indian manufacturers with businesses across
                continents — premium quality at factory-direct prices, backed
                by a decade of compliance and care.
              </p>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-white/10 max-w-xl">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent leading-none">
                    <CountUp end={10} suffix="+" />
                  </div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">
                    Years
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent leading-none">
                    <CountUp end={50} suffix="+" />
                  </div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">
                    Countries
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent leading-none">
                    <CountUp end={500} suffix="+" />
                  </div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">
                    Clients
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — image collage */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#C8A96A]/30 to-[#E6D3A3]/15 rounded-[2rem] blur-3xl" />
                <div className="relative grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <img
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop"
                      alt=""
                      className="rounded-2xl shadow-2xl ring-1 ring-white/10 w-full h-48 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop"
                      alt=""
                      className="rounded-2xl shadow-2xl ring-1 ring-white/10 w-full h-32 object-cover"
                    />
                  </div>
                  <div className="space-y-3 pt-8">
                    <img
                      src="/image/Export.jpg"
                      alt="Global export operations"
                      className="rounded-2xl shadow-2xl ring-1 ring-white/10 w-full h-32 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=600&fit=crop"
                      alt=""
                      className="rounded-2xl shadow-2xl ring-1 ring-white/10 w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== COMPANY INTRO ============== */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E6D3A3]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-8 leading-[1.1] tracking-tight">
                Leading the Way in<br />International Trade
              </h2>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                Moreadorn is a global trade company specializing in export
                operations and bulk supply solutions. We bridge the gap between
                manufacturers and businesses worldwide, facilitating seamless
                international commerce.
              </p>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                Our expertise spans textiles, electronics, industrial machinery,
                and consumer goods. We deliver exceptional value through
                competitive pricing, reliable logistics, and an unwavering
                commitment to quality.
              </p>
              <p className="text-lg text-[#6B7280] mb-12 leading-relaxed">
                With a presence in key global markets and partnerships with
                leading manufacturers, we ensure our clients receive premium
                products at factory-direct prices.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: CheckCircle, text: "ISO Certified Operations" },
                  { icon: Zap, text: "Fast Global Delivery" },
                  { icon: Award, text: "Quality Guaranteed" },
                  { icon: Users, text: "Expert Support Team" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-[#0B0B0B]" size={22} />
                    </div>
                    <span className="font-semibold text-[#0B0B0B]">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#C8A96A]/20 to-[#E6D3A3]/10 rounded-[2rem] blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=1100&fit=crop"
                alt="Global business meeting"
                className="relative rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] p-10 rounded-3xl shadow-2xl">
                <p className="text-5xl font-bold text-[#0B0B0B] mb-1">
                  <CountUp end={10} suffix="+" />
                </p>
                <p className="text-[#0B0B0B] font-semibold text-sm tracking-wide uppercase">
                  Years of Excellence
                </p>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ============== MISSION & VISION ============== */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Our Purpose
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] leading-tight tracking-tight">
              Mission &amp; Vision
            </h2>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To empower businesses worldwide by providing seamless access to premium quality products at competitive prices, while maintaining the highest standards of service, integrity, and reliability in every transaction.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                description:
                  "To become the most trusted and preferred global trade partner, recognized for our commitment to excellence, innovation in supply chain solutions, and our role in facilitating sustainable international commerce.",
              },
            ].map((item, index) => (
              <Reveal key={index} delay={index * 150}>
              <div
                className="group relative p-12 rounded-3xl bg-white border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="text-[#0B0B0B]" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-[#0B0B0B] mb-6">
                  {item.title}
                </h3>
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  {item.description}
                </p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== GLOBAL PRESENCE ============== */}
      <section className="py-32 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8A96A]/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Global Reach
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Operating Across<br />
              <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                Continents
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A worldwide network purpose-built to serve your business needs.
            </p>
          </div>

          <div className="flex justify-center mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C8A96A]/30 to-[#E6D3A3]/30 rounded-full blur-3xl" />
              <Globe size={140} className="relative text-[#C8A96A]" />
            </div>
          </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 100}>
              <div
                className="text-center p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#C8A96A]/40 transition-all duration-500"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent mb-3">
                  {stat.node}
                </div>
                <div className="text-gray-300 font-medium tracking-wide text-sm uppercase">
                  {stat.label}
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TRUST BADGES ============== */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Why Trust Us
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] leading-tight tracking-tight">
              Why Businesses<br />Choose Moreadorn
            </h2>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Reveal key={index} delay={index * 120}>
              <div
                className="group relative p-10 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="text-[#0B0B0B]" size={30} />
                </div>
                <h3 className="text-2xl font-bold text-[#0B0B0B] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {value.description}
                </p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW WE WORK — startup-flavoured working style + founder's note ============== */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute -top-32 left-0 w-[500px] h-[500px] bg-[#C8A96A]/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  How We Work
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-5 leading-tight tracking-tight">
                A young trade house<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  that picks up the phone.
                </span>
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                We started Moreadorn to make exporting feel personal again —
                fewer layers between you and the people moving your goods, and
                more conversations that actually solve things.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              {
                icon: HeartHandshake,
                title: "Founder-led",
                desc: "Every account starts with a conversation with the founder. No hand-offs, no escalation tickets.",
              },
              {
                icon: MessageCircle,
                title: "Real-time updates",
                desc: "WhatsApp, email, or call — pick what works. You'll hear back within hours, not days.",
              },
              {
                icon: Layers,
                title: "Tailored shipments",
                desc: "Trial pallet, mixed container, or full FCL — we shape the order around your launch plan.",
              },
              {
                icon: Rocket,
                title: "Built for SMEs",
                desc: "We grew up alongside small businesses, so flexible MOQs and patient onboarding are the norm here.",
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

          {/* Founder's note — editorial pull-quote */}
          <Reveal>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#C8A96A]/15 to-[#E6D3A3]/8 rounded-[2rem] blur-2xl" />
              <div className="relative bg-[#0B0B0B] text-white rounded-3xl p-10 lg:p-14 border border-white/10 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#C8A96A]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#E6D3A3]/15 rounded-full blur-3xl" />

                <div className="relative">
                  <Quote
                    size={42}
                    className="text-[#C8A96A] mb-6"
                    strokeWidth={1.5}
                  />
                  <p className="text-xl lg:text-2xl text-white leading-relaxed font-light mb-8">
                    "We didn't build Moreadorn to be the biggest exporter — we
                    built it to be the one buyers actually <em className="text-[#E6D3A3] not-italic font-medium">enjoy</em> working
                    with. If a quote takes more than a day, that's on us. If a
                    container ships late, you'll hear from me first."
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center">
                      <Sparkles size={18} className="text-[#0B0B0B]" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Founding Team</div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] mt-1">
                        Moreadorn
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== OUR COMMITMENT ============== */}
      <section className="py-20 bg-[#F5F1E8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/15 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Our Commitment
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-6 leading-tight tracking-tight">
              Built on Promises<br />We Keep
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Four guarantees that define every transaction, every shipment,
              every partnership.
            </p>
          </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HeartHandshake,
                title: "Honest Partnerships",
                desc: "Transparent pricing, no hidden fees, and clear communication at every step.",
              },
              {
                icon: Lock,
                title: "Secure Transactions",
                desc: "Trusted payment terms with escrow and L/C support for buyer protection.",
              },
              {
                icon: Leaf,
                title: "Ethical Sourcing",
                desc: "Suppliers vetted for fair labor practices and environmental responsibility.",
              },
              {
                icon: Clock,
                title: "On-Time Delivery",
                desc: "98% on-time dispatch rate, with real-time tracking from origin to dock.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
              <div
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="text-[#0B0B0B]" size={26} />
                </div>
                <h3 className="text-lg font-bold text-[#0B0B0B] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
