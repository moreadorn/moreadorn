import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { FormField, Input, TextArea } from "../../components/FormField";
import { Button } from "../../components/Buttons";
import { StatusToggle } from "../../components/StatusToggle";
import { MultiFileDropzone } from "../../components/MultiFileDropzone";
import { createBlog, getBlog, updateBlog } from "../../../api/blogs";

const todayISO = () => new Date().toISOString().slice(0, 10);

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

export function BlogForm() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEdit = Boolean(editId);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("moreAdorn");
  const [tags, setTags] = useState("");
  const [publishDate, setPublishDate] = useState(todayISO());
  // Default ON — clicking "Save article" should publish to the public site
  // by default. Toggle off explicitly to keep as draft.
  const [published, setPublished] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Hydrate when editing an existing blog.
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      try {
        const blog = await getBlog(editId);
        if (cancelled) return;
        setTitle(blog.title);
        setExcerpt(blog.excerpt);
        setBody(blog.body);
        setAuthor(blog.author);
        setTags(blog.tags);
        setPublishDate(blog.publish_date || todayISO());
        setPublished(blog.published);

        // Convert existing data URIs back to File objects so the dropzone
        // can show previews and the user can add / remove media.
        const imgFiles = await Promise.all(
          (blog.images ?? []).map((uri, i) =>
            dataUriToFile(uri, `image-${i + 1}.${extFromDataUri(uri, "jpg")}`),
          ),
        );
        const vidFiles = await Promise.all(
          (blog.videos ?? []).map((uri, i) =>
            dataUriToFile(uri, `video-${i + 1}.${extFromDataUri(uri, "mp4")}`),
          ),
        );
        if (cancelled) return;
        setImages(imgFiles);
        setVideos(vidFiles);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load blog.");
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
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        author: author.trim() || "moreAdorn",
        tags: tags.trim(),
        published,
        publish_date: publishDate || null,
        images,
        videos,
      };
      if (isEdit && editId) {
        await updateBlog(editId, payload);
      } else {
        await createBlog(payload);
      }
      navigate("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Blog" : "Write Blog"}
        description={
          isEdit
            ? "Update an existing article. Publishing state and media are preserved."
            : "Compose a new article for your readers. Publish or save as a draft."
        }
        breadcrumbs={[
          { label: "Admin" },
          { label: "Blogs" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} /> Back to list
          </Link>
        }
      />

      {loading && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm">
          Loading article…
        </div>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Article</h3>
            <p className="text-xs text-slate-500 mb-5">
              Title, summary, and the full body of your article.
            </p>
            <div className="space-y-4">
              <FormField label="Title" required>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Customs Clearance: A Practical Buyer's Checklist"
                  required
                />
              </FormField>
              <FormField
                label="Excerpt"
                required
                hint="Short teaser shown on the blog list card."
              >
                <TextArea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="A practical, step-by-step checklist every importer should run before placing their first PO…"
                  required
                />
              </FormField>
              <FormField label="Body" required>
                <TextArea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  placeholder="Write your full article here. Markdown is supported."
                  required
                />
              </FormField>
            </div>
          </section>

          {/* Multi-image upload */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Images{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Upload one or more images. The first image becomes the article's
              hero — use the ★ button to promote any other image.
            </p>
            <MultiFileDropzone
              files={images}
              onChange={setImages}
              accept="image"
              hintText="PNG / JPG · multiple files supported"
              showPrimaryBadge
            />
          </section>

          {/* Multi-video upload */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Videos{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Optionally embed video alongside the article — explainer clips,
              interviews, factory tours.
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
            <h3 className="text-sm font-bold text-slate-900 mb-5">Publishing</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Publish
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When off, this article is saved as draft.
                </div>
              </div>
              <StatusToggle active={published} onChange={setPublished} />
            </div>
            <FormField label="Publish date">
              <Input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </FormField>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Metadata</h3>
            <div className="space-y-4">
              <FormField label="Author">
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="moreAdorn"
                />
              </FormField>
              <FormField label="Tags" hint="Comma-separated.">
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="customs, compliance, import"
                />
              </FormField>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting || loading}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Update article"
                  : "Save article"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/blogs")}
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
