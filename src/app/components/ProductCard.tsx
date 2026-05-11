import { ArrowUpRight, Eye } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  onClick: () => void;
}

export function ProductCard({
  name,
  description,
  image,
  onClick,
}: ProductCardProps) {
  return (
    <article
      onClick={onClick}
      className="group h-full w-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C8A96A]/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* IMAGE — wider 4:3 aspect for breathing room */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Top accent bar — appears on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

        {/* Premium pill */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur text-[#0B0B0B] font-bold px-2.5 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase shadow-sm">
          <span className="w-1 h-1 rounded-full bg-[#C8A96A]" />
          Premium
        </span>

        {/* Hover overlay slides up from bottom */}
        <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
              <Eye size={13} className="text-[#C8A96A]" />
              Quick View
            </span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] shadow-md">
              <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-[#0B0B0B] mb-2 leading-tight group-hover:text-[#C8A96A] transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#0B0B0B]">
            Get Quote
          </span>
          <ArrowUpRight
            size={15}
            className="text-[#C8A96A] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </article>
  );
}
