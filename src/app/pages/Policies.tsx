import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  Shield,
  Globe,
  AlertTriangle,
  ArrowRight,
  Mail,
  BookOpen,
  RotateCcw,
  CreditCard,
  Lock,
  HelpCircle,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { Reveal } from "../components/Reveal";
import { useCompanyContact } from "../hooks/useCompanyContact";

const PER_PAGE = 4;

export function Policies() {
  const contact = useCompanyContact();
  // The single email shown on this page — admin's query email if present,
  // otherwise the public contact email. Empty string means render the
  // graceful "use the contact form" branch instead of a fake mailto.
  const policyEmail =
    (contact?.query_email || contact?.contact_email || "").trim();
  const policyEmailHref = policyEmail ? `mailto:${policyEmail}` : "/contact";

  const [page, setPage] = useState(1);

  // Each article rendered as a JSX node in this array — slice for pagination.
  const policyArticles = [
    <article
      key="customs"
      className="group relative w-full bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-[#C8A96A]/30 hover:border-[#C8A96A]/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/15 leading-none select-none pointer-events-none">
          01
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-[#C8A96A] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-[10px] tracking-[0.2em] uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Important
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Customs &amp; Duties Notice
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              All orders ship from India. Your order may be subject to import
              duties, taxes, and customs clearance fees by US Customs (CBP).
              These are the <strong>buyer's responsibility</strong> and are{" "}
              <strong>NOT included</strong> in our pricing.
            </p>
            <p>
              We cannot predict the exact amount. For more info, visit{" "}
              <a
                href="https://www.cbp.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A96A] hover:underline font-semibold"
              >
                cbp.gov
              </a>
              .
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-[#C8A96A]/20 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 01 · Buyer Responsibility
          </div>
        </div>
      </div>
    </article>,

    <article
      key="origin"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          02
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <Globe className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Disclosure
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Product Origin Disclosure
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              All products are{" "}
              <strong>manufactured and shipped from India</strong>. Per US FTC
              guidelines, we clearly disclose that our products are{" "}
              <strong>Made in India</strong>.
            </p>
            <p>
              Products comply with Indian export regulations and US import
              standards. Country of origin is marked on packaging as required
              by US customs law.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 02 · FTC Compliant
          </div>
        </div>
      </div>
    </article>,

    <article
      key="compliance"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          03
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <Shield className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Restrictions
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Export &amp; Import Compliance
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              We comply with India's DGFT export regulations and all
              applicable US import laws.
            </p>
            <p className="font-bold text-[#0B0B0B]">
              We do not ship internationally:
            </p>
            <ul className="space-y-1.5 ml-1">
              {[
                "Prohibited or restricted chemicals",
                "Counterfeit or trademark-infringing goods",
                "Products banned by US FDA or CBP",
                "Items on India's restricted export list",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 03 · DGFT Aligned
          </div>
        </div>
      </div>
    </article>,

    <article
      key="regulatory"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          04
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <FileText className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Regulatory
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Compliance Standards
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              Moreadorn operates in full compliance with international trade
              laws. We work closely with regulatory authorities to meet
              required standards on every shipment.
            </p>
            <p>
              Our compliance team reviews and updates processes regularly to
              align with current regulations in all markets we serve.
            </p>
            <p className="pt-1">
              {policyEmail ? (
                <a
                  href={policyEmailHref}
                  className="inline-flex items-center gap-1.5 text-[#C8A96A] hover:underline font-semibold"
                >
                  {policyEmail}
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-[#C8A96A] hover:underline font-semibold"
                >
                  Reach the team via the contact form
                </Link>
              )}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 04 · Always Updated
          </div>
        </div>
      </div>
    </article>,

    <article
      key="returns"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          05
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <RotateCcw className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Returns
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Returns &amp; Refunds
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              Every shipment is inspected and photographed before dispatch.
              Claims for shortages, damages, or quality issues must be raised
              within <strong>15 days of delivery</strong> with supporting
              photos and the original packing list.
            </p>
            <p>
              Approved claims are resolved with one of: a replacement
              shipment, a credit note against your next order, or a refund
              for the affected line items. Return shipping for confirmed
              defects is on us.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 05 · Buyer Protection
          </div>
        </div>
      </div>
    </article>,

    <article
      key="payment"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          06
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Payment
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Payment Terms
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              Standard terms are <strong>30% advance</strong> on order
              confirmation and <strong>70% against B/L copy</strong> before
              shipment release. For repeat partners, we extend net-30 and
              L/C-at-sight terms on request.
            </p>
            <p>
              We accept wire transfer, L/C, and escrow via reputable
              third-party platforms. All invoices are issued in USD or EUR
              with the conversion rate locked at the date of confirmation.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 06 · Transparent Pricing
          </div>
        </div>
      </div>
    </article>,

    <article
      key="privacy"
      className="group relative w-full bg-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3]" />
      <div className="relative p-7 lg:p-8">
        <span className="absolute bottom-3 right-5 text-[5.5rem] font-bold text-[#C8A96A]/10 leading-none select-none pointer-events-none">
          07
        </span>

        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-xl flex items-center justify-center shadow-md">
              <Lock className="text-[#0B0B0B]" size={20} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
              Privacy
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0B0B0B] leading-tight mb-4">
            Privacy &amp; Data Handling
          </h2>

          <div className="space-y-3 text-sm text-[#2B2B2B] leading-relaxed">
            <p>
              We collect only the information needed to fulfil your enquiry
              or shipment — contact details, delivery address, and order
              specifics. Your data is never sold or shared with marketers.
            </p>
            <p>
              Buyer information is shared with carriers and customs brokers
              strictly for the purpose of moving your goods. You can request
              an export or deletion of your personal data at any time by
              writing to{" "}
              {policyEmail ? (
                <a
                  href={policyEmailHref}
                  className="text-[#C8A96A] hover:underline font-semibold"
                >
                  {policyEmail}
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="text-[#C8A96A] hover:underline font-semibold"
                >
                  our team via the contact form
                </Link>
              )}
              .
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-semibold">
            <span className="w-6 h-px bg-[#C8A96A]" />
            Section 07 · Confidential
          </div>
        </div>
      </div>
    </article>,
  ];

  const totalPages = Math.max(1, Math.ceil(policyArticles.length / PER_PAGE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return policyArticles.slice(start, start + PER_PAGE);
    // policyArticles depends only on JSX, treat as stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("policies-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div className="bg-white pt-24">
      {/* ============== HERO — dark with document stack ============== */}
      <section className="relative bg-[#0B0B0B] text-white pt-32 pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT — content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm w-fit">
                <Shield size={12} className="text-[#C8A96A]" />
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                  Legal &amp; Compliance
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
                Transparent.<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  Compliant.
                </span><br />
                Accountable.
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl">
                Every shipment backed by full documentation, recognized
                certifications, and clear regulatory disclosures.
              </p>
            </div>

            {/* RIGHT — stacked document cards with subtle bg images */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative h-[400px]">
                {[
                  {
                    rotate: "rotate-[-7deg]",
                    offset: "top-0 left-0",
                    icon: AlertTriangle,
                    title: "Customs &amp; Duties",
                    code: "01",
                    image:
                      "https://images.unsplash.com/photo-1494412519320-aa613df615a4?w=600&h=400&fit=crop",
                  },
                  {
                    rotate: "rotate-[4deg]",
                    offset: "top-12 left-20",
                    icon: Globe,
                    title: "Origin Disclosure",
                    code: "02",
                    image:
                      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
                  },
                  {
                    rotate: "rotate-[-3deg]",
                    offset: "top-28 left-6",
                    icon: Shield,
                    title: "Export Compliance",
                    code: "03",
                    image:
                      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop",
                  },
                  {
                    rotate: "rotate-[6deg]",
                    offset: "top-44 left-24",
                    icon: FileText,
                    title: "Regulatory",
                    code: "04",
                    image:
                      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className={`absolute ${d.offset} ${d.rotate} w-72 bg-white text-[#0B0B0B] rounded-2xl shadow-2xl border border-[#C8A96A]/30 overflow-hidden transition-transform hover:rotate-0 hover:scale-105 hover:z-20`}
                    style={{ zIndex: 10 + i }}
                  >
                    {/* Bg image — visible but soft */}
                    <img
                      src={d.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
                    />
                    {/* Soft white wash for readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-white/75 pointer-events-none" />

                    {/* Content */}
                    <div className="relative p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center shadow-md">
                          <d.icon size={18} className="text-[#0B0B0B]" />
                        </div>
                        <span className="text-3xl font-bold text-[#C8A96A]/50 leading-none drop-shadow-sm">
                          {d.code}
                        </span>
                      </div>
                      <div className="text-[9px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1">
                        Policy
                      </div>
                      <h3
                        className="text-base font-bold leading-tight text-[#0B0B0B]"
                        dangerouslySetInnerHTML={{ __html: d.title }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Content — paginated grid */}
      <section
        id="policies-grid"
        className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 mb-12 items-start">
            {pageItems.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                {item}
              </Reveal>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          {totalPages > 1 && (
            <div className="mt-6 text-center text-sm text-[#6B7280]">
              Page {page} of {totalPages} · {policyArticles.length} policies total
            </div>
          )}

          {/* Last Updated */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-[#6B7280] text-sm tracking-wide">
              Last Updated: May 3, 2026
            </p>
          </div>
        </div>
      </section>

      {/* ============== COMPLIANCE FAQ ============== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute -top-32 left-0 w-[500px] h-[500px] bg-[#C8A96A]/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] bg-[#E6D3A3]/8 rounded-full blur-[140px]" />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Common Questions
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] mb-4 leading-tight tracking-tight">
                Compliance, simplified
              </h2>
              <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                The questions buyers raise most often before placing their
                first order — answered in plain language.
              </p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {[
              {
                q: "Who pays the import duties at the destination port?",
                a: "Import duties, GST/VAT, and customs clearance fees are the buyer's responsibility — these are charged by the destination country and aren't included in our quote. We can share an indicative range for major lanes on request.",
              },
              {
                q: "Do you handle customs clearance on the destination side?",
                a: "Origin-side documentation and clearance from India are included in every shipment. Destination clearance is normally handled by your local broker, but we can recommend trusted partners in most major markets if you don't have one yet.",
              },
              {
                q: "What documents do I receive with each shipment?",
                a: "Commercial invoice, packing list, certificate of origin, and bill of lading — all verified and shared digitally before dispatch. Originals follow by courier or via your nominated freight forwarder.",
              },
              {
                q: "What happens if a shipment is delayed or damaged in transit?",
                a: "Every shipment is covered by cargo insurance up to 110% of invoice value. If transit is delayed by carrier issues or goods arrive damaged, we file the claim alongside you and arrange a replacement or credit while it's processed.",
              },
              {
                q: "Can you ship to a country not currently on your list?",
                a: "In most cases, yes. The countries listed on our Markets page are our most active lanes — for a new destination, share the product, volume, and destination port and we'll confirm feasibility within one business day.",
              },
              {
                q: "How are restricted or prohibited goods handled?",
                a: "Every order is screened against India's DGFT export list and the destination country's import restrictions before we accept it. If a product can't ship to a particular market, we tell you up front rather than mid-process.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <details className="group bg-gradient-to-br from-[#FAF8F3] to-white rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 transition-all overflow-hidden">
                  <summary className="flex items-start gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center text-[#0B0B0B] font-bold text-xs tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="flex-1 text-base font-bold text-[#0B0B0B] leading-snug pt-1.5 group-hover:text-[#C8A96A] transition-colors">
                      {item.q}
                    </h3>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F5F1E8] text-[#C8A96A] flex items-center justify-center text-lg font-bold transition-transform group-open:rotate-45">
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

          <Reveal delay={500}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F1E8] text-[#6B7280] text-xs">
                <HelpCircle size={14} className="text-[#C8A96A]" />
                Have a different question?{" "}
                {policyEmail ? (
                  <a
                    href={policyEmailHref}
                    className="text-[#C8A96A] hover:underline font-semibold"
                  >
                    Ask the compliance team
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    className="text-[#C8A96A] hover:underline font-semibold"
                  >
                    Ask via the contact form
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== COMPLIANCE CONTACT & REFERENCES ============== */}
      <section className="py-20 bg-[#F5F1E8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/15 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Compliance Resources
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0B0B0B] mb-6 leading-tight tracking-tight">
              Need Clarification<br />or Documentation?
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Reach our compliance team directly, or consult the official
              authorities referenced in these policies.
            </p>
          </div>
          </Reveal>

          <Reveal>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Direct compliance contact */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-5">
                <Mail className="text-[#0B0B0B]" size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0B] mb-2">
                Compliance Team
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                For questions about customs, certifications, restricted goods,
                or country-specific regulations.
              </p>
              {policyEmail ? (
                <a
                  href={policyEmailHref}
                  className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 hover:gap-3 transition-all text-sm"
                >
                  {policyEmail}
                  <ArrowRight size={16} className="text-[#C8A96A]" />
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 hover:gap-3 transition-all text-sm"
                >
                  Use the contact form
                  <ArrowRight size={16} className="text-[#C8A96A]" />
                </Link>
              )}
            </div>

            {/* General inquiries */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center mb-5">
                <BookOpen className="text-[#0B0B0B]" size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0B] mb-2">
                General Inquiries
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                For sourcing requests, shipment status, partnership questions,
                or anything else.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[#0B0B0B] font-semibold border-b-2 border-[#C8A96A] pb-1 hover:gap-3 transition-all text-sm"
              >
                Visit contact page
                <ArrowRight size={16} className="text-[#C8A96A]" />
              </Link>
            </div>
          </div>
          </Reveal>

          <Reveal delay={150}>
          {/* Compliance Commitments */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 lg:p-9">
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C8A96A] mb-1.5">
                  Our Commitments
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#0B0B0B] leading-tight">
                  How We Stay Compliant
                </h3>
              </div>
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-bold">
                Audited
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Full documentation, every shipment",
                  desc: "Commercial invoice, packing list, COO, and B/L verified before dispatch.",
                  number: "01",
                },
                {
                  title: "Restricted goods pre-screening",
                  desc: "Every order scanned against destination-country restricted lists.",
                  number: "02",
                },
                {
                  title: "Audit-ready records",
                  desc: "Seven-year retention of all trade documents, accessible on request.",
                  number: "03",
                },
                {
                  title: "24-hour compliance support",
                  desc: "Dedicated team responds to regulatory queries within one business day.",
                  number: "04",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-[#FAF8F3] to-white rounded-xl p-5 border border-gray-100 hover:border-[#C8A96A]/40 transition-all"
                >
                  <span className="absolute top-3 right-4 text-3xl font-bold text-[#C8A96A]/20 leading-none select-none pointer-events-none">
                    {c.number}
                  </span>
                  <div className="relative pr-10">
                    <h4 className="font-bold text-[#0B0B0B] mb-2 leading-tight group-hover:text-[#C8A96A] transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-[#6B7280] flex items-center gap-2 flex-wrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96A]" />
              Questions about our compliance practices? Reach{" "}
              {policyEmail ? (
                <a
                  href={policyEmailHref}
                  className="text-[#C8A96A] hover:underline font-semibold"
                >
                  {policyEmail}
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="text-[#C8A96A] hover:underline font-semibold"
                >
                  our team via the contact form
                </Link>
              )}
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
