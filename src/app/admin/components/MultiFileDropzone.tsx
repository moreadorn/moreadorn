import { useEffect, useRef, useState } from "react";
import { ImagePlus, Video, X, Star } from "lucide-react";

interface MultiFileDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept: "image" | "video";
  /** Visual hint shown on the empty zone. */
  hintText?: string;
  /** Show "primary" badge on first item (only meaningful for images). */
  showPrimaryBadge?: boolean;
}

export function MultiFileDropzone({
  files,
  onChange,
  accept,
  hintText,
  showPrimaryBadge = false,
}: MultiFileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Build (and revoke) object URLs for previews
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const acceptAttr = accept === "image" ? "image/*" : "video/*";
  const mimePrefix = accept === "image" ? "image/" : "video/";

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => f.type.startsWith(mimePrefix));
    if (!valid.length) return;
    onChange([...files, ...valid]);
  };

  const removeAt = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const moveToFirst = (idx: number) => {
    if (idx === 0) return;
    const next = [...files];
    const [picked] = next.splice(idx, 1);
    next.unshift(picked);
    onChange(next);
  };

  const Icon = accept === "image" ? ImagePlus : Video;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-7 cursor-pointer transition-all ${
          drag
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40"
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Icon size={18} />
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {files.length === 0
            ? `Click or drop ${accept === "image" ? "images" : "videos"}`
            : `Add more ${accept === "image" ? "images" : "videos"}`}
        </span>
        {hintText && (
          <span className="text-xs text-slate-500">{hintText}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
          onChange={(e) => {
            const list = e.target.files ? Array.from(e.target.files) : [];
            addFiles(list);
            e.target.value = "";
          }}
        />
      </div>

      {/* Previews grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
            >
              {accept === "image" ? (
                <img
                  src={previews[idx]}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={previews[idx]}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              )}

              {/* Primary badge on first image */}
              {showPrimaryBadge && idx === 0 && (
                <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[9px] font-bold tracking-wider uppercase shadow">
                  <Star size={9} fill="currentColor" /> Primary
                </span>
              )}

              {/* Make-primary button (only on non-first) */}
              {showPrimaryBadge && idx > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    moveToFirst(idx);
                  }}
                  title="Set as primary"
                  className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-white/95 text-slate-700 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star size={12} />
                </button>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeAt(idx);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center justify-center shadow"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <p className="text-xs text-slate-500">
          {files.length} file(s) selected
          {showPrimaryBadge && files.length > 1
            ? " · click ★ to make any image primary"
            : ""}
        </p>
      )}
    </div>
  );
}
