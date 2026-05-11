import {
  apiDelete,
  apiGet,
  apiPatchJson,
  apiPostJson,
} from "./client";

export interface AiApiKey {
  id: string;
  label: string;
  model_name: string;
  active: boolean;
  /** Masked preview, e.g. "gsk_••••••••XXXX". Never the raw value. */
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAiApiKeyPayload {
  label: string;
  model_name: string;
  active?: boolean;
  /** The raw key — write-only on the backend. */
  api_key_input: string;
}

export interface UpdateAiApiKeyPayload {
  label?: string;
  model_name?: string;
  active?: boolean;
  /** Optional on update. Pass a non-empty string to overwrite. */
  api_key_input?: string;
}

interface PaginatedKeys {
  count: number;
  next: string | null;
  previous: string | null;
  results: AiApiKey[];
}

export async function listAiApiKeys(): Promise<AiApiKey[]> {
  // DRF defaults to PageNumberPagination — unwrap to a plain array. Also
  // tolerates the case where pagination is disabled and a raw array comes
  // back, so the page works in either configuration.
  const data = await apiGet<PaginatedKeys | AiApiKey[]>(
    `/ai-keys/?_=${Date.now()}`,
  );
  return Array.isArray(data) ? data : (data.results ?? []);
}

export function getAiApiKey(id: string): Promise<AiApiKey> {
  return apiGet<AiApiKey>(`/ai-keys/${id}/?_=${Date.now()}`);
}

export function createAiApiKey(
  payload: CreateAiApiKeyPayload,
): Promise<AiApiKey> {
  return apiPostJson<AiApiKey>("/ai-keys/", payload);
}

export function updateAiApiKey(
  id: string,
  payload: UpdateAiApiKeyPayload,
): Promise<AiApiKey> {
  return apiPatchJson<AiApiKey>(`/ai-keys/${id}/`, payload);
}

export function deleteAiApiKey(id: string): Promise<void> {
  return apiDelete(`/ai-keys/${id}/`);
}
