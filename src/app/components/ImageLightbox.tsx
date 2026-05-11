import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  /** Mixed list of image / video data URIs (or absolute URLs). */
  images: string[];
  initialIndex?: number;
  alt?: string;
}

/**
 * Detect whether a given source URI is a video.
 * - data URIs: check the MIME prefix (`data:video/...`)
 * - regular URLs: fall back to common video file extensions
 */
function isVideoSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:video/")) return true;
  const lower = src.split("?")[0].toLowerCase();
  return /\.(mp4|webm|mov|m4v|ogg)$/.test(lower);
}

export function ImageLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  alt = "Product image",
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  // Sync index with prop when modal opens / initialIndex changes
  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  const total = images.length;
  const hasMany = total > 1;
  const currentSrc = images[index];
  const isVideo = isVideoSrc(currentSrc);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0B0B]/95 backdrop-blur-sm">
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {hasMany && (
        <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold tracking-wider">
          {index + 1} <span className="text-white/50">/ {total}</span>
        </div>
      )}

      {/* Prev */}
      {hasMany && (
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Media */}
      <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center px-4">
        {isVideo ? (
          <video
            key={currentSrc}
            src={currentSrc}
            controls
            autoPlay
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl bg-black"
          />
        ) : (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={`${alt} ${index + 1}`}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>

      {/* Next */}
      {hasMany && (
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
        >
          <ChevronRight size={26} />
        </button>
      )}

      {/* Thumbnails — videos get a dark background + play overlay */}
      {hasMany && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
          {images.map((src, i) => {
            const itemIsVideo = isVideoSrc(src);
            return (
              <button
                key={src.slice(0, 32) + i}
                onClick={() => setIndex(i)}
                aria-label={
                  itemIsVideo ? `Play video ${i + 1}` : `Go to image ${i + 1}`
                }
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all bg-black ${
                  i === index
                    ? "border-[#C8A96A] ring-2 ring-[#C8A96A]/40"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                {itemIsVideo ? (
                  <>
                    <video
                      src={src}
                      muted
                      playsInline
                      preload="metadata"
                      controlsList="nodownload"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play
                        size={18}
                        className="text-white drop-shadow-md"
                        fill="currentColor"
                      />
                    </span>
                  </>
                ) : (
                  <img src={src} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
