import { apiDelete, apiGet, apiPatchJson, apiPostJson } from "./client";

export type QuoteStatus = "new" | "contacted" | "quoted" | "closed";

/** Source of the request — set by the originating form on the public site. */
export type QuoteCategory = "product" | "contact" | "info";

export interface RequestQuote {
  id: string;
  category_name: QuoteCategory;
  product: string | null;
  product_name: string;
  product_image: string | null;
  name: string;
  quantity: string;
  whatsapp: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  address: string;
  description: string;
  status: QuoteStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface RequestQuotesPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: RequestQuote[];
}

export interface CreateRequestQuotePayload {
  category_name: QuoteCategory;
  product?: string | null;
  product_name?: string;
  name: string;
  quantity?: string;
  whatsapp?: string;
  phone?: string;
  email: string;
  country?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  address?: string;
  description: string;
}

export function listRequestQuotes(
  params: {
    status?: QuoteStatus;
    category?: QuoteCategory;
    product?: string;
  } = {},
): Promise<RequestQuotesPage> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.category) search.set("category_name", params.category);
  if (params.product) search.set("product", params.product);
  // Cache-bust so admin Refresh always pulls fresh data.
  search.set("_", String(Date.now()));
  return apiGet<RequestQuotesPage>(`/request-quotes/?${search.toString()}`);
}

export function createRequestQuote(
  payload: CreateRequestQuotePayload,
): Promise<RequestQuote> {
  return apiPostJson<RequestQuote>("/request-quotes/", payload);
}

export function updateRequestQuoteStatus(
  id: string,
  status: QuoteStatus,
): Promise<RequestQuote> {
  return apiPatchJson<RequestQuote>(`/request-quotes/${id}/`, { status });
}

export function deleteRequestQuote(id: string): Promise<void> {
  return apiDelete(`/request-quotes/${id}/`);
}

/** Display label shown in pills + table cells. */
export const CATEGORY_LABELS: Record<QuoteCategory, string> = {
  product: "Product",
  contact: "ContactUs",
  info: "RequestInfoQuote",
};

/** Tailwind classes for the highlighted category pill in the table. */
export const CATEGORY_BADGE_STYLES: Record<QuoteCategory, string> = {
  product:
    "bg-indigo-50 text-indigo-700 ring-indigo-200",
  contact:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  info: "bg-amber-50 text-amber-700 ring-amber-200",
};
