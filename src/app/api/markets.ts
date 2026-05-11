import { apiDelete, apiGet, apiPatchJson, apiPostJson } from "./client";

export type RegionCode =
  | "north_america"
  | "europe"
  | "middle_east"
  | "east_asia"
  | "southeast_asia"
  | "south_asia"
  | "africa"
  | "oceania"
  | "south_america"
  | "central_america";

export interface Market {
  id: string;
  country: string;
  code: string;
  flag: string;
  region: RegionCode;
  notes: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketsPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Market[];
}

export interface CreateMarketPayload {
  country: string;
  code: string;
  flag: string;
  region: RegionCode;
  notes?: string;
  active: boolean;
}

export const REGION_LABELS: Record<RegionCode, string> = {
  north_america: "North America",
  europe: "Europe",
  middle_east: "Middle East",
  east_asia: "East Asia",
  southeast_asia: "Southeast Asia",
  south_asia: "South Asia",
  africa: "Africa",
  oceania: "Oceania",
  south_america: "South America",
  central_america: "Central America",
};

export function listMarkets(params: { all?: boolean; region?: RegionCode } = {}): Promise<MarketsPage> {
  const search = new URLSearchParams();
  if (params.all) search.set("all", "1");
  if (params.region) search.set("region", params.region);
  // Cache-bust so admin Refresh always pulls fresh state.
  search.set("_", String(Date.now()));
  return apiGet<MarketsPage>(`/markets/?${search.toString()}`);
}

export function getMarket(id: string): Promise<Market> {
  return apiGet<Market>(`/markets/${id}/?_=${Date.now()}`);
}

export function createMarket(payload: CreateMarketPayload): Promise<Market> {
  return apiPostJson<Market>("/markets/", payload);
}

export function updateMarket(
  id: string,
  payload: Partial<CreateMarketPayload>,
): Promise<Market> {
  return apiPatchJson<Market>(`/markets/${id}/`, payload);
}

export function deleteMarket(id: string): Promise<void> {
  return apiDelete(`/markets/${id}/`);
}
