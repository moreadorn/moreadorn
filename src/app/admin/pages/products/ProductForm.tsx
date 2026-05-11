import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { FormField, Input, TextArea, Select } from "../../components/FormField";
import { Button } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";
import { MultiFileDropzone } from "../../components/MultiFileDropzone";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../../api/products";

/** Convert a base64 data URI back to a File so it can sit in the dropzone. */
async function dataUriToFile(uri: string, name: string): Promise<File> {
  const res = await fetch(uri);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || "application/octet-stream" });
}

function extFromDataUri(uri: string, fallback: string): string {
  const m = uri.match(/^data:([^;,]+)/);
  if (!m) return fallback;
  const mime = m[1];
  if (mime === "image/jpeg") return "jpg";
  return mime.split("/")[1] || fallback;
}

const CATEGORY_OPTIONS = [
  { value: "textiles", label: "Textiles & Fabrics" },
  { value: "electronics", label: "Electronics & Components" },
  { value: "machinery", label: "Industrial Machinery" },
  { value: "consumer", label: "Consumer Goods" },
  { value: "automotive", label: "Automotive Parts" },
  { value: "construction", label: "Construction Materials" },
  { value: "food", label: "Food & Beverages" },
  { value: "medical", label: "Medical Supplies" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "furniture", label: "Furniture & Furnishings" },
  { value: "chemicals", label: "Chemicals & Raw Materials" },
  { value: "agricultural", label: "Agricultural Products" },
  { value: "other", label: "Other" },
];

export function ProductForm() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEdit = Boolean(editId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [moq, setMoq] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [active, setActive] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Hydrate when editing.
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      try {
        const p = await getProduct(editId);
        if (cancelled) return;
        setName(p.name);
        setDescription(p.description);
        setDetails(p.details);
        setCategory(p.category);
        setTags(p.tags);
        setMoq(p.moq);
        setLeadTime(p.lead_time);
        setActive(p.active);

        // Convert existing data URIs back to File so dropzones show previews.
        const imgFiles = await Promise.all(
          (p.images ?? []).map((uri, i) =>
            dataUriToFile(uri, `image-${i + 1}.${extFromDataUri(uri, "jpg")}`),
          ),
        );
        const vidFiles = await Promise.all(
          (p.videos ?? []).map((uri, i) =>
            dataUriToFile(uri, `video-${i + 1}.${extFromDataUri(uri, "mp4")}`),
          ),
        );
        if (cancelled) return;
        setImages(imgFiles);
        setVideos(vidFiles);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        details: details.trim(),
        category,
        tags: tags.trim(),
        moq: moq.trim(),
        lead_time: leadTime.trim(),
        active,
        images,
        videos,
      };
      if (isEdit && editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Product" : "Add Product"}
        description={
          isEdit
            ? "Update an existing product. Existing images / videos are preserved unless you remove them."
            : "Fill out product details. The card will appear on the public Products page once saved."
        }
        breadcrumbs={[
          { label: "Admin" },
          { label: "Products" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} /> Back to list
          </Link>
        }
      />

      {loading && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm">
          Loading product…
        </div>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Basic information
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Core product fields shown on the catalogue card.
            </p>
            <div className="space-y-4">
              <FormField label="Product name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Cotton Fabric"
                  required
                />
              </FormField>
              <FormField label="Short description" required>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="High-quality cotton fabric for fashion and home industries…"
                  required
                />
              </FormField>
              <FormField label="Detailed description">
                <TextArea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={6}
                  placeholder="Full product details, specifications, certifications, MOQ, lead times…"
                />
              </FormField>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Product images
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Upload one or more images. The first image becomes the card
              thumbnail — use the ★ button to promote any other image.
            </p>
            <MultiFileDropzone
              files={images}
              onChange={setImages}
              accept="image"
              hintText="PNG / JPG · multiple files supported"
              showPrimaryBadge
            />
          </section>

          {/* Videos (optional) */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Product videos{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Optionally add demo / unboxing / production-floor videos.
            </p>
            <MultiFileDropzone
              files={videos}
              onChange={setVideos}
              accept="video"
              hintText="MP4 / WebM · keep individual files ≤ 5 MB for best performance"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Publishing
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Active
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Show this product on the public site.
                </div>
              </div>
              <StatusToggle active={active} onChange={setActive} />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Categorisation
            </h3>
            <div className="space-y-4">
              <FormField label="Category" required>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Tags" hint="Comma-separated.">
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="cotton, premium, bulk"
                />
              </FormField>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Pricing &amp; supply
            </h3>
            <div className="space-y-4">
              <FormField label="MOQ (Minimum order quantity)">
                <Input
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  placeholder="e.g. 500 units"
                />
              </FormField>
              <FormField label="Lead time">
                <Input
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  placeholder="e.g. 15–20 days"
                />
              </FormField>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting || loading}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Update product"
                  : "Save product"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/products")}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
