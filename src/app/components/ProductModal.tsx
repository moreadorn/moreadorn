import {
  X,
  Send,
  Sparkles,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ImageLightbox } from "./ImageLightbox";
import { createRequestQuote } from "../api/requestQuotes";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id?: string;
    name: string;
    description: string;
    image: string;
    gallery?: string[];
    /** Optional list of video data URIs / URLs. Shown in the carousel
        and lightbox alongside images. */
    videos?: string[];
    details: string;
  };
}

function isVideoSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:video/")) return true;
  const lower = src.split("?")[0].toLowerCase();
  return /\.(mp4|webm|mov|m4v|ogg)$/.test(lower);
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    productName: product.name,
    whatsapp: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    zipCode: "",
    state: "",
    address: "",
    description: "",
  });

  // Combined media list: primary image + gallery + videos (de-duplicated).
  // The same list is used both by the inline carousel and the lightbox.
  const allImages = useMemo(() => {
    const list = [
      product.image,
      ...(product.gallery || []),
      ...(product.videos || []),
    ];
    return Array.from(new Set(list.filter(Boolean)));
  }, [product.image, product.gallery, product.videos]);

  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const currentSrc = allImages[imgIndex];
  const currentIsVideo = currentSrc ? isVideoSrc(currentSrc) : false;

  // Reset index when product changes
  useEffect(() => {
    setImgIndex(0);
  }, [product.image]);

  // Keep productName in sync if product changes while modal stays mounted
  useEffect(() => {
    setFormData((prev) => ({ ...prev, productName: product.name }));
  }, [product.name]);

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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createRequestQuote({
        category_name: "product",
        product: product.id ?? null,
        product_name: formData.productName || product.name,
        name: formData.name.trim(),
        quantity: formData.quantity.trim(),
        whatsapp: formData.whatsapp.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip_code: formData.zipCode.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
      });
      alert("Product Request Quote submitted! We will contact you shortly.");
      setFormData({
        name: "",
        quantity: "",
        productName: product.name,
        whatsapp: "",
        phone: "",
        email: "",
        country: "",
        city: "",
        zipCode: "",
        state: "",
        address: "",
        description: "",
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send the request.",
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0B0B0B]/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden grid lg:grid-cols-12">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-[#0B0B0B] transition-all z-30 shadow-lg"
        >
          <X size={18} />
        </button>

        {/* LEFT — image + details */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] text-white relative overflow-y-auto max-h-[40vh] lg:max-h-[92vh]">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative aspect-[4/3] overflow-hidden group/img bg-black">
            {currentIsVideo ? (
              <video
                key={currentSrc}
                src={currentSrc}
                controls
                playsInline
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <img
                key={currentSrc}
                src={currentSrc}
                alt={`${product.name} ${imgIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent pointer-events-none" />

            {/* Center eye icon — open lightbox */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View larger images"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all duration-300 z-10 shadow-xl"
            >
              <Eye size={22} />
            </button>

            {allImages.length > 1 && (
              <>
                {/* Prev */}
                <button
                  type="button"
                  onClick={() =>
                    setImgIndex(
                      (i) => (i - 1 + allImages.length) % allImages.length
                    )
                  }
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronLeft size={18} />
                </button>
                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setImgIndex((i) => (i + 1) % allImages.length)
                  }
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Indicator dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === imgIndex
                          ? "w-6 bg-[#C8A96A]"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* Counter top-left */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wider z-10">
                  {imgIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          <div className="relative p-6 lg:p-7">
            <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] text-[10px] font-bold tracking-[0.2em] uppercase">
              <Sparkles size={10} />
              Premium Product
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight mb-3">
              {product.name}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              {product.description}
            </p>
            <div className="pt-5 border-t border-white/10">
              <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C8A96A] mb-2 flex items-center gap-2">
                <Package size={12} />
                Product Details
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {product.details}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="lg:col-span-7 overflow-y-auto max-h-[52vh] lg:max-h-[92vh]">
          <div className="p-6 lg:p-7">
            <div className="mb-5">
              <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C8A96A] mb-2">
                Product Request Quote
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0B] leading-tight">
                Tell us your requirements
              </h3>
              <p className="text-xs text-[#6B7280] mt-1.5">
                We respond within 24 hours.
              </p>
            </div>

            {submitError && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Quantity *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1000 units"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Product Name *</label>
                <input
                  type="text"
                  required
                  readOnly
                  value={formData.productName}
                  className={`${inputCls} bg-[#F5F1E8] text-[#6B7280] cursor-not-allowed`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>WhatsApp *</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    required
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
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
                <label className={labelCls}>Email *</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Country *</label>
                  <input
                    type="text"
                    placeholder="United States"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input
                    type="text"
                    placeholder="New York"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>State</label>
                  <input
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
                  <label className={labelCls}>Zip Code</label>
                  <input
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

              <div>
                <label className={labelCls}>Address</label>
                <input
                  type="text"
                  placeholder="Street, building, suite"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  placeholder="Delivery timeline, certifications needed, packaging notes..."
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] py-3 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-[#C8A96A]/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send size={15} />
                {submitting ? "Sending…" : "Send Product Request Quote"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        initialIndex={imgIndex}
        alt={product.name}
      />
    </div>
  );
}
