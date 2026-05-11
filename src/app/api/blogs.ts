import {
  apiDelete,
  apiGet,
  apiPatchForm,
  apiPatchJson,
  apiPostForm,
} from "./client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  tags: string;
  /** List of base64 data URIs. images[0] is the hero/cover image. */
  images: string[];
  /** Optional list of base64 video data URIs. */
  videos: string[];
  published: boolean;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogsPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

export interface CreateBlogPayload {
  title: string;
  excerpt: string;
  body: string;
  author?: string;
  tags?: string;
  published: boolean;
  publish_date?: string | null;
  /** Optional. First file is the hero image. */
  images?: File[];
  /** Optional. */
  videos?: File[];
}

function buildBlogFormData(payload: CreateBlogPayload): FormData {
  const fd = new FormData();
  fd.append("title", payload.title);
  fd.append("excerpt", payload.excerpt);
  fd.append("body", payload.body);
  fd.append("author", payload.author ?? "moreAdorn");
  fd.append("tags", payload.tags ?? "");
  fd.append("published", payload.published ? "true" : "false");
  if (payload.publish_date) fd.append("publish_date", payload.publish_date);
  (payload.images ?? []).forEach((f) => fd.append("images", f));
  (payload.videos ?? []).forEach((f) => fd.append("videos", f));
  return fd;
}

export function listBlogs(params: { all?: boolean } = {}): Promise<BlogsPage> {
  // Cache-bust so admin Refresh always pulls fresh state from the API.
  const parts = [params.all ? "all=1" : null, `_=${Date.now()}`].filter(Boolean);
  return apiGet<BlogsPage>(`/blogs/?${parts.join("&")}`);
}

export function getBlog(id: string): Promise<Blog> {
  return apiGet<Blog>(`/blogs/${id}/?_=${Date.now()}`);
}

export function createBlog(payload: CreateBlogPayload): Promise<Blog> {
  return apiPostForm<Blog>("/blogs/", buildBlogFormData(payload));
}

export function updateBlog(
  id: string,
  payload: CreateBlogPayload,
): Promise<Blog> {
  return apiPatchForm<Blog>(`/blogs/${id}/`, buildBlogFormData(payload));
}

export function updateBlogStatus(
  id: string,
  published: boolean,
): Promise<Blog> {
  return apiPatchJson<Blog>(`/blogs/${id}/`, { published });
}

export function deleteBlog(id: string): Promise<void> {
  return apiDelete(`/blogs/${id}/`);
}
