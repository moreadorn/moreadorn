import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Search,
  ClipboardList,
  PackageCheck,
  Package,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Pagination } from "../components/Pagination";
import { Reveal } from "../components/Reveal";
import { EmptyState } from "../components/EmptyState";
import { listProducts, type Product as ApiProduct } from "../api/products";

const PER_PAGE = 9;

interface Product {
  id?: string;
  name: string;
  description: string;
  image: string;
  gallery?: string[];
  videos?: string[];
  details: string;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'></svg>";

function mapApiProduct(p: ApiProduct): Product {
  // images[0] is the primary card image; the rest are gallery shots.
  // videos render alongside the gallery inside the modal carousel.
  // Each entry is already a complete data URI (no transformation needed).
  const list = p.images ?? [];
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    image: list[0] || PLACEHOLDER_IMG,
    gallery: list.slice(1),
    videos: p.videos ?? [],
    details: p.details || p.description,
  };
}

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch active products from the Django API on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listProducts();
        if (cancelled) return;
        setProducts(data.results.map(mapApiProduct));
      } catch (err) {
        // Soft-fail: log + leave empty so the EmptyState renders.
        console.error("Failed to load products:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return products.slice(start, start + PER_PAGE);
  }, [page, products]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("products-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="bg-white">
      {/* ============== HERO — dark split with product collage ============== */}
      <section className="relative bg-[#0B0B0B] text-white pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[140px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT — content */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm w-fit">
                <Sparkles size={12} className="text-[#C8A96A]" />
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                  Product Catalogue
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
                Twelve categories.<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  Endless possibilities.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl">
                From premium textiles to industrial machinery — premium products
                sourced, inspected, and shipped worldwide.
              </p>
            </div>

            {/* RIGHT — overlapping image collage */}
            <div className="lg:col-span-6 hidden lg:block">
              <div className="relative h-[420px] w-full max-w-[440px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96A]/25 to-transparent rounded-[2rem] blur-3xl" />

                {/* Top-left — fabric / textile-like */}
                <img
                  src="/image/export2.jpg"
                  alt="Premium export products"
                  className="absolute top-0 left-2 w-44 h-52 object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 rotate-[-7deg]"
                />
                {/* Top-right — electronics */}
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=700&fit=crop"
                  alt=""
                  className="absolute top-2 right-2 w-44 h-52 object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 rotate-[7deg]"
                />
                {/* Bottom-left — industrial / blueprint */}
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=700&fit=crop"
                  alt=""
                  className="absolute bottom-0 left-10 w-44 h-52 object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 rotate-[6deg]"
                />
                {/* Bottom-right — trade desk */}
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=700&fit=crop"
                  alt=""
                  className="absolute bottom-2 right-10 w-44 h-52 object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 rotate-[-6deg]"
                />

                {/* Floating badge — center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] px-5 py-2.5 rounded-full font-bold text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#C8A96A]/40 z-20 ring-4 ring-[#0B0B0B]">
                  12 Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PRODUCTS GRID ============== */}
      <section
        id="products-grid"
        className="py-20 bg-white relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Browse Our Range
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] leading-tight tracking-tight">
              Twelve Categories,<br />Endless Possibilities
            </h2>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <Reveal>
              <EmptyState
                icon={Package}
                eyebrow="Catalogue Loading"
                title="Our Product Catalogue is Being Curated"
                message="We're handpicking the finest export-ready products to share here. Check back shortly — or reach out for a tailored sourcing brief."
                ctaText="Request a Custom Quote"
                ctaTo="/contact"
              />
            </Reveal>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 auto-rows-fr">
                {pageItems.map((product, index) => (
                  <Reveal
                    key={`${page}-${index}`}
                    delay={index * 70}
                    className="h-full"
                  >
                    <ProductCard
                      name={product.name}
                      description={product.description}
                      image={product.image}
                      onClick={() => handleProductClick(product)}
                    />
                  </Reveal>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

              <div className="mt-6 text-center text-sm text-[#6B7280]">
                Page {page} of {totalPages} · {products.length} products total
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============== QUALITY ASSURANCE ============== */}
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/15 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  Quality Assurance
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                Every Product,<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  Built to Last
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                From sourcing to dispatch, every shipment passes through a
                rigorous multi-stage quality process designed for international
                trade.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Award,
                    title: "Certified Manufacturers",
                    desc: "Only ISO and industry-certified suppliers",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Multi-Stage QC",
                    desc: "Pre-shipment inspection on every order",
                  },
                  {
                    icon: Truck,
                    title: "Secure Logistics",
                    desc: "Insured shipping with real-time tracking",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-[#0B0B0B]" size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg mb-1">
                        {item.title}
                      </div>
                      <div className="text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#C8A96A]/20 to-[#E6D3A3]/10 rounded-[2rem] blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=900&h=1100&fit=crop"
                alt="Quality warehouse"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============== CUSTOM SOURCING PROCESS ============== */}
      <section className="py-20 bg-[#F5F1E8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/15 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Custom Sourcing
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#0B0B0B] mb-6 leading-tight tracking-tight">
              Don't See What<br />You Need?
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Our network reaches far beyond the catalogue. Share a brief —
              we'll source it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: ClipboardList,
                step: "01",
                title: "Send a Brief",
                desc: "Specs, target price, quantity, delivery destination — as much detail as you have.",
              },
              {
                icon: Search,
                step: "02",
                title: "Supplier Match",
                desc: "We shortlist 3–5 vetted manufacturers and verify samples and production capacity.",
              },
              {
                icon: PackageCheck,
                step: "03",
                title: "Sample &amp; Approve",
                desc: "Pre-production samples shipped for your sign-off before mass production begins.",
              },
              {
                icon: Truck,
                step: "04",
                title: "Produce &amp; Ship",
                desc: "Multi-stage QC, full documentation, and door-to-door delivery on agreed timeline.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <p.icon className="text-[#0B0B0B]" size={26} />
                  </div>
                  <span className="text-4xl font-bold text-gray-100 group-hover:text-[#C8A96A]/30 transition-colors">
                    {p.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0B0B0B] mb-3">
                  {p.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#C8A96A]/30 p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-[#0B0B0B]" size={20} />
              </div>
              <div>
                <div className="font-bold text-[#0B0B0B] mb-0.5">
                  Have a custom requirement?
                </div>
                <div className="text-sm text-[#6B7280]">
                  Email us your brief — we respond within 24 hours.
                </div>
              </div>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#0B0B0B] hover:bg-[#2B2B2B] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all"
            >
              Send a Brief
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
