import { Link } from "react-router";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaTo?: string;
}

export function EmptyState({
  icon: Icon,
  eyebrow = "Coming Soon",
  title,
  message,
  ctaText = "Talk to our team",
  ctaTo = "/contact",
}: EmptyStateProps) {
  return (
    <div className="relative py-12">
      <div className="absolute inset-0 flex items-center justify-center -z-0 pointer-events-none">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-[#C8A96A]/10 to-[#E6D3A3]/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div className="relative bg-gradient-to-br from-white to-[#FAF8F3] rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          {/* gold top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent" />

          {/* corner sparkle bg */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#C8A96A]/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#E6D3A3]/15 to-transparent rounded-full blur-2xl" />

          <div className="relative p-10 lg:p-14 text-center">
            {/* icon */}
            <div className="inline-flex relative mb-7">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-3xl blur-xl opacity-40 scale-110" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center shadow-lg shadow-[#C8A96A]/30">
                <Icon size={36} className="text-[#0B0B0B]" strokeWidth={1.8} />
              </div>
              {/* tiny sparkle accent */}
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#0B0B0B] flex items-center justify-center shadow-lg ring-2 ring-[#C8A96A]/40">
                <Sparkles size={12} className="text-[#C8A96A]" />
              </div>
            </div>

            {/* eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-bold tracking-[0.3em] text-[10px] uppercase">
                {eyebrow}
              </span>
              <div className="w-8 h-px bg-[#C8A96A]" />
            </div>

            {/* title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-[#0B0B0B] mb-4 leading-tight tracking-tight">
              {title}
            </h3>

            {/* message */}
            <p className="text-base lg:text-lg text-[#6B7280] leading-relaxed max-w-md mx-auto mb-8">
              {message}
            </p>

            {/* dashed divider */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A96A]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A96A]/40" />
            </div>

            {/* CTA */}
            {ctaText && ctaTo && (
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 bg-[#0B0B0B] hover:bg-[#2B2B2B] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:gap-3 shadow-lg hover:shadow-xl"
              >
                {ctaText}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* footnote */}
        <p className="text-center text-xs text-[#6B7280] mt-6 tracking-wide">
          Updates published as our catalogue expands.
        </p>
      </div>
    </div>
  );
}
