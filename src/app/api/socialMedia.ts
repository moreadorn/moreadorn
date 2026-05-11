import { apiGet, apiPatchJson } from "./client";

export interface SocialMedia {
  id: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
  whatsapp_url: string;
  telegram_url: string;
  pinterest_url: string;
  github_url: string;
  website_url: string;
  updated_at: string;
}

export type SocialMediaInput = Omit<SocialMedia, "id" | "updated_at">;

const ENDPOINT = "/social-media/";

let cache: SocialMedia | null = null;
let inflight: Promise<SocialMedia> | null = null;
const listeners = new Set<(s: SocialMedia) => void>();

export async function fetchSocialMedia(force = false): Promise<SocialMedia> {
  if (cache && !force) return cache;
  if (!inflight) {
    inflight = apiGet<SocialMedia>(ENDPOINT)
      .then((d) => {
        cache = d;
        listeners.forEach((l) => l(d));
        return d;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function updateSocialMedia(
  payload: Partial<SocialMediaInput>,
): Promise<SocialMedia> {
  const updated = await apiPatchJson<SocialMedia>(ENDPOINT, payload);
  cache = updated;
  listeners.forEach((l) => l(updated));
  return updated;
}

export function subscribeSocialMedia(cb: (s: SocialMedia) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getCachedSocialMedia(): SocialMedia | null {
  return cache;
}
