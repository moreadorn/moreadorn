import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Sparkles,
  Calculator,
  FileSearch,
  Truck,
  ShieldCheck,
  PackageCheck,
  Leaf,
  FileText,
  PenLine,
  HelpCircle,
  Quote,
} from "lucide-react";
import { blogPosts as staticBlogPosts, type BlogPost } from "../data/blogs";
import { BlogModal } from "../components/BlogModal";
import { Pagination } from "../components/Pagination";
import { Reveal } from "../components/Reveal";
import { CountUp } from "../components/CountUp";
import { EmptyState } from "../components/EmptyState";
import { listBlogs, type Blog as ApiBlog } from "../api/blogs";
import { useCompanyContact } from "../hooks/useCompanyContact";

const PER_PAGE = 9;

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";

function mapApiBlog(b: ApiBlog): BlogPost {
  // images[0] is the article hero. Subsequent entries become gallery shots
  // displayed inside the modal.
  const list = b.images ?? [];
  return {
    id: b.id,
    category: "",
    readTime: "",
    title: b.title,
    excerpt: b.excerpt,
    image: list[0] || PLACEHOLDER_IMG,
    gallery: list.slice(1),
    author: b.author,
    date: b.publish_date
      ? new Date(b.publish_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(b.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    content: (b.body || "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

export function Blog() {
  const contact = useCompanyContact();
  const editorialEmail =
    (contact?.query_email || contact?.contact_email || "").trim();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Start with the static articles so the page never looks empty while the
  // API request is in flight or fails. Admin-added blogs are merged in front
  // once the fetch resolves.
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listBlogs();
        if (cancelled) return;
        const apiPosts = data.results.map(mapApiBlog);
        // Admin-added (API) posts first, then the curated static articles.
        // Dedupe in case a static slug ever collides with an API id.
        const seen = new Set<string>();
        const merged: BlogPost[] = [];
        [...apiPosts, ...staticBlogPosts].forEach((p) => {
          if (seen.has(p.id)) return;
          seen.add(p.id);
          merged.push(p);
        });
        setBlogPosts(merged);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        // Fall back to static-only if the API is unreachable.
        setBlogPosts(staticBlogPosts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(blogPosts.length / PER_PAGE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return blogPosts.slice(start, start + PER_PAGE);
  }, [page, blogPosts]);

  const topics = [
    {
      icon: Calculator,
      title: "Cost & Pricing",
      desc: "Calculate true landed cost, decode Incoterms, and price imports profitably.",
      count: 2,
    },
    {
      icon: FileSearch,
      title: "Customs & Compliance",
      desc: "Documentation walkthroughs, HS codes, and country-specific regulations.",
      count: 2,
    },
    {
      icon: PackageCheck,
      title: "Sourcing Strategy",
      desc: "Verify suppliers, negotiate MOQs, and structure payment terms.",
      count: 3,
    },
    {
      icon: Truck,
      title: "Logistics & Shipping",
      desc: "Choose the right freight mode, manage transit times, and reduce damage.",
      count: 2,
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      desc: "Pre-shipment inspections, AQL sampling, and rework protocols.",
      count: 1,
    },
    {
      icon: Leaf,
      title: "Sustainability",
      desc: "Build greener supply chains and meet rising buyer expectations.",
      count: 1,
    },
  ];

  // Scroll back to top of grid on page change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("blog-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const openPost = (post: BlogPost) => {
    setSelected(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelected(null), 250);
  };

  return (
    <div className="bg-white">
      {/* ============== HERO — dark magazine with featured article ============== */}
      <section className="relative bg-[#0B0B0B] text-white pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-[#E6D3A3]/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          {/* Top label bar */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8A96A]/40 bg-white/5 backdrop-blur-sm">
              <Sparkles size={12} className="text-[#C8A96A]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#E6D3A3] uppercase">
                The Trade Journal
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
              Issue 01 · 2026
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT — heading */}
            <div className="lg:col-span-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
                Insights<br />
                for{" "}
                <span className="italic font-extralight text-[#C8A96A]">
                  smarter
                </span>
                <br />
                trade.
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl mb-6">
                Practical guides written by our trade desk — landed cost,
                customs documentation, supplier verification, and more.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
                  <CountUp end={blogPosts.length} /> &nbsp;articles
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
                  Updated weekly
                </span>
              </div>
            </div>

            {/* RIGHT — featured article card */}
            {blogPosts[0] && (
              <div className="lg:col-span-6 hidden lg:block">
                <div
                  onClick={() => openPost(blogPosts[0])}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#C8A96A]/30 to-[#E6D3A3]/15 rounded-[2rem] blur-2xl group-hover:from-[#C8A96A]/50 transition-all" />
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute top-5 left-5 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-[#0B0B0B] text-white font-bold px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
                        Featured Read
                      </span>
                    </div>
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] tracking-[0.2em] uppercase text-[#C8A96A] font-bold mb-2">
                        {blogPosts[0].date}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-[#0B0B0B] leading-snug group-hover:text-[#C8A96A] transition-colors mb-2">
                        {blogPosts[0].title}
                      </h3>
                      <p className="text-sm text-[#6B7280] line-clamp-2">
                        {blogPosts[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============== BLOG GRID ============== */}
      <section
        id="blog-grid"
        className="py-20 bg-white relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-px bg-[#C8A96A]" />
              <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                Latest Articles
              </span>
              <div className="w-12 h-px bg-[#C8A96A]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight">
              Read &amp; Stay Ahead
            </h2>
          </div>

          {loading && blogPosts.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[460px] rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : blogPosts.length === 0 ? (
            <Reveal>
              <EmptyState
                icon={FileText}
                eyebrow="Articles Loading"
                title="The Trade Journal is Being Curated"
                message="Our team is preparing in-depth guides on trade, compliance, and logistics. New articles publish here as soon as they're ready."
                ctaText="Suggest a Topic"
                ctaTo="/contact"
              />
            </Reveal>
          ) : (
          <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pageItems.map((post, idx) => (
              <Reveal key={post.id} delay={idx * 80}>
                <article
                  onClick={() => openPost(post)}
                  className="group relative h-[460px] w-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                >
                  {/* Image — fixed height */}
                  <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/40 via-transparent to-transparent" />

                    {/* Date pill on image */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur text-[#0B0B0B] font-bold px-3 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase shadow-sm">
                      <span className="w-1 h-1 rounded-full bg-[#C8A96A]" />
                      {post.date}
                    </span>

                    {/* Article number */}
                    <span className="absolute bottom-3 left-3 text-4xl font-bold text-white/90 leading-none drop-shadow-lg">
                      №{String((page - 1) * 9 + idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content — flex-1 to fill remaining */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-[#0B0B0B] mb-2 leading-snug group-hover:text-[#C8A96A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B7280] font-semibold">
                        {post.author}
                      </span>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F1E8] text-[#C8A96A] group-hover:bg-gradient-to-br group-hover:from-[#C8A96A] group-hover:to-[#E6D3A3] group-hover:text-[#0B0B0B] transition-all">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Page {page} of {totalPages} · {blogPosts.length} articles total
          </div>
          </>
          )}
        </div>
      </section>

      {/* ============== TOPICS WE COVER ============== */}
      <section className="relative py-20 bg-[#F5F1E8] overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A96A]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#E6D3A3]/15 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  What You'll Learn
                </span>
                <div className="w-12 h-px bg-[#C8A96A]" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] mb-5 leading-tight tracking-tight">
                Six pillars of practical<br />international trade
              </h2>
              <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                Every article fits into one of these themes — pick a pillar
                and dive deep, or browse them all.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group h-full bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <t.icon size={22} className="text-[#0B0B0B]" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F1E8] text-[#C8A96A] text-[10px] tracking-wider font-bold">
                      {t.count} {t.count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B0B0B] mb-2 leading-tight group-hover:text-[#C8A96A] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-12 text-center text-sm text-[#6B7280]">
              {editorialEmail ? (
                <>
                  Have a topic suggestion? Email us at{" "}
                  <a
                    href={`mailto:${editorialEmail}`}
                    className="text-[#C8A96A] hover:underline font-semibold"
                  >
                    {editorialEmail}
                  </a>
                </>
              ) : (
                <>
                  Have a topic suggestion?{" "}
                  <Link
                    to="/contact"
                    className="text-[#C8A96A] hover:underline font-semibold"
                  >
                    Send it through the contact form
                  </Link>
                  {" "}and our editorial team will pick it up.
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== FROM OUR TRADE DESK — editorial intro + reader questions ============== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-[#C8A96A]/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 left-0 w-[400px] h-[400px] bg-[#E6D3A3]/8 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* LEFT — editorial intro */}
            <Reveal direction="left" className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#C8A96A]" />
                <span className="text-[#C8A96A] font-semibold tracking-[0.25em] text-xs uppercase">
                  From Our Trade Desk
                </span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight mb-5">
                Written by the<br />
                <span className="bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] bg-clip-text text-transparent">
                  people doing the work.
                </span>
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed mb-6">
                Every article on this journal comes from a real shipment, a
                real buyer question, or a problem we've solved on the floor.
                No outsourced fluff, no AI-generated lists — just notes from
                the trade desk you can put to use the same week.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: PenLine,
                    label: "First-hand notes",
                    desc: "Written by the founders and trade-desk team.",
                  },
                  {
                    icon: HelpCircle,
                    label: "Reader-led topics",
                    desc: "Most pieces start as a question a buyer asked us.",
                  },
                  {
                    icon: Sparkles,
                    label: "No filler",
                    desc: "Short, specific, and built around real numbers.",
                  },
                ].map((it, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F3] border border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] flex items-center justify-center flex-shrink-0">
                      <it.icon size={16} className="text-[#0B0B0B]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0B0B0B]">
                        {it.label}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        {it.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* RIGHT — questions readers ask + a pull-quote */}
            <div className="lg:col-span-7 space-y-4">
              <Reveal delay={100}>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold mb-1">
                  Questions buyers actually ask us
                </div>
                <p className="text-base text-[#6B7280] leading-relaxed mb-4">
                  These are the conversations that turn into articles. If
                  yours isn't here yet, write to us — odds are someone else is
                  asking the same thing.
                </p>
              </Reveal>

              {[
                "What does my landed cost actually look like, line by line?",
                "How small can my first trial order be?",
                "Which freight mode makes sense for a sample run?",
                "How do I verify a supplier I've never met?",
                "What changes when I move from LCL to a full container?",
                "How do I keep margins steady when the rupee swings?",
              ].map((q, i) => (
                <Reveal key={i} delay={120 + i * 60}>
                  <div className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#C8A96A]/40 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F5F1E8] text-[#C8A96A] flex items-center justify-center text-xs font-bold tracking-wider group-hover:bg-gradient-to-br group-hover:from-[#C8A96A] group-hover:to-[#E6D3A3] group-hover:text-[#0B0B0B] transition-all">
                      Q{i + 1}
                    </div>
                    <p className="text-[15px] text-[#0B0B0B] font-medium leading-relaxed pt-1">
                      {q}
                    </p>
                  </div>
                </Reveal>
              ))}

              {/* Reader pull-quote */}
              <Reveal delay={500}>
                <div className="relative mt-6 bg-gradient-to-br from-[#0B0B0B] to-[#1a1a1a] text-white rounded-2xl p-7 overflow-hidden border border-white/10">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#C8A96A]/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <Quote
                      size={28}
                      className="text-[#C8A96A] mb-3"
                      strokeWidth={1.5}
                    />
                    <p className="text-[15px] text-gray-200 leading-relaxed mb-4 italic">
                      "Most trade blogs read like textbooks. This one reads
                      like a WhatsApp answer from a friend who actually ships
                      containers — that's why I keep coming back."
                    </p>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-[#C8A96A] font-bold">
                      Reader feedback · early subscriber
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <BlogModal isOpen={modalOpen} onClose={closeModal} post={selected} />
    </div>
  );
}
