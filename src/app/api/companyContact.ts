import { apiGet, apiPatchJson } from "./client";

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusinessHour {
  day: WeekDay;
  is_open: boolean;
  open_time: string; // "HH:MM" or ""
  close_time: string; // "HH:MM" or ""
}

export interface CompanyContact {
  id: string;
  query_email: string;
  contact_email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  google_maps_url: string;
  business_hours: BusinessHour[];
  updated_at: string;
}

export type CompanyContactInput = Omit<CompanyContact, "id" | "updated_at">;

export const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { day: "monday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "tuesday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "wednesday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "thursday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "friday", is_open: true, open_time: "09:00", close_time: "18:00" },
  { day: "saturday", is_open: true, open_time: "10:00", close_time: "16:00" },
  { day: "sunday", is_open: false, open_time: "", close_time: "" },
];

const ENDPOINT = "/company-contact/";

// Module-level cache so Footer / Contact / Navigation don't each refetch.
let cache: CompanyContact | null = null;
let inflight: Promise<CompanyContact> | null = null;
const listeners = new Set<(c: CompanyContact) => void>();

export async function fetchCompanyContact(
  forceRefresh = false,
): Promise<CompanyContact> {
  if (cache && !forceRefresh) return cache;
  if (!inflight) {
    inflight = apiGet<CompanyContact>(ENDPOINT)
      .then((data) => {
        cache = normalize(data);
        listeners.forEach((l) => l(cache!));
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function updateCompanyContact(
  payload: Partial<CompanyContactInput>,
): Promise<CompanyContact> {
  const updated = await apiPatchJson<CompanyContact>(ENDPOINT, payload);
  cache = normalize(updated);
  listeners.forEach((l) => l(cache!));
  return cache;
}

export function subscribeCompanyContact(
  cb: (c: CompanyContact) => void,
): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getCachedCompanyContact(): CompanyContact | null {
  return cache;
}

/** Ensure business_hours is always a complete 7-day array, in week order. */
function normalize(c: CompanyContact): CompanyContact {
  const byDay = new Map<WeekDay, BusinessHour>();
  (c.business_hours ?? []).forEach((h) => byDay.set(h.day, h));
  const filled = DEFAULT_BUSINESS_HOURS.map(
    (d) => byDay.get(d.day) ?? { ...d },
  );
  return { ...c, business_hours: filled };
}
