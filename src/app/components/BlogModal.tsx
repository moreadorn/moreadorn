import {
  X,
  Calendar,
  Clock,
  User,
  Quote,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "../data/blogs";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

export function BlogModal({ isOpen, onClose, post }: BlogModalProps) {
  const allImages = useMemo(() => {
    if (!post) return [] as string[];
    const list = [post.image, ...(post.gallery || [])];
    return Array.from(new Set(list.filter(Boolean)));
  }, [post]);

  const [imgIndex, setImgIndex] = useState(0);

  // Reset image index when post changes
  useEffect(() => {
    setImgIndex(0);
  }, [post?.id]);

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

  if (!isOpen || !post) return null;

  // Pick mid paragraph as pull quote
  const midIndex = Math.floor(post.content.length / 2);
  const pullQuote =
    post.content[midIndex]?.split(". ")[0] || post.content[0]?.split(". ")[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0B0B0B]/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-[#FAF8F3] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden grid lg:grid-cols-12">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 bg-[#0B0B0B] hover:bg-[#2B2B2B] rounded-full flex items-center justify-center text-white transition-all z-30 shadow-lg"
        >
          <X size={18} />
        </button>

        {/* LEFT — image */}
        <div className="lg:col-span-5 relative bg-[#0B0B0B] overflow-hidden max-h-[40vh] lg:max-h-[92vh]">
          <img
            key={allImages[imgIndex]}
            src={allImages[imgIndex]}
            alt={`${post.title} ${imgIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent pointer-events-none" />

          {/* Category badge top-left */}
          <div className="absolute top-5 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] font-bold px-3 py-1.5 rounded-full tracking-[0.15em] uppercase text-[10px]">
              <Tag size={11} />
              {post.category}
            </span>
          </div>

          {/* Counter top-right (next to close, but on left side image) */}
          {allImages.length > 1 && (
            <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wider z-10">
              {imgIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Prev / Next buttons */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setImgIndex(
                    (i) => (i - 1 + allImages.length) % allImages.length
                  )
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setImgIndex((i) => (i + 1) % allImages.length)
                }
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Author info bottom-left */}
          <div className="absolute bottom-5 left-5 right-5 text-white z-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#E6D3A3] mb-1">
              Written by
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center text-[#0B0B0B] font-bold flex-shrink-0">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm">{post.author}</div>
                <div className="text-[11px] text-gray-400">{post.date}</div>
              </div>
            </div>

            {/* Dot indicators */}
            {allImages.length > 1 && (
              <div className="flex gap-1.5">
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
            )}
          </div>
        </div>

        {/* RIGHT — content */}
        <article className="lg:col-span-7 overflow-y-auto max-h-[52vh] lg:max-h-[92vh]">
          <div className="p-6 sm:p-8 lg:p-10 pr-14">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-[#C8A96A]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase">
                Trade Insights
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B0B0B] leading-[1.15] tracking-tight mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#6B7280] mb-7 pb-6 border-b border-[#C8A96A]/20">
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-[#C8A96A]" />
                <span className="font-medium">{post.author}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[#C8A96A]" />
                {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-[#C8A96A]" />
                {post.readTime}
              </span>
            </div>

            {/* Lead paragraph with drop cap */}
            <p className="text-base text-[#0B0B0B] leading-[1.8] mb-5 first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:text-[#C8A96A] first-letter:mr-2 first-letter:mt-1 first-letter:leading-none">
              {post.excerpt}
            </p>

            {/* Body paragraphs split around a pull quote */}
            <div className="space-y-4 text-[#2B2B2B] leading-[1.8] text-[15px]">
              {post.content.slice(0, midIndex).map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {/* Pull quote */}
              {pullQuote && (
                <figure className="my-8 py-6 border-y-2 border-[#C8A96A]/30 relative">
                  <Quote
                    className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF8F3] px-3 text-[#C8A96A]"
                    size={32}
                    strokeWidth={1.5}
                  />
                  <blockquote className="text-lg sm:text-xl font-semibold text-[#0B0B0B] italic text-center leading-snug px-3">
                    "{pullQuote}."
                  </blockquote>
                </figure>
              )}

              {post.content.slice(midIndex).map((p, i) => (
                <p key={`b-${i}`}>{p}</p>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-[#C8A96A]/20">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0B0B] text-white text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
                  Moreadorn Insights
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
