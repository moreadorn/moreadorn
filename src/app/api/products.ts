import {
  apiDelete,
  apiGet,
  apiPatchForm,
  apiPatchJson,
  apiPostForm,
} from "./client";

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  category: string;
  tags: string;
  moq: string;
  lead_time: string;
  /** List of base64 data URIs. images[0] is the primary card image. */
  images: string[];
  /** Optional list of base64 data URIs (videos). */
  videos: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface CreateProductPayload {
  name: string;
  description: string;
  details?: string;
  category: string;
  tags?: string;
  moq?: string;
  lead_time?: string;
  active: boolean;
  /** Files in display order — first will be the primary thumbnail. */
  images: File[];
  /** Optional. */
  videos?: File[];
}

function buildFormData(payload: CreateProductPayload): FormData {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("description", payload.description);
  fd.append("details", payload.details ?? "");
  fd.append("category", payload.category);
  fd.append("tags", payload.tags ?? "");
  fd.append("moq", payload.moq ?? "");
  fd.append("lead_time", payload.lead_time ?? "");
  fd.append("active", payload.active ? "true" : "false");
  // Repeated field names → backend reads them as a list.
  payload.images.forEach((f) => fd.append("images", f));
  (payload.videos ?? []).forEach((f) => fd.append("videos", f));
  return fd;
}

export function listProducts(params: { all?: boolean } = {}): Promise<ProductsPage> {
  // Cache-bust so admin Refresh always pulls fresh state.
  const parts = [params.all ? "all=1" : null, `_=${Date.now()}`].filter(Boolean);
  return apiGet<ProductsPage>(`/products/?${parts.join("&")}`);
}

export function getProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}/?_=${Date.now()}`);
}

export function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiPostForm<Product>("/products/", buildFormData(payload));
}

export function updateProduct(
  id: string,
  payload: CreateProductPayload,
): Promise<Product> {
  return apiPatchForm<Product>(`/products/${id}/`, buildFormData(payload));
}

export function updateProductStatus(
  id: string,
  active: boolean,
): Promise<Product> {
  return apiPatchJson<Product>(`/products/${id}/`, { active });
}

export function deleteProduct(id: string): Promise<void> {
  return apiDelete(`/products/${id}/`);
}
